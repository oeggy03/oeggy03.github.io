import eggbotImage from "../assets/proj_images/Eggbot_UI.png"
import teleAiImage from "../assets/proj_images/teleai_proj.png"
import foroomImage from "../assets/proj_images/foroom_proj.png"
import buddy4goodImage from "../assets/proj_images/buddy4good.png"
import foodHeroImage from "../assets/proj_images/foodhero.png"
import hdbLogo from "../assets/hdb.png"
import nusLogo from "../assets/NUS.png"
import eastspringLogo from "../assets/eastspring.png"
import aStarLogo from "../assets/astar.png"
import tikTokLogo from "../assets/company-logos/tiktok.png"
import gicLogo from "../assets/company-logos/gic.png"
import uptaleLogo from "../assets/company-logos/uptale.png"
import resumeFile from "../assets/Resume_TranHaThu.pdf"
import { featuredProjects } from "./featured-projects.js"

export const profile = {
  name: "Tran Ha Thu",
  role: "Software Engineer",
  identity: {
    fullName: "Tran Ha Thu",
    citizenship: "Singaporean Citizen",
    citizenshipShort: "Singaporean",
    visaEligibility: "Eligible for H1B1 Visa",
    currentRole: "Backend Engineer at TikTok",
  },
  introEyebrow: "As a Backend engineer at TikTok...",
  introHeadline: "I build useful and scalable software.",
  introduction: "Hey, I’m Ha Thu, a backend engineer and computer science graduate of the National University of Singapore. I’m committed to building practical, useful software with the future in mind, and I enjoy experimenting with new technologies along the way.",
  email: "tranhathuwork@gmail.com",
  github: "https://github.com/oeggy03",
  linkedin: "https://www.linkedin.com/in/tran-ha-thu/",
  resume: resumeFile,
  education: {
    institution: "National University of Singapore",
    abbreviation: "NUS",
    programme: "Bachelor of Computing – Computer Science",
    period: "Aug 2022 – May 2026",
    gpa: "4.6/5.0",
    honors: "First Class Honours, Distinction in Software Engineering, Dean's List",
    awards: [
      "Best Work Award - Tembusu College",
      "NUS Computing Student Life Award - Bronze",
      "SMU Hack For Cities hackathon runner-up",
    ],
    activities: [
      "Invited to CVWO; teaching assistant for five programming modules",
      "Organized 20+ university events as a residential assistant and CCA committee leader",
    ],
    url: "https://nus.edu.sg/",
  },
  interests: ["Software engineering", "Scalable systems and architecture", "Tinkering with the latest technologies"],
  experienceSkills: ["Software Development", "Agentic Development", "Scalable Systems", "Version Control"],
  previouslyWorkedWith: ["Go", "Python", "C#", "Java", "TypeScript"],
}

const existingProjects = [
  {
    id: "foroom",
    title: "FoROOM",
    category: "Backend",
    image: foroomImage,
    imageAlt: "FoROOM discussion forum interface",
    imageWidth: 1920,
    imageHeight: 1080,
    summary: "A discussion forum for people with different interests and backgrounds.",
    implementation: [
      { label: "Frontend", value: "React" },
      { label: "Backend", value: "Go" },
      { label: "Database", value: "MySQL" },
      { label: "Authentication", value: "JWT + bcrypt" },
    ],
    architecture: ["React interface", "Go API", "MySQL"],
    links: [
      { label: "Project details", href: "https://devpost.com/software/foroom" },
      { label: "Frontend code", href: "https://github.com/oeggy03/cvwo-frontend" },
      { label: "Backend code", href: "https://github.com/oeggy03/cvwo-backend" },
    ],
    skills: ["React", "Go", "MySQL", "JWT", "bcrypt", "HTML", "CSS", "JavaScript"],
  },
  {
    id: "buddy4good",
    title: "Buddy4Good",
    category: "Backend",
    image: buddy4goodImage,
    imageAlt: "Buddy4Good activity platform interface",
    imageWidth: 1920,
    imageHeight: 1080,
    summary: "Connects disabled and non-disabled people for shared activities.",
    description: "Built during Hack For Good 2023 for SGEnable.",
    implementation: [
      { label: "Frontend", value: "React" },
      { label: "Backend", value: "Go" },
      { label: "Database", value: "MySQL" },
      { label: "Authentication", value: "JWT + bcrypt" },
    ],
    links: [
      { label: "Live site", href: "https://oeggy03.github.io/h4g-frontend/" },
      { label: "Project details", href: "https://devpost.com/software/buddy4good" },
      { label: "Frontend code", href: "https://github.com/oeggy03/h4g-frontend" },
      { label: "Backend code", href: "https://github.com/oeggy03/h4g-backend" },
    ],
    skills: ["React", "Go", "MySQL", "JWT", "bcrypt", "HTML", "CSS", "JavaScript", "Git"],
  },
  {
    id: "eggbot",
    title: "Eggbot",
    category: "AI & bots",
    image: eggbotImage,
    imageAlt: "Eggbot task-tracking chatbot interface",
    imageWidth: 762,
    imageHeight: 912,
    summary: "A Java chatbot with a JavaFX interface for managing personal tasks.",
    implementation: [
      { label: "Language", value: "Java" },
      { label: "GUI", value: "JavaFX" },
      { label: "Design", value: "Object-oriented programming" },
    ],
    links: [
      { label: "Download", href: "https://github.com/oeggy03/ip/releases/tag/A-Release" },
      { label: "Project details", href: "https://oeggy03.github.io/ip/" },
      { label: "Source code", href: "https://github.com/oeggy03/ip" },
    ],
    skills: ["Java", "JavaFX", "Object-oriented programming", "Git"],
  },
  {
    id: "teleai",
    title: "TeleAI",
    category: "AI & bots",
    image: teleAiImage,
    imageAlt: "TeleAI image-recognition Telegram bot",
    imageWidth: 538,
    imageHeight: 687,
    summary: "A Telegram bot that classifies photos of cats, dogs, planes and other CIFAR-10 objects.",
    implementation: [
      { label: "Platform", value: "Telegram bot" },
      { label: "Language", value: "Python" },
      { label: "Image recognition", value: "OpenCV" },
      { label: "Model training", value: "TensorFlow + Keras · CIFAR-10" },
    ],
    links: [
      { label: "Project details", href: "https://oeggy03.github.io/TeleAI/" },
      { label: "Source code", href: "https://github.com/oeggy03/TeleAI" },
    ],
    skills: ["Python", "OpenCV", "TensorFlow", "Keras"],
  },
  {
    id: "foodhero",
    title: "FoodHero",
    category: "AI & bots",
    image: foodHeroImage,
    imageAlt: "FoodHero food-sharing application interface",
    imageWidth: 959,
    imageHeight: 1041,
    summary: "A Telegram bot where people list leftover food for others to find.",
    description: "Built in 24 hours for the LifeHack 2022 hackathon.",
    implementation: [
      { label: "Platform", value: "Telegram bot" },
      { label: "Language", value: "Python" },
      { label: "Database", value: "SQLite" },
    ],
    links: [
      { label: "Live site", href: "https://oeggy03.github.io/FoodHeroBot/" },
      { label: "Project details", href: "https://devpost.com/software/kalilinux" },
      { label: "Source code", href: "https://github.com/oeggy03/FoodHeroBot" },
    ],
    skills: ["Python", "SQLite"],
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    category: "Frontend",
    image: "/social-preview.png",
    imageAlt: "Tran Ha Thu's portfolio homepage",
    imageWidth: 1200,
    imageHeight: 630,
    summary: "A portfolio website for presenting my projects and experience.",
    implementation: [
      { label: "Framework", value: "React" },
      { label: "Build", value: "Vite" },
      { label: "Styling", value: "Tailwind CSS" },
      { label: "Navigation", value: "Direct section tabs" },
      { label: "Delivery", value: "Static prerendering · GitHub Pages" },
    ],
    links: [
      { label: "Source code", href: "https://github.com/oeggy03/oeggy03.github.io" },
    ],
    skills: ["React", "JavaScript", "HTML", "CSS", "Git", "Object-oriented programming"],
  },
]

export const projects = [...existingProjects, ...featuredProjects]

export const currentExperienceId = "tiktok-backend"

export const experiences = [
  {
    id: currentExperienceId,
    startedAt: "2026-07",
    dates: "Jul 2026 – Present",
    company: "TikTok",
    role: "Backend Engineer",
    logo: tikTokLogo,
    logoAlt: "TikTok",
    url: "https://www.tiktok.com/",
    highlights: [
      "Developed internal products with TypeScript and Go to improve reliability and observability of internal services.",
    ],
    skills: ["TypeScript", "Go"],
  },
  {
    id: "tiktok-intern",
    startedAt: "2026-01",
    endedAt: "2026-03",
    company: "TikTok",
    role: "Software Engineering Intern",
    logo: tikTokLogo,
    logoAlt: "TikTok",
    url: "https://www.tiktok.com/",
    dates: "Jan 2026 – Mar 2026",
    highlights: [
      "Developed internal products with TypeScript and Go to improve reliability and observability of internal services.",
    ],
    skills: ["TypeScript", "Go"],
  },
  {
    id: "nus-ta",
    startedAt: "2023-08",
    endedAt: "2025-12",
    role: "Teaching Assistant",
    company: "National University of Singapore",
    dates: "Aug 2023 – Dec 2025",
    highlights: [
      "Taught programming concepts to over 1,000 students through self-prepared JavaScript, Java and Python tutorials.",
      "Received feedback scores of 4.8/5 for CS1101S and 4.7/5 for CS2103T, against a department average of 4.3.",
    ],
    logo: nusLogo,
    logoAlt: "National University of Singapore",
    url: "https://nus.edu.sg/",
    skills: ["JavaScript", "Java", "Python"],
  },
  {
    id: "gic",
    startedAt: "2025-06",
    endedAt: "2025-09",
    role: "Software Engineering Intern",
    company: "GIC",
    dates: "Jun 2025 – Sep 2025",
    logo: gicLogo,
    logoAlt: "GIC",
    url: "https://www.gic.com.sg/",
    highlights: [
      "Engineered products for public market investments with TypeScript, C#, Python and Microsoft SQL Server, optimizing workflows for over 300 staff.",
    ],
    skills: ["TypeScript", "C#", "Python", "Microsoft SQL Server"],
  },
  {
    id: "uptale",
    startedAt: "2025-01",
    endedAt: "2025-06",
    role: "Software Engineering & AI Intern",
    company: "Uptale",
    dates: "Jan 2025 – Jun 2025",
    logo: uptaleLogo,
    logoAlt: "Uptale",
    url: "https://www.uptale.io/en/",
    highlights: [
      "Implemented a full retrieval-augmented generation (RAG) pipeline in TypeScript and C# for gamified educational experiences used by over 100 customers.",
    ],
    skills: ["TypeScript", "C#", "RAG"],
  },
  {
    id: "hdb",
    startedAt: "2024-05",
    endedAt: "2024-08",
    role: "Data Science Intern",
    company: "Housing Development Board (HDB)",
    dates: "May 2024 – Aug 2024",
    highlights: [
      "Built a Python commercial rent prediction model using Random Forest, XGBoost and k-nearest neighbors, achieving an average of 88% accuracy.",
      "Automated financial reporting with Excel and VBA, improving efficiency by 80%.",
    ],
    logo: hdbLogo,
    logoAlt: "Housing & Development Board (HDB)",
    url: "https://www.hdb.gov.sg/cs/infoweb/homepage",
    skills: ["Python", "Random Forest", "XGBoost", "K-Nearest Neighbors", "Excel", "VBA"],
  },
  {
    id: "eastspring",
    startedAt: "2023-05",
    endedAt: "2023-08",
    role: "Data Engineering Intern",
    company: "Eastspring Investments Singapore",
    dates: "May 2023 – Aug 2023",
    highlights: [
      "Maintained over 100 production and raw database tables with Python and SQL, and improved an AI chatbot with the OpenAI API.",
    ],
    logo: eastspringLogo,
    logoAlt: "Eastspring Investments",
    url: "https://www.eastspring.com/sg",
    skills: ["Python", "SQL", "OpenAI API"],
  },
  {
    id: "astar",
    startedAt: "2019-12",
    endedAt: "2020-01",
    role: "Artificial Intelligence Intern",
    company: "A*STAR - Agency for Science, Technology and Research",
    dates: "Dec 2019 – Jan 2020",
    highlights: [
      "Trained a robotic arm to sort 10 types of trash using Python and OpenCV.",
    ],
    logo: aStarLogo,
    logoAlt: "Agency for Science, Technology and Research (A*STAR)",
    url: "https://www.a-star.edu.sg/",
    skills: ["Python", "OpenCV"],
  },
]

export const skills = [
  { id: "go", name: "Go", group: "Backend & languages", projectIds: ["foroom", "buddy4good"] },
  { id: "java", name: "Java", group: "Backend & languages", projectIds: ["eggbot"] },
  { id: "python", name: "Python", group: "Backend & languages", projectIds: ["teleai", "foodhero"] },
  { id: "javascript", name: "JavaScript", group: "Backend & languages", projectIds: ["portfolio", "foroom", "buddy4good"] },
  { id: "express", name: "Express.js", group: "Backend & languages", projectIds: [] },
  { id: "cpp", name: "C++", group: "Backend & languages", projectIds: [] },
  { id: "oop", name: "Object-oriented programming", group: "Backend & languages", projectIds: ["eggbot", "portfolio"] },
  { id: "jwt", name: "JWT", group: "Backend & languages", projectIds: ["foroom", "buddy4good"] },
  { id: "bcrypt", name: "bcrypt", group: "Backend & languages", projectIds: ["foroom", "buddy4good"] },
  { id: "mysql", name: "MySQL", group: "Data & AI", projectIds: ["foroom", "buddy4good"] },
  { id: "postgresql", name: "PostgreSQL", group: "Data & AI", projectIds: [] },
  { id: "microsoft-sql-server", name: "Microsoft SQL Server", group: "Data & AI", projectIds: [] },
  { id: "sqlite", name: "SQLite", group: "Data & AI", projectIds: ["foodhero"] },
  { id: "pandas", name: "Pandas", group: "Data & AI", projectIds: [] },
  { id: "opencv", name: "OpenCV", group: "Data & AI", projectIds: ["teleai"] },
  { id: "tensorflow", name: "TensorFlow", group: "Data & AI", projectIds: ["teleai"] },
  { id: "keras", name: "Keras", group: "Data & AI", projectIds: ["teleai"] },
  { id: "react", name: "React", group: "Web & tooling", projectIds: ["portfolio", "foroom", "buddy4good"] },
  { id: "html", name: "HTML", group: "Web & tooling", projectIds: ["portfolio", "foroom", "buddy4good"] },
  { id: "css", name: "CSS", group: "Web & tooling", projectIds: ["portfolio", "foroom", "buddy4good"] },
  { id: "git", name: "Git", group: "Web & tooling", projectIds: ["portfolio", "eggbot", "buddy4good"] },
  { id: "javafx", name: "JavaFX", group: "Web & tooling", projectIds: ["eggbot"] },
]

export const skillGroups = ["Backend & languages", "Data & AI", "Web & tooling"]
