import { PortfolioData } from "@/types/portfolio";

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "RIA VERMA",
    role: "Design Engineer",
    subtitles: [
      "Multidisciplinary UI/UX & Brand Designer",
      "2+ Years Industry Experience",
    ],
    collaborations: ["Quantabase", "ArcVisionX", "Internify"],
    university: "Head of Design Team @ Kristu Jayanti Univ",
    location: "Bangalore, India",
    email: "riaverma.here@gmail.com",
    phone: "+91 9508860750",
    resumeUrl: "/Ria_Verma_Resume.pdf",
    headline: "Let's build something extraordinary.",
    aboutText:
      "With 2+ years of experience in the industry, I possess a special set of skills to design fast, high-quality, and scalable interfaces for digital platforms. Some of the companies I have collaborated with and worked for include Quantabase, ArcVisionX, and Internify.",
    socials: {
      linkedin: "https://www.linkedin.com/in/riaverma-here",
      github: "https://github.com/riaverma-here",
      behance: "https://behance.net/riaverma-here",
    },
    heroImage:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85",
    portraitImage:
      "https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png",
  },
  projects: [
    {
      id: "01",
      title: "Cosmic Tools",
      client: "Cosmic Tools Platform",
      category: "UI/UX & Platform Design",
      year: "2024",
      image: "/projects/neon-place/img-14.png",
      description:
        "Cosmic Tools is a platform that offers group-buy services for premium SEO, AI, and design tools such as Semrush, Canva, and ChatGPT. Engineered high-converting user onboarding, frictionless checkout, and instant credential management.",
      metrics: "Live Platform at cosmictools.in · Group-Buy Marketplace",
      deliverables: [
        "Product UI/UX",
        "Group-Buy Architecture",
        "Design System",
        "Search & Discovery",
      ],
      url: "https://cosmictools.in",
    },
    {
      id: "02",
      title: "Hideout Cafe",
      client: "Hideout Artisanal Cafe",
      category: "Brand Design",
      year: "2024",
      image: "/cases/cafe.png",
      description:
        "A complete brand identity and spatial visual ecosystem for Hideout Cafe. Merging minimalist typographic contrast with warm hospitality touchpoints, packaging, and interior menu systems.",
      metrics: "Complete Brand Identity Launch · Physical & Digital",
      deliverables: [
        "Brand Identity",
        "Packaging Design",
        "Spatial Signage",
        "Menu Architecture",
      ],
      url: "https://behance.net/riaverma-here",
    },
    {
      id: "03",
      title: "Reflect Orbital",
      client: "Reflect Orbital Systems",
      category: "UX Research & UI Design",
      year: "2024",
      image: "/cases/reflect.png",
      description:
        "Comprehensive UX research and telemetry interface design for orbital solar reflection systems. Streamlined complex orbital parameters and sunlight scheduling into an intuitive, low-cognitive-load mission dashboard.",
      metrics: "Deep UX Field Study · Mission Control Telemetry",
      deliverables: [
        "UX Research",
        "Telemetry UI",
        "Interaction Design",
        "Cognitive Load Mapping",
      ],
      url: "https://behance.net/riaverma-here",
    },
    {
      id: "04",
      title: "Moving On",
      client: "Moving On Publication",
      category: "Editorial Design",
      year: "2023",
      image: "/cases/moving-on.png",
      description:
        "Experimental editorial publication exploring human transitions, typographic pacing, and asymmetric negative space. Curated a tactile, rhythm-driven reading journey spanning print and digital mediums.",
      metrics: "Curated Print & Digital Editorial Series",
      deliverables: [
        "Editorial Layout",
        "Typography Direction",
        "Print Scenography",
        "Digital Translation",
      ],
      url: "https://behance.net/riaverma-here",
    },
    {
      id: "05",
      title: "Quantabase",
      client: "Quantabase Intelligence",
      category: "UI/UX & Data Systems",
      year: "2024",
      image: "/images/project-flux.jpg",
      description:
        "Collaborative digital interface design for quantitative analytics and algorithmic trading models. Engineered dense telemetry visualizations and component systems optimized for fast, scalable execution.",
      metrics: "Enterprise Quant Workflow Platform",
      deliverables: [
        "Analytics Dashboard",
        "High-Density Data Grids",
        "Design System",
        "Interactive Telemetry",
      ],
      url: "https://behance.net/riaverma-here",
    },
    {
      id: "06",
      title: "ArcVisionX",
      client: "ArcVisionX Labs",
      category: "Spatial UI & Vision Tech",
      year: "2023",
      image: "/images/project-ether.jpg",
      description:
        "Futuristic vision AI branding and spatial user interface system. Built responsive multi-viewport layouts and interactive 3D inspection components for computer vision applications.",
      metrics: "Computer Vision Innovation System",
      deliverables: [
        "Spatial UI Kit",
        "Brand Guidelines",
        "Interactive 3D Preview",
        "Multi-Viewport Layout",
      ],
      url: "https://behance.net/riaverma-here",
    },
    {
      id: "07",
      title: "Internify",
      client: "Internify Talent Network",
      category: "Product Interface",
      year: "2023",
      image: "/images/project-maison.jpg",
      description:
        "Next-generation hiring and career accelerator platform matching emerging design and engineering talent with high-growth startups through frictionless search and profile discovery.",
      metrics: "Early Talent Acquisition Gateway",
      deliverables: [
        "User Onboarding",
        "Talent Profile Cards",
        "Employer Dashboard",
        "Responsive Web App",
      ],
      url: "https://behance.net/riaverma-here",
    },
  ],
  tools: [
    {
      id: "t1",
      name: "Figma",
      category: "Design & Prototyping",
      proficiency: "Expert",
      desc: "Design Systems, Auto-layout, Interactive Prototypes",
    },
    {
      id: "t2",
      name: "Adobe XD",
      category: "Design & Prototyping",
      proficiency: "Advanced",
      desc: "User Journeys, Screen Flows & Component Architecture",
    },
    {
      id: "t3",
      name: "Sketch",
      category: "Design & Prototyping",
      proficiency: "Advanced",
      desc: "Vector Design & Mobile App Interface Toolkits",
    },
    {
      id: "t4",
      name: "Photoshop",
      category: "Design & Prototyping",
      proficiency: "Advanced",
      desc: "Digital Retouching, Compositing & Art Direction",
    },
    {
      id: "t5",
      name: "Illustrator",
      category: "Design & Prototyping",
      proficiency: "Advanced",
      desc: "Logomarks, Bespoke Monograms & Vector Systems",
    },
    {
      id: "t6",
      name: "InDesign",
      category: "Design & Prototyping",
      proficiency: "Advanced",
      desc: "Editorial Grid Systems, Typography & Print Publications",
    },
    {
      id: "t7",
      name: "CorelDRAW",
      category: "Design & Prototyping",
      proficiency: "Proficient",
      desc: "Vector Print Layouts & Large-scale Collateral",
    },
    {
      id: "t8",
      name: "Canva",
      category: "Design & Prototyping",
      proficiency: "Expert",
      desc: "Rapid Social Prototypes & Promotional Layouts",
    },
    {
      id: "t9",
      name: "React & Next.js",
      category: "Engineering & Workflow",
      proficiency: "Advanced",
      desc: "Full-stack UI Engineering, App Router, SSR & Hydration",
    },
    {
      id: "t10",
      name: "TypeScript",
      category: "Engineering & Workflow",
      proficiency: "Advanced",
      desc: "Type-safe Frontends, Generics & Strict Interfaces",
    },
    {
      id: "t11",
      name: "Tailwind CSS",
      category: "Engineering & Workflow",
      proficiency: "Expert",
      desc: "Custom Design Tokens, Micro-utilities & Responsive Grids",
    },
    {
      id: "t12",
      name: "GSAP & ScrollTrigger",
      category: "Engineering & Workflow",
      proficiency: "Advanced",
      desc: "Pinning, Scrub Animations & Physics Timelines",
    },
    {
      id: "t13",
      name: "Three.js / WebGL",
      category: "Engineering & Workflow",
      proficiency: "Proficient",
      desc: "Interactive 3D Canvases, Shaders & Geometric Renders",
    },
    {
      id: "t14",
      name: "Git & GitHub",
      category: "Engineering & Workflow",
      proficiency: "Advanced",
      desc: "Version Control, Feature Branching & CI/CD Pipelines",
    },
  ],
  designs: [
    {
      id: "d1",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg",
      alt: "Diver silhouetted inside a sunset seascape shaped like a profile",
      title: "Seascape Silhouette",
    },
    {
      id: "d2",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/hero_gradient/hero-gradients-01.png",
      alt: "Soft multi-tone gradient wash",
      title: "Chromate Gradient",
    },
    {
      id: "d3",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/821d815affa6496c39cbdeeec7a84603.jpg",
      alt: "Double-exposure portrait blended with a city skyline at dusk",
      title: "Metropolis Exposure",
    },
    {
      id: "d4",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/moon/moon-grade-03.png",
      alt: "Moon-toned gradient",
      title: "Lunar Palette",
    },
    {
      id: "d5",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/937438c560ada1c83317f2c11b3454b0.jpg",
      alt: "Motion-blurred side-profile portrait against a deep orange backdrop",
      title: "Kinetic Velocity",
    },
    {
      id: "d6",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/shade_shiters/shade-shifters-05.png",
      alt: "Shifting shade gradient",
      title: "Spectrum Drift",
    },
    {
      id: "d7",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/98f89cb9994f5c382ab964062c4039db.jpg",
      alt: "Figure holding a racket that dissolves into a swirling colourful cloud",
      title: "Vapor Dispersion",
    },
    {
      id: "d8",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/shade_shiters/shade-shifters-09.png",
      alt: "Shifting shade gradient",
      title: "Opal Hue",
    },
    {
      id: "d9",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg",
      alt: "Hand gesture with a colourful cutout of a bird flying through the fingers",
      title: "Avian Freedom",
    },
    {
      id: "d10",
      src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/gradients/moon/moon-grade-06.png",
      alt: "Moon-toned gradient",
      title: "Celestial Glow",
    },
  ],
  achievements: [
    {
      id: "01",
      metric: "11+",
      title: "IT Fest Trophies Won",
      organization: "Inter & Intra-College IT Fests",
      description:
        "Awarded over 11 first-place and runner-up trophies across competitive collegiate IT festivals in user interface design, digital branding, creative thinking, and visual multimedia events.",
      tag: "Creative Competitions",
    },
    {
      id: "02",
      metric: "03",
      title: "Designathons Champion",
      organization: "National & Regional Hackathons",
      description:
        "Secured 1st place victories in 3 rigorous 24-48hr Designathons, architecting rapid user research, iterative wireframes, and production-grade prototypes under tight constraints.",
      tag: "Sprint Prototyping",
    },
    {
      id: "03",
      metric: "Head",
      title: "Head of Design Team",
      organization: "Kristu Jayanti University",
      description:
        "Led the university's flagship student design guild. Mentored emerging designers, directed institutional digital media aesthetics, and oversaw end-to-end event branding ecosystems.",
      tag: "Design Leadership",
    },
    {
      id: "04",
      metric: "Club",
      title: "Secretary, Departmental Club",
      organization: "Computer Science Department",
      description:
        "Served as official club secretary for the Department of Computer Science. Coordinated tech fests, curated technical design workshops, and bridged design-engineering initiatives.",
      tag: "Academic Leadership",
    },
  ],
  services: [
    {
      id: "s1",
      number: "01",
      name: "3D Modeling",
      description:
        "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
    },
    {
      id: "s2",
      number: "02",
      name: "Rendering",
      description:
        "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
    },
    {
      id: "s3",
      number: "03",
      name: "Motion Design",
      description:
        "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
    },
    {
      id: "s4",
      number: "04",
      name: "Branding",
      description:
        "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.",
    },
    {
      id: "s5",
      number: "05",
      name: "Web Design",
      description:
        "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
    },
  ],
  journey: [
    {
      id: "j1",
      period: "2024 — Present",
      role: "UI/UX & Platform Designer",
      company: "Cosmic Tools",
      summary:
        "Spearheaded end-to-end interface architecture for a high-traffic platform offering group-buy access to premier SEO, AI, and design tools such as Semrush, Canva, and ChatGPT.",
      highlights: [
        "Engineered high-converting onboarding and checkout workflows",
        "Designed instant credential delivery and search discovery systems",
        "Built resilient, responsive component library for digital tooling",
      ],
    },
    {
      id: "j2",
      period: "2024",
      role: "Digital Interface Designer",
      company: "Quantabase",
      summary:
        "Collaborated on designing fast, high-quality, and scalable digital interfaces for quantitative financial models and automated strategy execution.",
      highlights: [
        "Crafted high-density data grids and telemetry visualization dashboards",
        "Standardized design tokens for rapid cross-platform developer handoff",
        "Streamlined complex quantitative inputs into accessible user workflows",
      ],
    },
    {
      id: "j3",
      period: "2023 — 2024",
      role: "Brand & Spatial UI Designer",
      company: "ArcVisionX",
      summary:
        "Crafted visionary brand identity systems and futuristic user interfaces for edge computer vision and spatial visual intelligence software.",
      highlights: [
        "Designed dark-mode visual technology branding and spatial typography",
        "Built multi-viewport computer vision inspection interface layouts",
        "Developed interactive prototypes for investor and enterprise demos",
      ],
    },
    {
      id: "j4",
      period: "2023",
      role: "Product Designer",
      company: "Internify",
      summary:
        "Designed user-centered web and mobile experiences connecting ambitious students and tech talent with forward-thinking startup teams.",
      highlights: [
        "Mapped frictionless applicant discovery and recruiter review journeys",
        "Redesigned profile verification and talent matching interfaces",
        "Reduced candidate drop-off with clear, accessible onboarding UX",
      ],
    },
  ],
};
