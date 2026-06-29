import type { ReactNode } from "react";

export function SectionHeading({
  label,
  children,
  className = "",
  align = "left",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`${className} ${align === "center" ? "text-center" : ""}`}>
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
        {label}
      </div>
      <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        {children}
      </h2>
    </div>
  );
}
