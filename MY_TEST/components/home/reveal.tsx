import React from "react";

type HomeRevealProps = {
  children: React.ReactNode;
  delay?: number;
};

export const HomeReveal: React.FC<HomeRevealProps> = ({ children, delay = 0 }) => {
  return (
    <div
      className="qa-reveal"
      style={{ "--qa-reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
