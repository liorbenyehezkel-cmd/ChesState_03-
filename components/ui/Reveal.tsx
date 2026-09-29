import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
};

export function Reveal({
  children,
  className,
  as: Tag = "div",
}: RevealProps) {
  return <Tag className={className}>{children}</Tag>;
}
