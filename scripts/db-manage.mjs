#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT_DIR, "data", "portfolio.json");
const ENV_FILE = path.join(ROOT_DIR, ".env.local");

// Load .env.local if present
async function loadEnvLocal() {
  try {
    const raw = await fs.readFile(ENV_FILE, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx > -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        // remove surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch {
    // .env.local does not exist yet
  }
}

function cleanMongoUri(raw) {
  if (!raw) return "";
  let uri = raw.trim();

  // Strip accidental placeholder brackets <password>
  uri = uri.replace(
    /(mongodb(?:\+srv)?:\/\/[^:]+:)<([^>]+)>(@.+)/,
    "$1$2$3"
  );
  uri = uri.replace(
    /(mongodb(?:\+srv)?:\/\/)(?:<([^>]+)>):([^@]+)(@.+)/,
    "$1$2:$3$4"
  );

  // Default database name to 'portfolio'
  if (/mongodb\.net\/?(\?.*)?$/.test(uri)) {
    uri = uri.replace(/mongodb\.net\/?(\?.*)?$/, (match, query) => {
      return `mongodb.net/portfolio${query || "?retryWrites=true&w=majority"}`;
    });
  }

  return uri;
}

// Minimal Portfolio Mongoose Schema
const PortfolioSchema = new mongoose.Schema(
  {
    profile: { type: Object, required: true },
    projects: { type: Array, default: [] },
    tools: { type: Array, default: [] },
    designs: { type: Array, default: [] },
    achievements: { type: Array, default: [] },
    services: { type: Array, default: [] },
    journey: { type: Array, default: [] },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

PortfolioSchema.index({ updatedAt: -1 });

const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

async function verifyConnection(uri) {
  console.log("\n=======================================================");
  console.log(" 🔍 MONGODB ATLAS CONNECTION VERIFIER");
  console.log("=======================================================");

  const sanitizedUri = uri.replace(/:[^:@]+@/, ":****@");
  console.log(`Target: ${sanitizedUri}`);

  const start = Date.now();
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      family: 4,
    });

    const ping = await conn.connection.db.admin().ping();
    const duration = Date.now() - start;

    console.log(`\n✅ STATUS: CONNECTED SUCCESSFULLY!`);
    console.log(`   Database Name : ${conn.connection.name}`);
    console.log(`   Cluster Host  : ${conn.connection.host}`);
    console.log(`   Ping Latency  : ${duration}ms`);
    console.log(`   Ping Response : ${JSON.stringify(ping)}`);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections   : ${collections.map((c) => c.name).join(", ") || "(none yet)"}`);
    console.log("=======================================================\n");
    return conn;
  } catch (err) {
    console.error(`\n❌ STATUS: CONNECTION FAILED`);
    console.error(`   Error Code: ${err.code || "N/A"}`);
    console.error(`   Message   : ${err.message}`);

    if (err.message.includes("bad auth") || err.message.includes("Authentication failed")) {
      console.log("\n💡 DIAGNOSTIC ROOT CAUSE: Authentication Failed");
      console.log("   - Your cluster host is REACHABLE and IP is ALLOWED.");
      console.log("   - The password provided does not match the database user in MongoDB Atlas.");
      console.log("   - To fix:");
      console.log("     1. Open Atlas -> Database Access -> edit your user");
      console.log("     2. Reset or re-copy the password");
      console.log("     3. Put MONGODB_URI=... into .env.local\n");
    }
    console.log("=======================================================\n");
    return null;
  }
}

async function seedDatabase(uri) {
  const conn = await verifyConnection(uri);
  if (!conn) {
    console.error("Aborting seed: database connection could not be established.");
    process.exit(1);
  }

  console.log("📦 Loading dataset from data/portfolio.json...");
  const rawData = await fs.readFile(DATA_FILE, "utf-8");
  const data = JSON.parse(rawData);

  console.log(`   - Profile: ${data.profile?.name} (${data.profile?.role})`);
  console.log(`   - Projects: ${data.projects?.length || 0} items`);
  console.log(`   - Design Artworks: ${data.designs?.length || 0} items`);
  console.log(`   - Tech Stack: ${data.tools?.length || 0} items`);
  console.log(`   - Honors: ${data.achievements?.length || 0} items`);
  console.log(`   - Disciplines: ${data.services?.length || 0} items`);
  console.log(`   - Milestones: ${data.journey?.length || 0} items`);

  console.log("\n⚡ Writing and indexing portfolio data to MongoDB...");
  const saved = await Portfolio.findOneAndUpdate(
    {},
    {
      $set: {
        profile: data.profile,
        projects: data.projects,
        tools: data.tools,
        designs: data.designs,
        achievements: data.achievements,
        services: data.services,
        journey: data.journey,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  console.log("✅ Data successfully persisted and indexed in MongoDB Atlas!");
  console.log(`   Document ID: ${saved._id}`);
  console.log(`   Updated At : ${saved.updatedAt}`);
  console.log("\n🎉 The live portfolio website will now load all content from MongoDB Atlas with zero latency!\n");

  await mongoose.disconnect();
}

async function backupDatabase(uri) {
  const conn = await verifyConnection(uri);
  if (!conn) {
    console.error("Aborting backup: connection failed.");
    process.exit(1);
  }

  console.log("📥 Fetching document from MongoDB Atlas...");
  const doc = await Portfolio.findOne().lean();
  if (!doc) {
    console.log("No portfolio document found in MongoDB yet.");
    await mongoose.disconnect();
    return;
  }

  delete doc._id;
  delete doc.__v;

  await fs.writeFile(DATA_FILE, JSON.stringify(doc, null, 2), "utf-8");
  console.log(`✅ Snapshot saved to data/portfolio.json (Updated: ${doc.updatedAt})`);
  await mongoose.disconnect();
}

async function main() {
  await loadEnvLocal();

  const command = process.argv[2] || "verify";
  const rawUri = process.argv[3] || process.env.MONGODB_URI;

  if (!rawUri) {
    console.error("\n❌ Error: No MongoDB connection string provided.");
    console.error("Please supply it as an argument or set MONGODB_URI in .env.local:");
    console.error("  node scripts/db-manage.mjs verify \"mongodb+srv://...\"\n");
    process.exit(1);
  }

  const uri = cleanMongoUri(rawUri);

  if (command === "verify") {
    const conn = await verifyConnection(uri);
    if (conn) await mongoose.disconnect();
  } else if (command === "seed") {
    await seedDatabase(uri);
  } else if (command === "backup") {
    await backupDatabase(uri);
  } else {
    console.log(`Unknown command: ${command}. Use 'verify', 'seed', or 'backup'.`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
