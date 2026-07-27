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
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
