export interface ProfileData {
  name: string;
  role: string;
  subtitles: string[];
  collaborations: string[];
  university: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  headline: string;
  aboutText: string;
  socials: {
    linkedin: string;
    github: string;
    behance: string;
  };
  heroImage: string;
  portraitImage: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  description: string;
  metrics: string;
  deliverables: string[];
  url?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: "Design & Prototyping" | "Engineering & Workflow";
  proficiency: string;
  desc: string;
}

export interface DesignItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
}

export interface Achievement {
  id: string;
  metric: string;
  title: string;
  organization: string;
  description: string;
  tag: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  description: string;
}

export interface JourneyMilestone {
  id: string;
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
}

export interface PortfolioData {
  profile: ProfileData;
  projects: Project[];
  tools: ToolItem[];
  designs: DesignItem[];
  achievements: Achievement[];
  services: ServiceItem[];
  journey: JourneyMilestone[];
  updatedAt?: string;
}
