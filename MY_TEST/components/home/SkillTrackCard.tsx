"use client";

import { useEffect, useRef } from "react";

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
  const thumbRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

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
    const thumbEl = thumbRef.current;

    rafRef.current = null;

    if (!el || !thumbEl) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      thumbEl.style.opacity = "0";
      thumbEl.style.height = "0px";
      thumbEl.style.transform = "translateY(0px)";
      return;
    }

    const ratio = clientHeight / scrollHeight;
    const minThumb = 26;
    const height = Math.max(minThumb, Math.round(clientHeight * ratio));
    const maxTop = Math.max(0, clientHeight - height);
    const top = Math.round((scrollTop / (scrollHeight - clientHeight)) * maxTop);
    thumbEl.style.opacity = "1";
    thumbEl.style.height = `${height}px`;
    thumbEl.style.transform = `translateY(${top}px)`;
  };

  const scheduleThumbUpdate = () => {
    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = requestAnimationFrame(updateThumb);
  };

  useEffect(() => {
    scheduleThumbUpdate();
    const onResize = () => scheduleThumbUpdate();

    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  return (
    <article className="qa-panel-soft qa-skill-card rounded-2xl p-5">
      <h2 className="qa-display text-xl">{title}</h2>
      <div className="qa-skill-scroll-wrap mt-3">
        <ul
          ref={scrollRef}
          onScroll={scheduleThumbUpdate}
          className="qa-muted qa-skill-list qa-skill-scroll qa-native-scrollbar-hide space-y-3 text-sm leading-relaxed"
        >
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="qa-skill-item">
              {disableHighlight ? item : renderToolHighlights(item, `${title}-${index}`)}
            </li>
          ))}
        </ul>
        <div className="qa-mobile-scroll-track" aria-hidden="true">
          <span ref={thumbRef} className="qa-mobile-scroll-thumb" />
        </div>
      </div>
    </article>
  );
}
