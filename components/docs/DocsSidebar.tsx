"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Book, ChevronRight } from "lucide-react";
import { CategoryGroup } from "@/lib/docs";

export interface DocsSidebarProps {
  categories: CategoryGroup[];
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ categories }) => {
  const [query, setQuery] = React.useState("");
  const pathname = usePathname();

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    docs: cat.docs.filter((doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.docs.length > 0);

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 lg:border-r border-border-subtle lg:pr-6">
      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter docs... / 検索"
          className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-md border border-border-warm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Category Groups */}
      <div className="space-y-6">
        {filteredCategories.map((group) => (
          <div key={group.category} className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-serif font-bold text-ink uppercase tracking-wider">
              <Book className="w-3.5 h-3.5 text-primary" />
              <span>{group.displayName}</span>
            </div>

            <ul className="space-y-1 pl-2 border-l border-border-subtle text-xs font-sans">
              {group.docs.map((doc) => {
                const docHref = `/docs/${group.category}/${doc.slug}`;
                const isActive = pathname === docHref;

                return (
                  <li key={doc.slug}>
                    <Link
                      href={docHref}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary -ml-[9px]"
                          : "text-ink-muted hover:text-ink hover:bg-black/5"
                      }`}
                    >
                      <span className="truncate">{doc.title}</span>
                      <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};
