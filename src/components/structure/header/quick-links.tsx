import { cn } from "@/lib/utils";
import { House, Star, WandSparkles } from "lucide-react";
import React from "react";

function IconBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full",
        className ? className : "bg-gray-300",
      )}
    >
      {children}
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <IconBase className={"bg-red-400"}>
      <House className={className} />
    </IconBase>
  );
}

function GoogleReviewsIcon({ className }: { className?: string }) {
  return (
    <IconBase className={"bg-blue-400"}>
      <Star className={className} />
    </IconBase>
  );
}

function BlogGeneratorIcon({ className }: { className?: string }) {
  return (
    <IconBase className={"bg-yellow-400"}>
      <WandSparkles className={className} />
    </IconBase>
  );
}

export const applications = [
  {
    id: "dashboard",
    name: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    id: "google-reviews",
    name: "Google Reviews",
    url: "/google-reviews",
    icon: GoogleReviewsIcon,
  },
  {
    id: "blog-generator",
    name: "Blog Generator",
    url: "/blog-generator",
    icon: BlogGeneratorIcon,
  },
];
