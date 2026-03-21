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
    update: {},
    create: {
      name: "Zaenal Alfian",
      username: "admin",
      email: "admin@zaenalalfian.dev",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created/verified successfully:");
  console.log(`- Email: ${admin.email}`);
  console.log(`- Username: ${admin.username}`);
  console.log(`- Role: ${admin.role}`);

  console.log("\nSeeding initial experiences...");

  const experiencesData = [
    {
      role: "Lead Full-Stack Architect",
      company: "Apex Digital Systems",
      period: "2024 — Present",
      isCurrent: true,
      order: 1,
      description:
        "Spearheaded the design system migration to Next.js 16 App Router and TailwindCSS v4. Reduced page load times by 45% and improved Core Web Vitals to 99/100.",
      skills: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma 7", "TailwindCSS"],
    },
    {
      role: "Senior Frontend Engineer",
      company: "Kurofune Technologies",
      period: "2022 — 2024",
      isCurrent: false,
      order: 2,
      description:
        "Architected real-time analytical dashboards using Server-Sent Events (SSE) and Redis Pub/Sub for high-throughput enterprise telemetry monitoring.",
      skills: ["React 18", "TypeScript", "Next.js", "GraphQL", "TailwindCSS", "Jest"],
    },
    {
      role: "Full-Stack Software Engineer",
      company: "Sakura Cloud Solutions",
      period: "2020 — 2022",
      isCurrent: false,
      order: 3,
      description:
        "Engineered microservices backend APIs in Node.js and PostgreSQL. Designed component-driven UI for cloud deployment management.",
      skills: ["Node.js", "Express", "PostgreSQL", "React", "Docker", "AWS"],
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
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
