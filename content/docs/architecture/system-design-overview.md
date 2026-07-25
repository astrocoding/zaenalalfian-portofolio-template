---
title: "System Architecture & Design Overview"
slug: "system-design-overview"
category: "architecture"
description: "Core architectural principles, component boundaries, and data access strategies."
order: 1
---

# System Architecture & Design Overview

This document describes the foundational architecture of the personal portfolio platform built with Next.js 16, React 19, TypeScript, and Prisma 7.

## Architectural Principles

The platform is designed around three core principles:
1. **Zero Client JS Overhead**: Server Components execute data queries on the server.
2. **Type Safety**: End-to-end type safety from PostgreSQL database schemas to React UI props.
3. **Japanese Minimalist Aesthetic**: Theme tokens defined as CSS variables with no ad-hoc inline styles.

## Layer Decomposition

The system is split into distinct functional layers:

- **Presentation Layer**: React 19 Server Components and Framer Motion micro-interactions.
- **Layout Layer**: Sticky glassmorphic navbar and multi-column semantic footer.
- **Domain Layer**: Prisma ORM with `@prisma/adapter-pg` driver adapters.
- **Content Layer**: File-based MDX content engine with frontmatter parsing.

## Database Access Protocol

All database operations pass through the Prisma Client singleton defined in `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
```

## Security & Performance

- **ISR Caching**: Pages are revalidated every 60 seconds.
- **Strict Content Security**: Sanitized MDX rendering pipelines.
