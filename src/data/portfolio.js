import eggbotImage from "../assets/proj_images/Eggbot_UI.png"
import teleAiImage from "../assets/proj_images/teleai_proj.png"
import foroomImage from "../assets/proj_images/foroom_proj.png"
import buddy4goodImage from "../assets/proj_images/buddy4good.png"
import foodHeroImage from "../assets/proj_images/foodhero.png"
import hdbLogo from "../assets/hdb.png"
import careForWeLogo from "../assets/cfw.png"
import nusLogo from "../assets/NUS.png"
import eastspringLogo from "../assets/eastspring.png"
import aStarLogo from "../assets/astar.png"
import resumeFile from "../assets/Resume_TranHaThu.pdf"

export const profile = {
  name: "Tran Ha Thu",
  role: "Backend / Software Engineer",
  email: "tranhathu@u.nus.edu",
  github: "https://github.com/oeggy03",
  linkedin: "https://www.linkedin.com/in/tran-ha-thu/",
  resume: resumeFile,
  education: {
    institution: "National University of Singapore",
    abbreviation: "NUS",
    programme: "Computer Science",
    minors: ["Quantitative Finance", "Management"],
    url: "https://nus.edu.sg/",
  },
  interests: ["Software engineering", "Quantitative finance and trading", "Artificial intelligence"],
  aspiration: "I want to build useful software and help others learn to program.",
}

export const projects = [
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

export const experiences = [
  {
    id: "hdb",
    role: "Data Analysis / Machine Learning Intern",
    company: "Housing Development Board (HDB)",
    dates: "May 2024 - Present",
    summary: "Applied machine learning and data analysis to support HDB business processes.",
    logo: hdbLogo,
    logoAlt: "Housing & Development Board (HDB)",
    url: "https://www.hdb.gov.sg/cs/infoweb/homepage",
    skills: ["Python", "Machine learning", "Data analysis", "Software engineering"],
  },
  {
    id: "careforwe",
    role: "Tech Lead",
    company: "CareForWe (Healthtech startup)",
    dates: "Dec 2023 - Present",
    summary: "Led development of a video-hosting platform and company website.",
    logo: careForWeLogo,
    logoAlt: "CareForWe",
    url: "https://www.care4we.com/",
    skills: ["JavaScript", "React", "HTML", "CSS"],
  },
  {
    id: "nus-ta",
    role: "Teaching Assistant",
    company: "National University of Singapore",
    dates: "Aug 2023 - Present",
    summary: "Graded programming assignments and taught programming methodology at NUS.",
    logo: nusLogo,
    logoAlt: "National University of Singapore",
    url: "https://nus.edu.sg/",
    skills: ["JavaScript"],
  },
  {
    id: "eastspring",
    role: "Data Engineering Intern",
    company: "Eastspring Investments Singapore",
    dates: "May 2023 - Aug 2023",
    summary: "Used Python and Pandas to handle large datasets and wrote object-oriented code to support daily operations.",
    logo: eastspringLogo,
    logoAlt: "Eastspring Investments",
    url: "https://www.eastspring.com/sg",
    skills: ["Git", "Python", "Pandas", "Object-oriented programming", "Microsoft SQL Server"],
  },
  {
    id: "astar",
    role: "Intern",
    company: "A*STAR - Agency for Science, Technology and Research",
    dates: "Dec 2019 - Jan 2020",
    summary: "Trained a robotic arm for image recognition using Python and OpenCV.",
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
