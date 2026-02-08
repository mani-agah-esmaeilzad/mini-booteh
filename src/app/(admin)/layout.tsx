import type { ReactNode } from "react";

export const runtime = "nodejs";

export default function AdminGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
