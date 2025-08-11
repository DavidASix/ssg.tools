import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Google Reviews",
  description:
    "Manage your Google Business Profile integrations. Add businesses, view reviews, and get API endpoints for your static sites.",
});

export default function GoogleReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
