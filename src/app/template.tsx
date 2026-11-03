import type { ReactNode } from "react";

/** Плавное появление страницы при каждом переходе. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
