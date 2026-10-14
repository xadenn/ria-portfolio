import mongoose, { Schema, Model } from "mongoose";
import { PortfolioData } from "@/types/portfolio";

const ProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    subtitles: [{ type: String }],
    collaborations: [{ type: String }],
    university: { type: String },
    location: { type: String },
    email: { type: String },
    phone: { type: String },
    resumeUrl: { type: String },
    headline: { type: String },
    aboutText: { type: String },
    socials: {
      linkedin: { type: String },
      github: { type: String },
      behance: { type: String },
    },
    heroImage: { type: String },
    portraitImage: { type: String },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    client: { type: String },
    category: { type: String },
    year: { type: String },
    image: { type: String },
    description: { type: String },
    metrics: { type: String },
    deliverables: [{ type: String }],
    url: { type: String },
  },
  { _id: false }
);

const ToolSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: String },
    desc: { type: String },
  },
  { _id: false }
);

const DesignSchema = new Schema(
  {
    id: { type: String, required: true },
    src: { type: String, required: true },
    alt: { type: String },
    title: { type: String },
  },
  { _id: false }
);

const AchievementSchema = new Schema(
  {
    id: { type: String, required: true },
    metric: { type: String },
    title: { type: String, required: true },
    organization: { type: String },
    description: { type: String },
    tag: { type: String },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    id: { type: String, required: true },
    number: { type: String },
    name: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const JourneySchema = new Schema(
  {
    id: { type: String, required: true },
    period: { type: String },
    role: { type: String, required: true },
    company: { type: String, required: true },
    summary: { type: String },
    highlights: [{ type: String }],
  },
  { _id: false }
);

const PortfolioSchema = new Schema<PortfolioData>(
  {
    profile: { type: ProfileSchema, required: true },
    projects: [ProjectSchema],
    tools: [ToolSchema],
    designs: [DesignSchema],
    achievements: [AchievementSchema],
    services: [ServiceSchema],
    journey: [JourneySchema],
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>)._id;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// High-efficiency index for rapid single-doc lookup and recency sorting
PortfolioSchema.index({ updatedAt: -1 });

export const PortfolioModel: Model<PortfolioData> =
  mongoose.models.Portfolio || mongoose.model<PortfolioData>("Portfolio", PortfolioSchema);

