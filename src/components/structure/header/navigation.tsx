"use client";

import UserNav from "./user-nav";
import QuickLinkDropdown from "./quick-link-dropdown";

export default function Navigation({ noAuth }: { noAuth?: boolean }) {
  return (
    <nav className="w-full bg-background py-4 flex justify-between px-2">
      <QuickLinkDropdown noAuth={noAuth} />
      <UserNav noAuth={noAuth} />
    </nav>
  );
}
