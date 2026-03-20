"use client";

import { useEffect, useRef, useState } from "react";

const TOOL_HIGHLIGHTS = [
  "Collection Runner",
  "Device Toolbar",
  "Copy as cURL",
  "Android Studio",
  "PerfectPixel",
  "Throttling",
  "Application",
  "Perplexity",
  "Postman",
  "Swagger",
  "DevTools",
  "Elements",
  "Console",
  "Network",
  "Sources",
  "Override",
  "RabbitMQ",
  "GitLab",
  "CI/CD",
  "Portainer",
  "DataGrip",
  "Charles",
  "Cursor",
  "Photoshop",
  "Figma",
  "vibe coding",
].sort((a, b) => b.length - a.length);

const TOOL_HIGHLIGHT_SET = new Set(TOOL_HIGHLIGHTS.map((tool) => tool.toLowerCase()));

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const TOOL_HIGHLIGHT_RE = new RegExp(
  `(${TOOL_HIGHLIGHTS.map((tool) => escapeRegExp(tool)).join("|")})`,
  "gi",
);

type SkillTrackCardProps = {
  title: string;
  items: string[];
  disableHighlight?: boolean;
};

export function SkillTrackCard({
  title,
  items,
  disableHighlight = false,
}: SkillTrackCardProps) {
  const scrollRef = useRef<HTMLUListElement | null>(null);
  const [thumb, setThumb] = useState({ height: 28, top: 0, visible: false });

  const renderToolHighlights = (text: string, keyPrefix: string) =>
    text.split(TOOL_HIGHLIGHT_RE).map((chunk, index) => {
      if (TOOL_HIGHLIGHT_SET.has(chunk.toLowerCase())) {
        return (
          <span key={`${keyPrefix}-${index}`} className="qa-tool-mark">
            {chunk}
          </span>
        );
      }

      return <span key={`${keyPrefix}-${index}`}>{chunk}</span>;
    });

  const updateThumb = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setThumb({ height: 0, top: 0, visible: false });
      return;
    }

    const ratio = clientHeight / scrollHeight;
    const minThumb = 26;
    const height = Math.max(minThumb, Math.round(clientHeight * ratio));
    const maxTop = Math.max(0, clientHeight - height);
    const top = Math.round((scrollTop / (scrollHeight - clientHeight)) * maxTop);
    setThumb({ height, top, visible: true });
  };

  useEffect(() => {
    const id = requestAnimationFrame(updateThumb);
    const onResize = () => updateThumb();

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [items.length]);

  return (
    <article className="qa-panel-soft qa-skill-card rounded-2xl p-5">
      <h2 className="qa-display text-xl">{title}</h2>
      <div className="qa-skill-scroll-wrap mt-3">
        <ul
          ref={scrollRef}
          onScroll={updateThumb}
          className="qa-muted qa-skill-list qa-skill-scroll qa-native-scrollbar-hide space-y-3 text-sm leading-relaxed"
        >
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="qa-skill-item">
              {disableHighlight ? item : renderToolHighlights(item, `${title}-${index}`)}
            </li>
          ))}
        </ul>
        <div className="qa-mobile-scroll-track" aria-hidden="true">
          {thumb.visible ? (
            <span
              className="qa-mobile-scroll-thumb"
              style={{ height: `${thumb.height}px`, transform: `translateY(${thumb.top}px)` }}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
