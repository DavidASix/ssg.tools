import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import { redirect } from "next/navigation";

import Navigation from "@/components/structure/header/navigation";
import { auth } from "~/auth";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query error:", error);
      const message =
        query?.meta?.errorMessage ?? error.message ?? "An error occurred";
      toast.error(`Something went wrong: ${message}`);
    },
  }),
});

export default async function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    console.log("Session does not exist, redirecting to login");
    redirect("/login");
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Navigation />
        <main>{children}</main>
      </QueryClientProvider>
    </>
  );
}
