import { Metadata } from "next";

const defaultDescription =
  "Integrate Google Reviews into your static sites with ease. Perfect for web developers building for local businesses.";

export const SITE_NAME = "BragFeed.dev";

export const DEFAULT_METADATA: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Google Review Integrations Made Easy`,
  },
  description: defaultDescription,
  keywords: [
    "Google Reviews",
    "Static Site Generation",
    "SSG",
    "Web Development",
    "Local Business",
  ],
  authors: [{ name: "BragFeed.dev Team" }],
  creator: "BragFeed.dev",
  publisher: "BragFeed.dev",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export function createMetadata({
  title,
  description,
}: {
  title?: string;
  description?: string;
} = {}): Metadata {
  const computedTitle = title || SITE_NAME;
  const computedDescription = description || defaultDescription;

  return {
    title: computedTitle,
    description: computedDescription,
    openGraph: {
      title: computedTitle,
      description: computedDescription,
    },
    twitter: {
      title: computedTitle,
      description: computedDescription,
    },
  };
}
