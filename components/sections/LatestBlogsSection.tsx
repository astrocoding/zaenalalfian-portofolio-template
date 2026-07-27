"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  kanji?: string;
  description: string;
  publishedAt: string;
  readingTime?: string;
  thumbnail?: string | null;
  bgGradient?: string;
  illustration?: "castle" | "fox" | "fuji" | "pagoda";
}

const fallbackBlogs: BlogItem[] = [
  {
    id: "blog-3",
    title: "Optimizing React 19 Server Components for Web Vitals",
    slug: "optimizing-react-19-server-components",
    category: "Performance",
    kanji: "性能 • FUJI",
    description:
      "Practical strategies to eliminate hydration shifts, optimize streaming boundaries, and achieve sub-200ms INP metrics.",
    publishedAt: "2026-04-10",
    readingTime: "5 min read",
    bgGradient: "from-[#b04749] via-[#9e3a3c] to-[#7a282a]",
    illustration: "fuji",
  },
  {
    id: "blog-2",
    title: "The Art of Japanese Minimalist UI: Clarity & Ma",
    slug: "japanese-minimalist-ui-design-clarity",
    category: "Design System",
    kanji: "設計 • KYOTO",
    description:
      "How traditional Japanese spatial aesthetics (Ma) and muted rice paper color palettes improve user focus and reduce cognitive load.",
    publishedAt: "2026-05-28",
    readingTime: "8 min read",
    bgGradient: "from-[#a33b3d] via-[#8c2d2f] to-[#6b1e20]",
    illustration: "fox",
  },
  {
    id: "blog-1",
    title: "Mastering Next.js 16 App Router & Prisma 7",
    slug: "nextjs-16-prisma-7-driver-adapters",
    category: "Architecture",
    kanji: "建築 • OSAKA",
    description:
      "A deep dive into setting up Prisma 7 SQL driver adapters with PostgreSQL, server components, and clean data access patterns.",
    publishedAt: "2026-06-15",
    readingTime: "6 min read",
    bgGradient: "from-[#913133] via-[#7a2527] to-[#591618]",
    illustration: "castle",
  },
  {
    id: "blog-4",
    title: "Editorial Craftsmanship: Engineering High-Fidelity UI",
    slug: "editorial-craftsmanship-high-fidelity-ui",
    category: "Craftsmanship",
    kanji: "技術 • TOKYO",
    description:
      "Combining micro-interactions, responsive CSS layout structures, and Japanese typographic rhythm for premium portfolio web apps.",
    publishedAt: "2026-03-22",
    readingTime: "7 min read",
    bgGradient: "from-[#852a2c] via-[#6d1f21] to-[#4e1113]",
    illustration: "pagoda",
  },
];

const VerticalBannerIllustration: React.FC<{ type: BlogItem["illustration"] }> = ({ type }) => {
  const cls = "w-full h-40 sm:h-44 transition-all duration-500";

  /* --- OSAKA card: japanese_pagoda.svg (5-tier pagoda architecture) --- */
  if (type === "castle") {
    return (
      <svg className={cls} viewBox="0 0 254.392 254.392" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tier 1 — top (spire + widest roof): brightest */}
        <path
          d="M61.004,91.736c6.158,0.519,9.243,0.746,15.406,1.146c1.42,0.09,2.506,1.349,2.434,2.81
          c-0.263,5.09-0.394,7.638-0.656,12.733c-0.078,1.462,1.038,2.721,2.482,2.804c5.299,0.31,7.954,0.442,13.252,0.656
          c26.6,1.104,39.924,1.104,66.531,0c5.048-0.209,7.566-0.334,12.602-0.621c1.438-0.084,2.56-1.337,2.482-2.798
          c-0.257-5.09-0.388-7.638-0.65-12.733c-0.066-1.462,1.032-2.715,2.44-2.81c6.42-0.412,9.631-0.644,16.045-1.187
          c1.42-0.119,1.593-0.835,0.376-1.593c-25.538-16.063-38.63-25.216-60.528-42.281l-5.74-46.864c-0.161-1.331-0.43-1.331-0.591,0
          l-5.74,46.864C99.245,64.927,86.172,74.08,60.622,90.143C59.422,90.901,59.59,91.617,61.004,91.736z"
          fill="#fef0de"
        />
        {/* Center circle ornament on spire */}
        <circle cx="127.194" cy="81.48" r="12.686" fill="#8c2d2f" />
        {/* Tier 2 */}
        <path
          d="M73.922,138.874c1.486,0.101,2.631,1.36,2.56,2.822c-0.263,5.09-0.394,7.632-0.656,12.733
          c-0.078,1.462,1.092,2.721,2.608,2.816c38.707,2.238,58.129,2.249,96.842,0.036c1.516-0.089,2.679-1.349,2.613-2.81
          c-0.257-5.096-0.382-7.632-0.65-12.733c-0.072-1.462,1.08-2.721,2.566-2.816c6.737-0.43,10.102-0.68,16.838-1.247
          c1.48-0.125,1.617-0.758,0.292-1.408c-13.849-6.832-20.651-10.4-33.981-17.799c-1.271-0.704-3.479-1.235-4.929-1.175
          c-24.649,0.943-36.989,0.943-61.632,0c-1.456-0.054-3.664,0.471-4.935,1.175c-13.33,7.399-20.132,10.967-33.987,17.799
          c-1.325,0.65-1.199,1.289,0.292,1.408C64.22,138.218,67.454,138.463,73.922,138.874z"
          fill="#f6e0ce"
        />
        {/* Tier 3 */}
        <path
          d="M71.332,186.508c1.563,0.101,2.763,1.36,2.691,2.828c-0.263,5.09-0.394,7.632-0.656,12.727
          c-0.078,1.468,1.152,2.727,2.739,2.822c40.557,2.357,60.904,2.363,101.461,0.042c1.593-0.089,2.816-1.36,2.739-2.816
          c-0.257-5.096-0.388-7.638-0.644-12.739c-0.078-1.456,1.128-2.715,2.685-2.822c7.071-0.442,10.597-0.71,17.656-1.307
          c1.557-0.125,1.701-0.764,0.322-1.408c-14.505-6.778-21.618-10.317-35.604-17.692c-1.337-0.698-3.646-1.223-5.173-1.164
          c-25.866,0.99-38.82,0.99-64.693,0c-1.528-0.066-3.843,0.465-5.179,1.164c-13.98,7.369-21.105,10.913-35.598,17.692
          c-1.384,0.65-1.247,1.283,0.316,1.414C61.165,185.822,64.554,186.072,71.332,186.508z"
          fill="#f6e0ce"
        />
        {/* Ground / base platform */}
        <path
          d="M203.707,231.415c-15.144-6.725-22.591-10.257-37.215-17.59c-1.39-0.698-3.825-1.217-5.418-1.158
          c-27.102,1.038-40.658,1.038-67.754,0c-1.599-0.06-4.028,0.453-5.424,1.158c-14.625,7.333-22.071,10.866-37.215,17.59
          c-1.444,0.632-1.295,1.271,0.334,1.408c7.089,0.597,10.639,0.859,17.734,1.319c1.635,0.107,2.894,1.366,2.822,2.834
          c-0.263,5.096-0.394,7.638-0.656,12.733c-0.078,1.462,1.211,2.727,2.87,2.828c42.401,2.458,63.672,2.47,106.079,0.048
          c1.659-0.095,2.948-1.366,2.864-2.822c-0.257-5.096-0.382-7.644-0.644-12.739c-0.072-1.456,1.187-2.727,2.828-2.828
          c7.387-0.471,11.08-0.746,18.473-1.366C205.008,232.692,205.151,232.059,203.707,231.415z"
          fill="#ebd9c8"
        />
      </svg>
    );
  }

  /* --- KYOTO card: japenese_temple.svg (Shinto shrine / roof structure) --- */
  if (type === "fox") {
    return (
      <svg className={cls} viewBox="0 0 42.169 42.168" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Grand roof sweep */}
        <path
          d="M41.189,5.277L0.979,5.274c-0.627,0-1.06,0.085-0.967,0.189C0.059,5.515,0.114,5.578,0.18,5.651
          c0.21,0.261,0.564,0.591,1.045,0.994c0.496,0.376,1.118,0.814,1.885,1.231c0.766,0.411,1.654,0.837,2.657,1.205
          c1,0.372,2.1,0.744,3.287,1.025c1.182,0.309,2.44,0.568,3.754,0.773c1.312,0.183,2.672,0.392,4.062,0.468
          c1.388,0.106,2.801,0.147,4.215,0.17c1.413-0.025,2.826-0.064,4.215-0.17c1.392-0.079,2.749-0.285,4.062-0.468
          c1.312-0.205,2.572-0.466,3.752-0.773C34.3,9.826,35.4,9.452,36.4,9.082c1.004-0.367,1.893-0.794,2.658-1.204
          c0.767-0.417,1.389-0.855,1.885-1.23c0.49-0.409,0.841-0.737,1.047-0.993c0.064-0.073,0.119-0.136,0.167-0.188
          C42.248,5.362,41.814,5.277,41.189,5.277z"
          fill="#fef0de"
        />
        {/* Temple body / columns and hall */}
        <path
          d="M38.576,35.478h-1.965c-0.627,0-0.754-0.021-0.285-0.043s0.824-0.55,0.793-1.177l-0.628-12.526
          c-0.031-0.626,0.136-1.261,0.366-1.428c0.148-0.108,0.289-0.212,0.414-0.311c0.396-0.344,0.674-0.622,0.836-0.835
          c0.052-0.061,0.096-0.113,0.133-0.157c0.072-0.087,0.055-0.108-0.041-0.046c-0.049,0.031-0.106,0.068-0.174,0.112
          c-0.215,0.163-0.58,0.326-0.996,0.549c-0.098,0.044-0.204,0.089-0.315,0.135c-0.175,0.072-0.343-0.38-0.374-1.006l-0.241-4.84
          c-0.031-0.626-0.271-1.122-0.535-1.109c-0.264,0.013-0.328-0.051-0.146-0.145c0.114-0.058,0.225-0.117,0.328-0.175
          c0.622-0.352,1.125-0.724,1.524-1.04c0.396-0.344,0.674-0.622,0.836-0.835c0.052-0.061,0.096-0.113,0.133-0.157
          c0.072-0.087,0.055-0.108-0.041-0.046c-0.049,0.031-0.106,0.068-0.174,0.111c-0.215,0.163-0.58,0.326-0.996,0.549
          c-0.446,0.201-0.996,0.413-1.633,0.628c-0.646,0.2-1.381,0.391-2.189,0.571c-0.812,0.167-1.696,0.325-2.639,0.459
          c-0.94,0.143-1.943,0.223-2.977,0.335c-2.07,0.16-4.291,0.276-6.511,0.256c-2.22,0.018-4.438-0.101-6.511-0.26
          c-1.031-0.112-2.034-0.195-2.975-0.336c-0.942-0.133-1.824-0.293-2.639-0.459c-0.809-0.18-1.543-0.372-2.188-0.57
          c-0.638-0.215-1.188-0.427-1.634-0.628c-0.426-0.228-0.785-0.389-0.996-0.548c-0.067-0.043-0.125-0.08-0.174-0.111
          c-0.096-0.062-0.113-0.041-0.041,0.046c0.037,0.044,0.081,0.096,0.133,0.157c0.167,0.218,0.448,0.497,0.836,0.836
          c0.398,0.317,0.901,0.688,1.523,1.041c0.104,0.058,0.215,0.117,0.328,0.175c0.183,0.094,0.118,0.158-0.145,0.145
          c-0.264-0.013-0.502,0.483-0.533,1.109l-0.242,4.835c-0.031,0.626-0.199,1.078-0.374,1.006c-0.111-0.045-0.217-0.09-0.315-0.135
          c-0.426-0.228-0.785-0.389-0.996-0.548c-0.067-0.043-0.125-0.08-0.174-0.111c-0.096-0.062-0.113-0.041-0.041,0.046
          c0.037,0.044,0.081,0.096,0.133,0.157c0.167,0.218,0.448,0.497,0.836,0.836c0.125,0.099,0.264,0.204,0.413,0.312
          c0.231,0.167,0.398,0.803,0.367,1.429L5.044,34.256c-0.03,0.627,0.324,1.152,0.793,1.178c0.47,0.023,0.343,0.043-0.285,0.043
          H3.244c-0.627,0-1.135,0.316-1.135,0.709s0.508,0.709,1.135,0.709h8.709c0.627,0,1.135-0.316,1.135-0.709
          s-0.508-0.709-1.135-0.709H9.525c-0.627,0-1.109-0.507-1.078-1.133L8.998,23.36c0.031-0.626,0.532-0.955,1.129-0.766
          c1.273,0.402,2.688,0.742,4.191,0.99c1.072,0.154,2.182,0.338,3.318,0.399c1.134,0.088,2.287,0.125,3.442,0.146
          c1.155-0.021,2.311-0.058,3.442-0.146c1.136-0.065,2.246-0.245,3.317-0.401c1.504-0.248,2.918-0.588,4.192-0.992
          c0.597-0.188,1.098,0.141,1.13,0.767l0.551,10.985c0.031,0.626-0.45,1.133-1.078,1.133h-2.771c-0.627,0-1.135,0.316-1.135,0.709
          s0.508,0.709,1.135,0.709h8.71c0.627,0,1.135-0.316,1.135-0.709C39.711,35.793,39.203,35.478,38.576,35.478z"
          fill="#fef0de"
        />
        {/* Inner tier roof — soft mauve accent */}
        <path
          d="M31.925,21.057c-0.437,0.076-0.887,0.148-1.354,0.216c-0.94,0.144-1.943,0.224-2.975,0.335
          c-2.072,0.16-4.291,0.275-6.513,0.256c-2.22,0.018-4.438-0.101-6.511-0.26c-1.031-0.111-2.034-0.195-2.974-0.336
          c-0.47-0.066-0.92-0.139-1.357-0.216c-0.617-0.109-1.088-0.718-1.057-1.344l0.237-4.752c0.031-0.626,0.537-0.964,1.139-0.785
          c1.159,0.346,2.424,0.638,3.761,0.859c1.072,0.155,2.182,0.338,3.318,0.4c1.134,0.088,2.288,0.125,3.442,0.146
          c1.155-0.023,2.311-0.057,3.442-0.146c1.136-0.066,2.246-0.245,3.317-0.401c1.339-0.221,2.603-0.514,3.763-0.859
          c0.602-0.179,1.106,0.16,1.139,0.786l0.238,4.759C33.015,20.338,32.542,20.948,31.925,21.057z"
          fill="#8c2d2f"
        />
      </svg>
    );
  }

  /* --- FUJI card: sunset_fuji.svg — original paths only, no extra elements --- */
  if (type === "fuji") {
    return (
      <svg className={cls} viewBox="0 0 51.957 51.957" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fuji peak / upper silhouette */}
        <path
          d="M21.442,24.339c0.072-0.009,1.777-0.21,2.865-0.21c0.382,0,0.65,0.024,0.846,0.082l0.895-0.493
          c0.08-0.044,0.17-0.066,0.258-0.066c0.114,0,0.229,0,0.323,0.072c0.009,0.006,0.812,0.568,1.614,0.568l0.066-0.076
          c0.008,0,0.015,0,0.022,0c0.112,0,0.222,0.11,0.312,0.176c0.084,0.061,6.545,4.734,15.101,8.481
          c0.024-0.382,0.058-0.759,0.058-1.146c0-9.622-7.801-17.422-17.423-17.422c-9.292,0-16.863,7.281-17.372,16.446
          c4.3-1.952,8.403-4.068,12.227-6.342C21.297,24.372,21.368,24.348,21.442,24.339z"
          fill="#fef0de"
        />
        {/* Fuji lower slopes + foreground landscape */}
        <path
          d="M43.713,33.459c-8.795-3.8-15.382-8.561-15.382-8.561c-0.029,0.001-0.059,0.002-0.089,0.002
          c-1.004,0-1.937-0.715-1.937-0.715l-1.183,0.649c0.026-0.128-0.328-0.172-0.822-0.172c-1.069,0-2.807,0.206-2.807,0.206
          c-4.226,2.512-8.476,4.659-12.519,6.483c-1.831,0.826-3.623,1.594-5.344,2.286c0.554,0.343,1.031,0.632,1.14,0.632
          c0.271,0-4.77,2.457-4.77,2.457l4.036-1.24v0.359v0.182l3.152-0.631l3.287-0.777l-3.089,2.107l5.083-2.107l1.01,1.049l2.984-3.157
          l-0.447,2.706l2.257-1.264c0,0-3.425,3.608-3.155,3.697c0.003,0.002,0.007,0.002,0.012,0.002c0.38,0,5.218-3.518,5.218-3.518
          s-2,2.705-1.496,2.887c0.042,0.014,0.124,0.021,0.239,0.021c1.276,0,6.72-0.909,9.283-2.729c0.878-0.623,1.562-0.837,2.084-0.837
          c1.142,0,1.522,1.019,1.522,1.019l4.148,2.164l-1.714-1.577c0,0,0.281-0.025,0.709-0.025c0.854,0,2.298,0.101,3.259,0.701
          c0.268,0.167,0.436,0.235,0.532,0.235c0.427,0-0.532-1.317-0.532-1.317s6.672,2.254,7.395,2.345
          c0.02,0.002,0.035,0.004,0.051,0.004c0.521,0-2.125-1.537-2.125-1.537l4.328,0.812l3.895,0.386
          c0.01-0.088,0.022-0.176,0.031-0.264C49.091,35.616,46.308,34.579,43.713,33.459z"
          fill="#f6e0ce"
        />
      </svg>
    );
  }

  /* --- TOKYO card: sushi_dish.svg (寿司) --- */
  return (
    <svg className={cls} viewBox="0 0 48.302 48.302" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sushi dish body — three stacked oval dishes */}
      <path
        d="M36.751,15.748c-1.462,0-2.857,0.108-4.143,0.304c-1.088,0.166-1.947-0.329-1.947-1.207v-1.59
        c0-2.506-5.172-4.537-11.551-4.537S7.56,10.748,7.56,13.255v6.022c0,0.924-0.887,1.79-1.95,2.041C2.251,22.11,0,23.552,0,25.205
        v9.841c0,2.509,5.171,4.539,11.55,4.539s11.55-2.03,11.55-4.537v-6.023c0-0.924,0.477-1.74,1.057-1.852s1.043,0.485,1.043,1.363
        v1.59c0,2.506,5.172,4.537,11.55,4.537c6.379,0,11.552-2.031,11.552-4.537v-9.841C48.302,17.78,43.13,15.748,36.751,15.748z
        M11.55,29.274c-4.896,0-8.866-1.56-8.866-3.483s3.969-3.483,8.866-3.483s8.866,1.559,8.866,3.483S16.446,29.274,11.55,29.274z
        M19.111,17.325c-4.897,0-8.866-1.559-8.866-3.483c-0.001-1.924,3.969-3.483,8.866-3.483s8.867,1.559,8.867,3.483
        C27.977,15.766,24.008,17.325,19.111,17.325z
        M36.752,24.355c-4.896,0-8.866-1.559-8.866-3.483s3.969-3.483,8.866-3.483s8.867,1.559,8.867,3.483S41.649,24.355,36.752,24.355z"
        fill="#fef0de"
      />
      {/* Sushi topping detail — garnish on left dish */}
      <path
        d="M16.472,24.339c-0.688-0.281-1.502-0.083-1.91,0.436c-0.103,0.055-0.275,0.117-0.513,0.178
        c-0.041-0.125-0.103-0.246-0.184-0.361c-0.488-0.687-1.615-1.069-3.351-1.133c-0.957-0.038-4.183-0.044-5.011,1.378
        c-0.286,0.49-0.258,1.042,0.077,1.513c0.759,1.067,2.892,1.364,4.548,1.426c0.102,0.004,0.338,0.011,0.667,0.011
        c1.612,0,5.435-0.173,6.366-1.769C17.524,25.393,17.217,24.643,16.472,24.339z"
        fill="#dac0ca"
      />
      {/* Rice oval — center dish */}
      <ellipse cx="18.718" cy="13.538" rx="4.905" ry="1.651" fill="#fef0de" />
      {/* Rice oval — right dish */}
      <ellipse cx="36.789" cy="20.677" rx="4.905" ry="1.651" fill="#fef0de" />
    </svg>
  );
};

/* --- Mini Seigaiha wave border for card bottom --- */
// bgColor must match the card's bottom gradient color so fans mask each other correctly
const CardSeigaihaFan: React.FC<{ cx: number; cy: number; bgColor: string }> = ({ cx, cy, bgColor }) => {
  const R = 20;
  const radii = [20, 16, 12, 8, 4];
  return (
    <g>
      {/* Solid fill matching card bg — masks layers behind exactly like HeroSection */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z`}
        fill={bgColor}
      />
      {/* Concentric arc rings */}
      {radii.map((r) => (
        <path
          key={r}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#f6e0ce"
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.75"
        />
      ))}
    </g>
  );
};

const CardSeigaihaWave: React.FC<{ bgColor: string; patternId: string }> = ({ bgColor, patternId }) => (
  // z-[1] — deliberately behind SVG illustration (z-10) but above card bg
  <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-[1] h-[40px]">
    <svg className="w-full h-[40px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id={patternId} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        {/* Tier 1 — top row, peaks touch y=0 */}
        <CardSeigaihaFan cx={-40} cy={20} bgColor={bgColor} />
        <CardSeigaihaFan cx={0} cy={20} bgColor={bgColor} />
        <CardSeigaihaFan cx={40} cy={20} bgColor={bgColor} />
        <CardSeigaihaFan cx={80} cy={20} bgColor={bgColor} />
        <CardSeigaihaFan cx={120} cy={20} bgColor={bgColor} />
        {/* Tier 2 — middle row, offset by R in x */}
        <CardSeigaihaFan cx={-20} cy={30} bgColor={bgColor} />
        <CardSeigaihaFan cx={20} cy={30} bgColor={bgColor} />
        <CardSeigaihaFan cx={60} cy={30} bgColor={bgColor} />
        <CardSeigaihaFan cx={100} cy={30} bgColor={bgColor} />
        {/* Tier 3 — bottom row, base touches y=40 (tile bottom) */}
        <CardSeigaihaFan cx={-40} cy={40} bgColor={bgColor} />
        <CardSeigaihaFan cx={0} cy={40} bgColor={bgColor} />
        <CardSeigaihaFan cx={40} cy={40} bgColor={bgColor} />
        <CardSeigaihaFan cx={80} cy={40} bgColor={bgColor} />
        <CardSeigaihaFan cx={120} cy={40} bgColor={bgColor} />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  </div>
);

const DEFAULT_WAVE_BG = ["#7a282a", "#6b1e20", "#591618", "#4e1113"] as const;

const DEFAULT_GRADIENTS = [
  "from-[#b04749] via-[#9e3a3c] to-[#7a282a]",
  "from-[#a33b3d] via-[#8c2d2f] to-[#6b1e20]",
  "from-[#913133] via-[#7a2527] to-[#591618]",
  "from-[#852a2c] via-[#6d1f21] to-[#4e1113]",
] as const;

const DEFAULT_ILLUSTRATIONS: BlogItem["illustration"][] = [
  "fuji", "fox", "castle", "pagoda",
];

const DEFAULT_KANJI = [
  "性能 • FUJI", "設計 • KYOTO", "建築 • OSAKA", "技術 • TOKYO",
] as const;

export const LatestBlogsSection: React.FC<{ blogs?: BlogItem[] }> = ({
  blogs = fallbackBlogs,
}) => {
  return (
    <SectionWrapper
      id="blogs"
      kanjiSubtitle="最新記事"
      sectionTitle="Latest Technical Insights"
      sectionDescription="Articles on modern frontend engineering, system design, performance, and editorial UI craftsmanship."
      bgVariant="surface"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24 relative overflow-hidden"
    >
      {/* Subtle Japanese Watermark Accent ("最新記事") matching surface bg (#ffffff) */}
      <div
        className="hidden md:block absolute top-8 sm:top-12 right-6 sm:right-16 font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.08em] select-none pointer-events-none z-0 leading-none text-[var(--color-watermark-surface)] opacity-75"
        aria-hidden="true"
      >
        最新記事
      </div>

      {/* Responsive layout: smooth horizontal scroll slide on mobile/tablet, 4-column grid on desktop */}
      <div className="relative z-10 flex lg:grid overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none lg:grid-cols-4 gap-6 lg:gap-8 items-start pb-6 pt-2 lg:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-none">
        {blogs.map((blog, index) => {
          // Resolve optional UI-only fields with per-index defaults for DB-sourced blogs
          const bgGradient = blog.bgGradient ?? DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
          const illustration = blog.illustration ?? DEFAULT_ILLUSTRATIONS[index % DEFAULT_ILLUSTRATIONS.length];
          const kanji = blog.kanji ?? DEFAULT_KANJI[index % DEFAULT_KANJI.length];
          const kanjiPrefix = kanji.includes("•") ? kanji.split("•")[0].trim() : kanji;
          const waveBg = DEFAULT_WAVE_BG[index % DEFAULT_WAVE_BG.length];

          // Vertical Japanese phonetic kana per location label
          const locationKanaMap: Record<string, string> = {
            OSAKA: "おおさか",
            KYOTO: "きょうと",
            FUJI: "ふじさん",
            TOKYO: "とうきょう",
          };
          const locationKey = kanji.includes("•") ? kanji.split("•")[1].trim() : "";
          const verticalKana = locationKanaMap[locationKey] ?? "にほん";

          // Staggered vertical offset on desktop (even cards pushed down slightly)
          const isStaggered = index % 2 === 1;

          return (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative rounded-[2.2rem] overflow-hidden bg-gradient-to-b ${bgGradient} text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer w-[230px] sm:w-[260px] lg:w-auto flex-shrink-0 snap-center lg:snap-align-none h-[460px] sm:h-[480px] lg:h-[500px] flex flex-col justify-between p-6 ${isStaggered ? "lg:mt-10" : "lg:mt-0"
                }`}
            >
              {/* Omamori hanging hole — single solid circle inside card top */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full"
                style={{ backgroundColor: "#fef0de" }}
              />

              {/* --- DEFAULT VISUAL STATE (Vertical Banner Typography & Kanji) --- */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 pt-10">
                {/* Vertical Category Tag */}
                <div className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase border border-white/20">
                  {blog.category}
                </div>

                {/* Large Vertical Title & Kanji */}
                <div className="space-y-2 flex flex-col items-center">
                  <span className="font-serif font-bold text-xs tracking-widest text-white/70 uppercase">
                    {kanji}
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight leading-snug line-clamp-3">
                    {blog.title}
                  </h3>
                  {/* Vertical Japanese kana — written top-to-bottom (tategaki) */}
                  <div className="flex justify-center mt-1">
                    <span
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                      className="font-serif text-sm tracking-[0.3em] text-white/40 select-none leading-none"
                    >
                      {verticalKana}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seigaiha wave accent — behind illustration (z-[1] < z-10) */}
              <CardSeigaihaWave patternId={`card-seigaiha-${blog.id || index}`} bgColor={waveBg} />

              {/* Bottom Graphic Illustration Motif */}
              <div className="relative z-10 w-full mt-4 flex items-center justify-center">
                <VerticalBannerIllustration type={illustration} />
              </div>

              {/* --- HOVER STATE (Information & Article Detail Overlay) --- */}
              <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#1c1917]/95 via-[#1c1917]/98 to-[#1c1917] p-6 sm:p-7 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md">
                {/* Top Header info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="accent"
                      size="sm"
                      className="bg-[#f6e0ce]/20 text-[#fef0de] border border-[#f6e0ce]/40 font-mono tracking-wider uppercase text-[9px] px-1.5 py-0.5 truncate max-w-[125px] sm:max-w-none"
                    >
                      {blog.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-white/70 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-primary shrink-0" />
                      {blog.readingTime || "5 min read"}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans line-clamp-4">
                    {blog.description}
                  </p>
                </div>

                {/* Bottom Footer Info & Action */}
                <div className="pt-4 border-t border-white/15 flex flex-col space-y-4">
                  <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {blog.publishedAt}
                    </span>
                    <span className="font-serif text-white/50">{kanjiPrefix}</span>
                  </div>

                  <Link href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center shadow-md"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Read Article
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile & Tablet Swipe Hint Indicator */}
      <div className="flex lg:hidden items-center justify-center gap-2.5 mt-6 text-[11px] font-mono tracking-widest text-text-muted/70 uppercase select-none">
        <span className="w-2 h-2 rounded-full bg-[#f6e0ce] border border-primary/30 animate-pulse" />
        <span>SWIPE TO EXPLORE ARTICLES</span>
        <span className="w-2 h-2 rounded-full bg-[#f6e0ce] border border-primary/30 animate-pulse" />
      </div>
    </SectionWrapper>
  );
};
