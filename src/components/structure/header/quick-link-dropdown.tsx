"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import Link from "next/link";
import { applications } from "./quick-links";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderText = () => {
  return (
    <Link href="/" className="font-bold text-lg">
      Web Dev Tools
    </Link>
  );
};

export default function QuickLinkDropdown({ noAuth }: { noAuth?: boolean }) {
  const session = useSession();

  if (session.status === "unauthenticated" || noAuth) {
    return <HeaderText />;
  }

  if (session.status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <HeaderText />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <span className="font-bold">Web Dev Tools</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        <DropdownMenuLabel>Applications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {applications.map((app) => (
          <DropdownMenuItem key={app.id} asChild>
            <Link href={app.url}>
              <div className="flex items-center gap-2">
                <app.icon className="h-4 w-4" />
                <span>{app.name}</span>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
