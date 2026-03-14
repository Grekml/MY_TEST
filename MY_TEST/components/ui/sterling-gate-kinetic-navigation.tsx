"use client";
import React, { useEffect, useRef, useState } from 'react';

type MenuItem = { id: string; label: string; targetId: string };
const PROJECT_ITEMS: MenuItem[] = [
  { id: 'files', label: 'ScanWow', targetId: 'project-files' },
  { id: 'admin', label: 'LinX', targetId: 'project-admin' },
  { id: 'docker', label: 'Юркас', targetId: 'project-docker' },
  { id: 'team', label: 'Binary Options', targetId: 'project-team' },
  { id: 'b2box', label: 'B2Box', targetId: 'project-b2box' }
];

export default function SterlingGateKineticNavigation() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let mounted = true;
    const el = panelRef.current;
    if (!el) return;
    (async () => {
      const gsapMod = await import('gsap');
      const gsap = (gsapMod as any).gsap || (gsapMod as any).default?.gsap;
      if (!gsap) return;
      try {
        const ceMod = await import('gsap/CustomEase');
        const CustomEase = (ceMod as any).CustomEase;
        if (CustomEase) (gsap as any).registerPlugin(CustomEase);
      } catch { /* ignore */ }
      if (!mounted) return;
      if (open) {
        el.style.display = 'flex';
        (gsap as any).to(el, { duration: 0.6, opacity: 1, scale: 1, ease: 'power4.out' });
        const items = el.querySelectorAll<HTMLAnchorElement>('.kg-item');
        (gsap as any).fromTo(items, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.28 });
        document.body.style.overflow = 'hidden';
      } else {
        (gsap as any).to(el, {
          duration: 0.45,
          opacity: 0,
          scale: 0.98,
          ease: 'power4.in',
          onComplete: () => { if (panelRef.current) panelRef.current.style.display = 'none'; }
        });
        document.body.style.overflow = '';
      }
    })();
    return () => { mounted = false; };
  }, [open]);

  const toggle = () => setOpen(v => !v);
  const onItemClick = (targetId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    <>
      <button aria-label="Open project menu" className="kg-trigger" onClick={toggle}>Projects</button>
      <div ref={panelRef} className="kg-overlay" style={{ display: 'none', opacity: 0 }}>
        <div className="kg-backdrop" onClick={() => setOpen(false)} />
        <div className="kg-panel" role="dialog" aria-label="Projects fullscreen menu">
          <div className="kg-head">
            <button className="kg-close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <ul className="kg-items">
            {PROJECT_ITEMS.map((it) => (
              <li key={it.id}>
                <a href={`#${it.targetId}`} className="kg-item" onClick={onItemClick(it.targetId)}>{it.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .kg-overlay { position: fixed; inset: 0; z-index: 9999; }
        .kg-backdrop { position: absolute; inset: 0; background: rgba(15,18,26,0.85); }
        .kg-panel { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .kg-head { position: absolute; top: 1rem; right: 1rem; display: flex; align-items: center; justify-content: flex-end; width: calc(100% - 2rem); max-width: 980px; }
        .kg-title { font-family: ui-serif, Georgia, 'Times New Roman', serif; font-size: 1.5rem; color: #fff; }
        .kg-close { background: transparent; border: none; color: #fff; font-size: 1.25rem; cursor: pointer; 
          /* focus-visible for accessibility without extra dependencies */
          transition: transform 180ms ease, color 180ms ease, box-shadow 180ms ease;
        }
        .kg-items { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .kg-item { display: block; padding: 1rem 1.25rem; text-align: center; border-radius: 12px; background: rgba(245,211,0,0.15); color: #fff; text-decoration: none; font-size: 2rem; font-weight: 400; transition: background-color 0.25s ease, box-shadow 0.25s ease, outline 0.25s ease, transform 0.25s ease; transform: translateZ(0); }
        .kg-item:hover { background: rgba(245,211,0,0.45); box-shadow: 0 6px 16px rgba(0,0,0,0.25); outline: 2px solid rgba(245,211,0,0.9); outline-offset: 0; transform: translateY(-2px); }
        .kg-item:focus-visible { outline: 2px solid rgba(245,211,0,0.95); outline-offset: 2px; background: rgba(245,211,0,0.6); transform: translateY(-1px); }
        .kg-item:hover, .kg-item:focus-visible { will-change: transform; }
        /* Move trigger into normal document flow and center under heading */
        .kg-trigger {
          position: static;
          display: block;
          margin: 1rem auto;
          padding: .6rem 1.65rem;
          min-width: 170px;
          border-radius: 999px;
          border: 1px solid rgba(255, 214, 0, 0.95);
          background: rgba(255, 255, 255, 0.14);
          color: #ffd700;
          font-weight: 700;
          text-align: center;
          transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
          box-shadow: 0 6px 22px rgba(0,0,0,0.45);
          will-change: transform;
        }
        .kg-trigger:hover {
          background: rgba(255, 255, 255, 0.28);
          color: #ffd700;
          border-color: rgba(255, 214, 0, 1);
          box-shadow: 0 6px 16px rgba(255, 214, 0, 0.55);
          transform: translateY(-2px);
        }
        .kg-trigger:focus-visible {
          outline: 2px solid rgba(255, 214, 0, 0.95);
          outline-offset: 2px;
          background: rgba(255, 255, 255, 0.24);
          box-shadow: 0 0 0 4px rgba(255,214,0,0.25);
        }
        @media (max-width: 768px) { .kg-items { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
