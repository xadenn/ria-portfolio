import fs from "fs/promises";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import { defaultPortfolioData } from "@/lib/default-data";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import { PortfolioModel } from "@/models/Portfolio";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio.json");

// In-memory fallback if file system access has any issue
let memoryCache: PortfolioData | null = null;

async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // directory exists or cannot be created
  }
}

export async function getPortfolioData(): Promise<{
  data: PortfolioData;
  source: "mongodb" | "local-file" | "default";
  mongoConfigured: boolean;
}> {
  const mongoConfigured = isMongoConfigured();

  // 1. Try MongoDB first if configured
  if (mongoConfigured) {
    try {
      const db = await connectToDatabase();
      if (db) {
        const doc = await PortfolioModel.findOne().sort({ updatedAt: -1 }).lean();
        if (doc) {
          const { _id, __v, ...cleanDoc } = doc as unknown as { _id?: unknown; __v?: unknown } & PortfolioData;
          return {
            data: cleanDoc as PortfolioData,
            source: "mongodb",
            mongoConfigured: true,
          };
        } else {
          // Seed MongoDB with actual local file data if available, else defaultPortfolioData
          let seedData: PortfolioData = defaultPortfolioData;
          try {
            await ensureDataDirectory();
            const localRaw = await fs.readFile(DATA_FILE, "utf-8");
            const parsed = JSON.parse(localRaw) as PortfolioData;
            if (parsed && parsed.profile && parsed.projects) {
              seedData = parsed;
            }
          } catch {
            seedData = defaultPortfolioData;
          }

          await PortfolioModel.create({
            ...seedData,
            updatedAt: new Date().toISOString(),
          });

          return {
            data: seedData,
            source: "mongodb",
            mongoConfigured: true,
          };
        }
      }
    } catch (err) {
      console.warn("Error reading from MongoDB, falling back to local file:", err);
    }
  }

  // 2. Try local file fallback
  try {
    await ensureDataDirectory();
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(fileContent) as PortfolioData;
    memoryCache = parsed;
    return {
      data: parsed,
      source: "local-file",
      mongoConfigured,
    };
  } catch {
    // 3. Fallback to default initial data & save it to file
    try {
      await ensureDataDirectory();
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultPortfolioData, null, 2), "utf-8");
    } catch {
      // ignore
    }
    memoryCache = defaultPortfolioData;
    return {
      data: defaultPortfolioData,
      source: "default",
      mongoConfigured,
    };
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<{
  data: PortfolioData;
  savedToMongo: boolean;
  savedToFile: boolean;
}> {
  const dataToSave: PortfolioData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  let savedToMongo = false;
  let savedToFile = false;

  // 1. Save to MongoDB if available
  if (isMongoConfigured()) {
    try {
      const db = await connectToDatabase();
      if (db) {
        await PortfolioModel.findOneAndUpdate(
          {},
          { $set: dataToSave },
          { upsert: true, returnDocument: "after" }
        );
        savedToMongo = true;
      }
    } catch (err) {
      console.error("Failed to save to MongoDB:", err);
    }
  }

  // 2. Always persist to local file as backup / zero-config store
  try {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2), "utf-8");
    savedToFile = true;
  } catch (err) {
    console.warn("Failed to write to local portfolio.json:", err);
  }

  memoryCache = dataToSave;

  return {
    data: dataToSave,
    savedToMongo,
    savedToFile,
  };
}

export async function resetPortfolioData(): Promise<PortfolioData> {
  return (await savePortfolioData(defaultPortfolioData)).data;
}
