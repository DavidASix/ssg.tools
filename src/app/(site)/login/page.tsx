"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

export default function Home() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const handleSignIn = async (formData: FormData) => {
    try {
      const email = z.string().parse(formData.get("email"));
      if (!email) {
        throw new Error("Email is required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email");
      }
      const method =
        process.env.NODE_ENV === "development" ? "email" : "resend";
      const signInAttempt = await signIn(method, {
        email,
        redirect: false,
        redirectTo: "/",
      });

      if (!signInAttempt?.ok || !signInAttempt) {
        throw new Error(signInAttempt?.error || "Failed to sign in");
      }

      toast.success("Check your email for a sign in link");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error signing in";
      console.error("Error signing in:", error);
      toast.error(message);
    }
  };

  if (user) {
    redirect("/");
  }

  return (
    <section className="flex grow section section-padding">
      <div className="grow content flex flex-col items-center justify-center">
        {status === "loading" ? (
          <LoadingSpinner />
        ) : (
          <form action={(e) => handleSignIn(e)} className="flex flex-col gap-4">
            <Input type="text" name="email" placeholder="Email" />
            <Button type="submit">Signin with Resend</Button>
          </form>
        )}
      </div>
    </section>
  );
}
