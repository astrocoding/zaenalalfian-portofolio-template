import * as React from "react";

export const JsonLd: React.FC = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zaenalalfian.dev";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Zaenal Alfian",
    alternateName: "才",
    jobTitle: "Full-Stack Engineer",
    url: baseUrl,
    sameAs: [
      "https://github.com/zaenalalfian",
      "https://linkedin.com/in/zaenalalfian",
      "https://twitter.com/zaenalalfian",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM",
      "TailwindCSS",
      "Software Architecture",
      "UI UX Design",
    ],
    description:
      "Senior Full-Stack Engineer and Product Architect building high-performance web products with clean code and Japanese minimalist design.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zaenal Alfian Portfolio",
    url: baseUrl,
    description: "Personal portfolio, engineering projects, technical blogs, and documentation.",
    author: {
      "@type": "Person",
      name: "Zaenal Alfian",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};
