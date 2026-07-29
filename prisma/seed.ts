import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding admin database...");

  const defaultPassword = "adminpassword123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@zaenalalfian.dev" },
    update: { username: "astrocoding" },
    create: {
      name: "Zaenal Alfian",
      username: "astrocoding",
      email: "admin@zaenalalfian.dev",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created/verified successfully:");
  console.log(`- Email: ${admin.email}`);
  console.log(`- Username: ${admin.username}`);
  console.log(`- Role: ${admin.role}`);

  console.log("\nSeeding contact information...");
  const contact = await prisma.contact.upsert({
    where: { userId: admin.id },
    update: {
      gmail: "zaenalalfian20@gmail.com",
      github: "https://github.com/astrocoding",
      linkedin: "https://www.linkedin.com/in/zaenal-alfian/",
      instagram: "https://www.instagram.com/zenovasi/",
      facebook: "https://www.facebook.com/zaenal.alfian.2025/",
    },
    create: {
      userId: admin.id,
      gmail: "zaenalalfian20@gmail.com",
      github: "https://github.com/astrocoding",
      linkedin: "https://www.linkedin.com/in/zaenal-alfian/",
      instagram: "https://www.instagram.com/zenovasi/",
      facebook: "https://www.facebook.com/zaenal.alfian.2025/",
    },
  });
  console.log("- Created/Updated Contact record for admin user:", contact.gmail);

  console.log("\nSeeding initial experiences...");

  const experiencesData = [
    {
      role: "Lead & Full-Stack Developer",
      company: "Cipta Grafika, Karawang (On-site)",
      period: "Dec 2024 — Present",
      isCurrent: true,
      order: 1,
      description:
        "Architected a three-tier architecture for ERP system using Node.js & Hapi, React, PostgreSQL, and Redis, improving system performance by 150% compared to legacy code. Developed and deployed a web-based employee attendance system using barcode scanning integrated with payroll management in Laravel, reducing HR's time spent on attendance reconciliation by 65%.",
      accomplishments: [
        "Architected 3-tier enterprise ERP system using Node.js/Hapi, React, PostgreSQL & Redis (+150% performance speedup).",
        "Developed barcode-scanned employee attendance system integrated with payroll in Laravel (65% HR reconciliation time saved).",
        "Led end-to-end database modeling, Redis caching strategies, and REST API architectural standards.",
      ],
      skills: ["Node.js", "Hapi.js", "React", "Laravel", "PostgreSQL", "Redis"],
    },
    {
      role: "Backend Developer Intern",
      company: "SchoolTech Indonesia, Malang (Remote)",
      period: "Aug 2024 — Dec 2024",
      isCurrent: false,
      order: 2,
      description:
        "Contributed to backend development of InternPro, a web-based internship platform for vocational high school students, using Laravel. Collaborated closely with Frontend Developers, System Analysts, Project Managers, and QA teams to deliver features aligned with specifications and timelines.",
      accomplishments: [
        "Built core REST API endpoints and data models for InternPro vocational internship platform.",
        "Optimized Eloquent database queries and automated test suite coverage using Pest PHP.",
        "Collaborated in cross-functional Agile sprint cycles delivering features on schedule.",
      ],
      skills: ["Laravel", "PHP", "REST API", "MySQL", "Agile"],
    },
    {
      role: "Full-Stack Developer",
      company: "Kodetopia Indonesia, Karawang (Hybrid)",
      period: "Feb 2023 — Mar 2024",
      isCurrent: false,
      order: 3,
      description:
        "Developed custom web applications based on client requirements using diverse technology stacks including Laravel, React, Express, MySQL, and PostgreSQL. Involved in end-to-end development from requirements analysis to deployment with a strong focus on deadlines, coding standards, sprint planning, and code reviews in Agile teams.",
      accomplishments: [
        "Delivered 10+ custom full-stack web applications for clients across various business domains.",
        "Designed responsive user interfaces in React integrated with high-throughput Express and Laravel backends.",
        "Enforced clean code standards, git workflow conventions, and continuous delivery deployment pipelines.",
      ],
      skills: ["Laravel", "React", "Express.js", "MySQL", "PostgreSQL", "CI/CD"],
    },
  ];

  for (const exp of experiencesData) {
    const existing = await prisma.experience.findFirst({
      where: { role: exp.role, company: exp.company },
    });

    if (!existing) {
      await prisma.experience.create({ data: exp });
      console.log(`- Created experience: ${exp.role} at ${exp.company}`);
    } else {
      await prisma.experience.update({
        where: { id: existing.id },
        data: exp,
      });
      console.log(`- Updated experience: ${exp.role} at ${exp.company}`);
    }
  }

  console.log("\nSeeding initial skillsets...");

  const skillsetsData = [
    // Category 1: Frontend Engineering
    { skillName: "Next.js 16 (App Router)", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "React 19", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "TypeScript", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "TailwindCSS v4", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "Framer Motion", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "State Management (Zustand)", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "HTML5 / Semantic Web", category: "Frontend Engineering", categoryOrder: 1 },
    { skillName: "Web Performance (CWV)", category: "Frontend Engineering", categoryOrder: 1 },

    // Category 2: Backend & Database
    { skillName: "Node.js / Bun", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "PostgreSQL", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "Prisma 7 ORM", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "RESTful & GraphQL APIs", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "Server Actions", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "Redis Caching", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "Database Indexing", category: "Backend & Database", categoryOrder: 2 },
    { skillName: "Auth (NextAuth / Lucia)", category: "Backend & Database", categoryOrder: 2 },

    // Category 3: Architecture & DevOps
    { skillName: "Vercel Deployment", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "Docker & Containers", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "CI/CD Pipelines", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "Microservice Patterns", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "Edge Computing", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "SEO Optimization", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "Serverless Functions", category: "Architecture & DevOps", categoryOrder: 3 },
    { skillName: "Monorepos (Turborepo)", category: "Architecture & DevOps", categoryOrder: 3 },

    // Category 4: Tools & Methodologies
    { skillName: "Git & GitHub Actions", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "Figma to Code", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "Jest & React Testing Library", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "Playwright End-to-End", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "ESLint & Prettier", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "Agile & Pair Programming", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "Technical Documentation", category: "Tools & Methodologies", categoryOrder: 4 },
    { skillName: "Design Systems", category: "Tools & Methodologies", categoryOrder: 4 },
  ];

  for (const item of skillsetsData) {
    const existing = await prisma.skillset.findFirst({
      where: { skillName: item.skillName, category: item.category },
    });

    if (!existing) {
      await prisma.skillset.create({ data: item });
      console.log(`- Created skillset: ${item.skillName} (${item.category})`);
    }
  }

  console.log("\nSeeding initial education records...");

  const educationData = [
    {
      title: "Bachelor of Computer Science (S.Kom.)",
      organization: "STMIK Rosma",
      location: "Indonesia",
      period: "2021 — 2025",
      statusBadge: "卒業 • Graduated",
      grades: "GPA 3.83 / 4.00",
      educationLevel: "Bachelor Degree",
      description:
        "Specialized in Software Engineering, Database Systems Architecture, Distributed Web Applications, and Algorithm Optimization. Graduated with Honors (Cum Laude). Conducted final thesis research on high-performance web systems and microservices optimization.",
      highlights: [
        "Graduated with Academic Distinction (Cum Laude)",
        "Published Capstone Project on High-Performance Web System Architecture",
        "Active Leader in Computer Science & Software Engineering Student Guild",
      ],
      courses: [
        "Software Engineering",
        "Database Systems & Design",
        "Web Technologies & Frameworks",
        "Data Structures & Algorithms",
        "Distributed Systems",
        "Object-Oriented Design (OOD)",
      ],
      order: 1,
    },
    {
      title: "Vocational High School Diploma (RPL)",
      organization: "Vocational High School (SMK)",
      location: "Karawang, Indonesia",
      period: "2017 — 2020",
      statusBadge: "卒業 • Graduated",
      grades: "Rank 3 / 120",
      educationLevel: "Vocational High School",
      description:
        "Intensive 3-year technical vocational curriculum focused on practical software engineering fundamentals. Mastered client-server web programming, relational database management (MySQL), and modern web user interface development.",
      highlights: [
        "Ranked Top 3 Academic Graduate in Software Engineering Department",
        "Built Full-Stack Web Application for Vocational Final Project",
        "Completed Industrial Software Engineering Internship",
      ],
      courses: [
        "Web Programming (HTML/CSS/JS)",
        "PHP & MySQL Database Management",
        "Object-Oriented Programming (OOP)",
        "System Analysis & Design",
        "Software Testing Basics",
      ],
      order: 2,
    },
  ];

  for (const edu of educationData) {
    const existing = await prisma.education.findFirst({
      where: { title: edu.title, organization: edu.organization },
    });

    if (!existing) {
      await prisma.education.create({ data: edu });
      console.log(`- Created education: ${edu.title} at ${edu.organization}`);
    } else {
      await prisma.education.update({
        where: { id: existing.id },
        data: edu,
      });
      console.log(`- Updated education: ${edu.title} at ${edu.organization}`);
    }
  }

}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
