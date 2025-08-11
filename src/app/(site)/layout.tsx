import { redirect } from "next/navigation";

import Navigation from "@/components/structure/header/navigation";
import Footer from "@/components/structure/footer";

import { auth } from "~/auth";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navigation noAuth />
      <main className="grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
