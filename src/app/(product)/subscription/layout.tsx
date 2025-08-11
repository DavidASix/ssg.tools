import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Subscription",
  description: "Manage your BragFeed.dev subscriptions.",
});

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
