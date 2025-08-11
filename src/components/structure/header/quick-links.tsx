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
    <IconBase className={"bg-gradient-to-br from-yellow-200 to-yellow-700"}>
      <House className={cn("text-yellow-50", className)} />
    </IconBase>
  );
}

function BusinessesIcon({ className }: { className?: string }) {
  return (
    <IconBase className={"bg-gradient-to-br from-amber-200 to-amber-700"}>
      <Building2 className={cn("text-amber-50", className)} />
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
