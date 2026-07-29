"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug.server";

function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) return error.message;
  return defaultMessage;
}

// ==================== PROJECT ACTIONS ====================

export async function createProjectAction(data: {
  title: string;
  slug?: string;
  category: string;
  description: string;
  thumbnail: string;
  images?: string[];
  techstack: string[];
  problem?: string;
  solution?: string;
  architecture?: string;
  challenge?: string;
  result?: string;
  repository?: string;
  sourceLink?: string;
}) {
  try {
    const slug = await generateUniqueSlug("project", data.title, data.slug);
    const newProject = await prisma.project.create({
      data: {
        ...data,
        slug,
        images: data.images || [],
      },
    });
    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");
    return { success: true, project: newProject };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create project") };
  }
}

export async function updateProjectAction(
  id: string,
  data: {
    title?: string;
    slug?: string;
    category?: string;
    description?: string;
    thumbnail?: string;
    images?: string[];
    techstack?: string[];
    problem?: string;
    solution?: string;
    architecture?: string;
    challenge?: string;
    result?: string;
    repository?: string;
    sourceLink?: string;
  }
) {
  try {
    let slug = data.slug;
    if (data.title || data.slug) {
      slug = await generateUniqueSlug("project", data.title || "", data.slug, id);
    }

    const updatePayload = {
      ...data,
      ...(slug ? { slug } : {}),
    };

    const updated = await prisma.project.update({
      where: { id },
      data: updatePayload,
    });
    revalidatePath("/");
    revalidatePath(`/projects/${updated.slug}`);
    return { success: true, project: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update project") };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete project") };
  }
}

// ==================== BLOG ACTIONS ====================

export async function createBlogAction(data: {
  title: string;
  slug?: string;
  category: string;
  description: string;
  content: string;
  thumbnail?: string;
  keywords?: string[];
  publishedAt?: Date;
}) {
  try {
    const slug = await generateUniqueSlug("blog", data.title, data.slug);
    const newBlog = await prisma.blog.create({
      data: {
        ...data,
        slug,
        publishedAt: data.publishedAt || new Date(),
      },
    });
    revalidatePath("/");
    revalidatePath("/blogs/[category]/[slug]", "page");
    return { success: true, blog: newBlog };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create blog") };
  }
}

export async function updateBlogAction(
  id: string,
  data: {
    title?: string;
    slug?: string;
    category?: string;
    description?: string;
    content?: string;
    thumbnail?: string;
    keywords?: string[];
  }
) {
  try {
    let slug = data.slug;
    if (data.title || data.slug) {
      slug = await generateUniqueSlug("blog", data.title || "", data.slug, id);
    }

    const updatePayload = {
      ...data,
      ...(slug ? { slug } : {}),
    };

    const updated = await prisma.blog.update({
      where: { id },
      data: updatePayload,
    });
    revalidatePath("/");
    revalidatePath(`/blogs/${updated.category}/${updated.slug}`);
    return { success: true, blog: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update blog") };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete blog") };
  }
}

// ==================== DOC ACTIONS ====================

export async function createDocAction(data: {
  title: string;
  slug?: string;
  category: string;
  description: string;
  content: string;
  order?: number;
}) {
  try {
    const slug = await generateUniqueSlug("doc", data.title, data.slug);
    const newDoc = await prisma.doc.create({
      data: {
        ...data,
        slug,
        order: data.order ?? 99,
      },
    });
    revalidatePath("/docs/[category]/[slug]", "page");
    return { success: true, doc: newDoc };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create documentation") };
  }
}

export async function updateDocAction(
  id: string,
  data: {
    title?: string;
    slug?: string;
    category?: string;
    description?: string;
    content?: string;
    order?: number;
  }
) {
  try {
    let slug = data.slug;
    if (data.title || data.slug) {
      slug = await generateUniqueSlug("doc", data.title || "", data.slug, id);
    }

    const updatePayload = {
      ...data,
      ...(slug ? { slug } : {}),
    };

    const updated = await prisma.doc.update({
      where: { id },
      data: updatePayload,
    });
    revalidatePath(`/docs/${updated.category}/${updated.slug}`);
    return { success: true, doc: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update documentation") };
  }
}

export async function deleteDocAction(id: string) {
  try {
    await prisma.doc.delete({ where: { id } });
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete documentation") };
  }
}

// ==================== USER ACTIONS ====================

export async function createUserAction(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: "ADMIN" | "USER";
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username.toLowerCase().trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role || "ADMIN",
      },
    });
    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, username: newUser.username } };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create user") };
  }
}

export async function updateUserAction(
  id: string,
  data: {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: "ADMIN" | "USER";
  }
) {
  try {
    const updateData: {
      name?: string;
      username?: string;
      email?: string;
      role?: "ADMIN" | "USER";
      password?: string;
    } = {};
    if (data.name) updateData.name = data.name;
    if (data.username) updateData.username = data.username.toLowerCase().trim();
    if (data.email) updateData.email = data.email.toLowerCase().trim();
    if (data.role) updateData.role = data.role;
    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return { success: true, user: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update user") };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete user") };
  }
}

// ==================== EXPERIENCE ACTIONS ====================

export async function createExperienceAction(data: {
  role: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  skills?: string[];
  order?: number;
}) {
  try {
    const newExperience = await prisma.experience.create({
      data: {
        ...data,
        isCurrent: Boolean(data.isCurrent),
        skills: data.skills || [],
        order: data.order ?? 1,
      },
    });
    revalidatePath("/");
    return { success: true, experience: newExperience };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create experience record") };
  }
}

export async function updateExperienceAction(
  id: string,
  data: {
    role?: string;
    company?: string;
    period?: string;
    isCurrent?: boolean;
    description?: string;
    skills?: string[];
    order?: number;
  }
) {
  try {
    const updated = await prisma.experience.update({
      where: { id },
      data: {
        ...data,
        isCurrent: data.isCurrent !== undefined ? Boolean(data.isCurrent) : undefined,
      },
    });
    revalidatePath("/");
    return { success: true, experience: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update experience record") };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete experience record") };
  }
}

// ==================== SKILLSET ACTIONS ====================

export async function createSkillsetAction(data: {
  skillName: string;
  category: string;
  categoryOrder?: number;
  link?: string;
  description?: string;
}) {
  try {
    const newSkill = await prisma.skillset.create({
      data: {
        skillName: data.skillName.trim(),
        category: data.category.trim(),
        categoryOrder: data.categoryOrder ?? 1,
        link: data.link ? data.link.trim() : null,
        description: data.description ? data.description.trim() : null,
      },
    });
    revalidatePath("/");
    return { success: true, skillset: newSkill };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create skillset item") };
  }
}

export async function updateSkillsetAction(
  id: string,
  data: {
    skillName?: string;
    category?: string;
    categoryOrder?: number;
    link?: string;
    description?: string;
  }
) {
  try {
    const updatePayload: {
      skillName?: string;
      category?: string;
      categoryOrder?: number;
      link?: string | null;
      description?: string | null;
    } = {};
    if (data.skillName !== undefined) updatePayload.skillName = data.skillName.trim();
    if (data.category !== undefined) updatePayload.category = data.category.trim();
    if (data.categoryOrder !== undefined) updatePayload.categoryOrder = data.categoryOrder;
    if (data.link !== undefined) updatePayload.link = data.link ? data.link.trim() : null;
    if (data.description !== undefined) updatePayload.description = data.description ? data.description.trim() : null;

    const updated = await prisma.skillset.update({
      where: { id },
      data: updatePayload,
    });
    revalidatePath("/");
    return { success: true, skillset: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update skillset item") };
  }
}

export async function deleteSkillsetAction(id: string) {
  try {
    await prisma.skillset.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete skillset item") };
  }
}

// ==================== PROFILE & ABOUT ACTIONS ====================

const DEFAULT_ABOUT_CARDS = [
  {
    title: "Ma (間) — Intentional Space",
    subtitle: "Codebases and user interfaces thrive when clutter is removed. By honoring negative space and clean domain boundaries, software becomes easier to reason about, maintain, and scale.",
    badge: "01",
    order: 1,
  },
  {
    title: "Wabi-Sabi (侘寂) — Elegant Simplicity",
    subtitle: "Perfection in software isn't achieved when there's nothing more to add, but when there's nothing left to take away. Simple, type-safe architecture beats complex abstractions every time.",
    badge: "02",
    order: 2,
  },
  {
    title: "Shokunin (職人) — Technical Craftsmanship",
    subtitle: "Approaching software development as a lifelong craft. Every database index, API payload, and UI component is executed with meticulous care for performance and accessibility.",
    badge: "03",
    order: 3,
  },
  {
    title: "Clean Architecture",
    subtitle: "Strict separation of concerns, domain-driven boundaries, and maintainable codebases built to scale smoothly.",
    badge: "建築",
    order: 4,
  },
  {
    title: "High Performance",
    subtitle: "Sub-second page loads, Server Component optimization, minimal bundle sizes, and pristine Core Web Vitals.",
    badge: "高速",
    order: 5,
  },
  {
    title: "Editorial UI/UX",
    subtitle: "Thoughtful Japanese minimalist aesthetics, soft paper palettes, typography hierarchy, and smooth micro-interactions.",
    badge: "美学",
    order: 6,
  },
  {
    title: "Technical Credibility",
    subtitle: "Type-safe contracts, automated testing, reliable database migrations, and production-ready deployments.",
    badge: "信頼",
    order: 7,
  },
];

export async function getProfileAndAboutAction(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        about: {
          include: {
            cards: {
              orderBy: { order: "asc" },
            },
          },
        },
        contact: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Auto seed default About section if missing
    let about = user.about;
    if (!about) {
      about = await prisma.about.create({
        data: {
          userId: user.id,
          title: "Behind the Architecture",
          subtitle: "Bridging Design Vision & Technical Execution",
          excerpt: "I am Zaenal Alfian, a Senior Full-Stack Engineer and Frontend Architect with over 6 years of experience building mission-critical web applications, enterprise design systems, and high-performance serverless backends.",
          description: "My journey in software development is rooted in a passion for craftsmanship. Over the past 6+ years, I have architected web platforms that serve millions of requests, led engineering teams in adopting modern frameworks like Next.js 16 and React 19, and built domain-driven design systems from scratch.\n\nMy philosophy is heavily influenced by traditional Japanese minimalism (*Wabi-Sabi* & *Ma*) — eliminating unnecessary clutter to let core function and performance shine. Every line of code, database query, and UI component is crafted with intentionality.\n\nWhether designing micro-frontends, optimizing PostgreSQL query access with Prisma 7, or fine-tuning Core Web Vitals to 99/100 scores, I focus on delivering long-term architectural longevity and delightful user experiences.",
          cards: {
            create: DEFAULT_ABOUT_CARDS,
          },
        },
        include: {
          cards: {
            orderBy: { order: "asc" },
          },
        },
      });
    }

    // Auto seed default Contact section if missing
    let contact = user.contact;
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId: user.id,
          gmail: "zaenalalfian20@gmail.com",
          github: "https://github.com/astrocoding",
          linkedin: "https://www.linkedin.com/in/zaenal-alfian/",
          instagram: "https://www.instagram.com/zenovasi/",
          facebook: "https://www.facebook.com/zaenal.alfian.2025/",
        },
      });
    }

    return { success: true, user, about, contact };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to load profile, about, and contact details") };
  }
}

export async function updateProfileAndAboutAction(
  userId: string,
  userData: {
    name: string;
    username: string;
    email: string;
    password?: string;
    position?: string;
    activity?: string;
    experience?: string;
    location?: string;
    availability?: string;
    quotes?: string;
    bio?: string;
    resume?: string;
  },
  aboutData: {
    title: string;
    subtitle: string;
    excerpt: string;
    description: string;
  },
  contactData?: {
    gmail?: string;
    whatsapp?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  }
) {
  try {
    const userUpdatePayload: {
      name: string;
      username: string;
      email: string;
      password?: string;
      position?: string | null;
      activity?: string | null;
      experience?: string | null;
      location?: string | null;
      availability?: string | null;
      quotes?: string | null;
      bio?: string | null;
      resume?: string | null;
    } = {
      name: userData.name.trim(),
      username: userData.username.toLowerCase().trim(),
      email: userData.email.toLowerCase().trim(),
      position: userData.position?.trim() || null,
      activity: userData.activity?.trim() || null,
      experience: userData.experience?.trim() || null,
      location: userData.location?.trim() || null,
      availability: userData.availability?.trim() || null,
      quotes: userData.quotes?.trim() || null,
      bio: userData.bio?.trim() || null,
      resume: userData.resume?.trim() || null,
    };

    if (userData.password && userData.password.trim() !== "") {
      userUpdatePayload.password = await bcrypt.hash(userData.password.trim(), 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdatePayload,
    });

    // Upsert about details
    const updatedAbout = await prisma.about.upsert({
      where: { userId },
      update: {
        title: aboutData.title.trim(),
        subtitle: aboutData.subtitle.trim(),
        excerpt: aboutData.excerpt.trim(),
        description: aboutData.description.trim(),
      },
      create: {
        userId,
        title: aboutData.title.trim(),
        subtitle: aboutData.subtitle.trim(),
        excerpt: aboutData.excerpt.trim(),
        description: aboutData.description.trim(),
        cards: {
          create: DEFAULT_ABOUT_CARDS,
        },
      },
      include: {
        cards: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Upsert contact details
    let updatedContact = null;
    if (contactData) {
      updatedContact = await prisma.contact.upsert({
        where: { userId },
        update: {
          gmail: contactData.gmail?.trim() || null,
          whatsapp: contactData.whatsapp?.trim() || null,
          github: contactData.github?.trim() || null,
          linkedin: contactData.linkedin?.trim() || null,
          instagram: contactData.instagram?.trim() || null,
          facebook: contactData.facebook?.trim() || null,
        },
        create: {
          userId,
          gmail: contactData.gmail?.trim() || null,
          whatsapp: contactData.whatsapp?.trim() || null,
          github: contactData.github?.trim() || null,
          linkedin: contactData.linkedin?.trim() || null,
          instagram: contactData.instagram?.trim() || null,
          facebook: contactData.facebook?.trim() || null,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/profile");

    return { success: true, user: updatedUser, about: updatedAbout, contact: updatedContact };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update profile, about, & contact data") };
  }
}

export async function createAboutCardAction(
  aboutId: string,
  cardData: {
    title: string;
    subtitle: string;
    badge?: string;
    order?: number;
  }
) {
  try {
    let order = cardData.order;
    if (order === undefined) {
      const highestOrderCard = await prisma.aboutCard.findFirst({
        where: { aboutId },
        orderBy: { order: "desc" },
      });
      order = (highestOrderCard?.order || 0) + 1;
    }

    const newCard = await prisma.aboutCard.create({
      data: {
        aboutId,
        title: cardData.title.trim(),
        subtitle: cardData.subtitle.trim(),
        badge: cardData.badge ? cardData.badge.trim() : null,
        order,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/profile");

    return { success: true, card: newCard };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create about card") };
  }
}

export async function updateAboutCardAction(
  cardId: string,
  cardData: {
    title?: string;
    subtitle?: string;
    badge?: string;
    order?: number;
  }
) {
  try {
    const updatePayload: {
      title?: string;
      subtitle?: string;
      badge?: string | null;
      order?: number;
    } = {};

    if (cardData.title !== undefined) updatePayload.title = cardData.title.trim();
    if (cardData.subtitle !== undefined) updatePayload.subtitle = cardData.subtitle.trim();
    if (cardData.badge !== undefined) updatePayload.badge = cardData.badge ? cardData.badge.trim() : null;
    if (cardData.order !== undefined) updatePayload.order = cardData.order;

    const updatedCard = await prisma.aboutCard.update({
      where: { id: cardId },
      data: updatePayload,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/profile");

    return { success: true, card: updatedCard };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update about card") };
  }
}

export async function deleteAboutCardAction(cardId: string) {
  try {
    await prisma.aboutCard.delete({ where: { id: cardId } });
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete about card") };
  }
}

export async function reorderAboutCardsAction(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.aboutCard.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/profile");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to reorder about cards") };
  }
}

// ==================== EDUCATION ACTIONS ====================

export async function createEducationAction(data: {
  title: string;
  organization: string;
  location: string;
  period: string;
  statusBadge?: string;
  grades?: string;
  educationLevel?: string;
  description: string;
  highlights?: string[];
  courses?: string[];
  order?: number;
}) {
  try {
    let order = data.order;
    if (order === undefined) {
      const highestOrder = await prisma.education.findFirst({
        orderBy: { order: "desc" },
      });
      order = (highestOrder?.order || 0) + 1;
    }

    const newEducation = await prisma.education.create({
      data: {
        title: data.title.trim(),
        organization: data.organization.trim(),
        location: data.location.trim(),
        period: data.period.trim(),
        statusBadge: data.statusBadge ? data.statusBadge.trim() : null,
        grades: data.grades ? data.grades.trim() : null,
        educationLevel: data.educationLevel ? data.educationLevel.trim() : null,
        description: data.description.trim(),
        highlights: data.highlights || [],
        courses: data.courses || [],
        order,
      },
    });

    revalidatePath("/education");
    revalidatePath("/admin/education");

    return { success: true, education: newEducation };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create education entry") };
  }
}

export async function updateEducationAction(
  id: string,
  data: {
    title?: string;
    organization?: string;
    location?: string;
    period?: string;
    statusBadge?: string;
    grades?: string;
    educationLevel?: string;
    description?: string;
    highlights?: string[];
    courses?: string[];
    order?: number;
  }
) {
  try {
    const updatePayload: {
      title?: string;
      organization?: string;
      location?: string;
      period?: string;
      statusBadge?: string | null;
      grades?: string | null;
      educationLevel?: string | null;
      description?: string;
      highlights?: string[];
      courses?: string[];
      order?: number;
    } = {};

    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.organization !== undefined) updatePayload.organization = data.organization.trim();
    if (data.location !== undefined) updatePayload.location = data.location.trim();
    if (data.period !== undefined) updatePayload.period = data.period.trim();
    if (data.statusBadge !== undefined) updatePayload.statusBadge = data.statusBadge ? data.statusBadge.trim() : null;
    if (data.grades !== undefined) updatePayload.grades = data.grades ? data.grades.trim() : null;
    if (data.educationLevel !== undefined) updatePayload.educationLevel = data.educationLevel ? data.educationLevel.trim() : null;
    if (data.description !== undefined) updatePayload.description = data.description.trim();
    if (data.highlights !== undefined) updatePayload.highlights = data.highlights;
    if (data.courses !== undefined) updatePayload.courses = data.courses;
    if (data.order !== undefined) updatePayload.order = data.order;

    const updated = await prisma.education.update({
      where: { id },
      data: updatePayload,
    });

    revalidatePath("/education");
    revalidatePath("/admin/education");

    return { success: true, education: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update education entry") };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    await prisma.education.delete({ where: { id } });
    revalidatePath("/education");
    revalidatePath("/admin/education");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete education entry") };
  }
}

export async function reorderEducationsAction(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.education.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/education");
    revalidatePath("/admin/education");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to reorder education entries") };
  }
}


