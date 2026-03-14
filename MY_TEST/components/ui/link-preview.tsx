"use client";

import React from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

type PreviewItem = {
  src: string;
  alt?: string;
  caption?: string;
};

type LinkPreviewProps = {
  href: string;
  title?: string;
  description?: string;
  previews?: PreviewItem[];
};

// Simple, responsive hover-preview card that shows a few static screenshots
export function LinkPreview({ href, title, description, previews = [] }: LinkPreviewProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link href={href} className="group inline-block rounded-md border border-transparent px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
          {title ?? "Preview"}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent align="start" side="bottom" className="max-w-md p-4 bg-white/90 backdrop-blur rounded-xl shadow-md border border-gray-200 dark:bg-black/70 dark:border-gray-800" style={{ zIndex: 50 }}>
        <div className="flex flex-col space-y-2">
          {description && <p className="text-sm text-gray-700 dark:text-gray-200">{description}</p>}
          <div className="grid grid-cols-3 gap-2 mt-1">
            {previews.map((p, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={p.src} alt={p.alt ?? `Preview ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                {p.caption && <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">{p.caption}</span>}
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default LinkPreview;
