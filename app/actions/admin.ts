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
