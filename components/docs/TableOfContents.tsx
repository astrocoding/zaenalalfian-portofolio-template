"use client";

import * as React from "react";
import { List } from "lucide-react";

export interface DocDocTocItem {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  items: DocDocTocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0 space-y-3 border-l border-border-subtle pl-4 sticky top-24 self-start text-xs">
      <div className="flex items-center space-x-2 font-serif font-bold text-ink uppercase tracking-wider text-[11px]">
        <List className="w-3.5 h-3.5 text-primary" />
        <span>On This Page / 目次</span>
      </div>

      <nav className="space-y-1 font-sans text-ink-muted">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block py-1 hover:text-primary transition-colors truncate ${
              item.level === 3 ? "pl-3 text-[11px]" : "font-medium"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
};
