import { cn } from "@/lib/utils";
import { House, Building2 } from "lucide-react";
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

function DashboardIcon({ className }: { className?: string }) {
  return (
    <IconBase className={"bg-red-400"}>
      <House className={className} />
    </IconBase>
  );
}

function BusinessesIcon({ className }: { className?: string }) {
  return (
    <IconBase className={"bg-blue-400"}>
      <Building2 className={className} />
    </IconBase>
  );
}

export const applications = [
  {
    id: "dashboard",
    name: "Dashboard",
    url: "/",
    icon: DashboardIcon,
  },
  {
    id: "businesses",
    name: "Businesses",
    url: "/google-reviews",
    icon: BusinessesIcon,
  },
];
