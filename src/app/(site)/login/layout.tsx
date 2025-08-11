import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Login",
  description:
    "Sign in to your BragFeed.dev account to manage your Google Reviews integrations.",
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
