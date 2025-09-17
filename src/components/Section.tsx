import React from "react";

interface SectionProps {
  id: string;
  title: string;

  children?: React.ReactNode;
}

export default function Section({ id, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`h-screen flex items-center justify-center`}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        {children}
      </div>
    </section>
  );
}
