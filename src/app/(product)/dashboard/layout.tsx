import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Dashboard",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
