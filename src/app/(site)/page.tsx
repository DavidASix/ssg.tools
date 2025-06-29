"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import SiteLayout from "./layout";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AuroraText } from "@/components/magicui/aurora-text";
import PricingOptions from "@/components/common/pricing-options";

const reviews = {
  count: 65,
  avatars: [
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
      alt: "Avatar 1",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
      alt: "Avatar 2",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
      alt: "Avatar 3",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
      alt: "Avatar 4",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
      alt: "Avatar 5",
    },
  ],
};

export default function Home() {
  const router = useRouter();
  return (
    <SiteLayout>
      <section className="section section-padding grow flex min-h-[60vh]">
        <div className="content text-center flex flex-col justify-center items-center">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
            <h1 className="text-3xl font-extrabold lg:text-6xl">
              Simple Tools for
              <br /> <AuroraText>Static Websites</AuroraText>
            </h1>
            <p className="text-balance text-muted-foreground lg:text-lg">
              Do you build static sites for your clients, but struggle
              integrating Google Reviews into your static setup? You are in the
              right place!
            </p>
          </div>
          <ShimmerButton
            className="mt-10 h-10 w-64"
            shimmerSize="0.15em"
            onClick={() => router.push("/login")}
          >
            Get Started
          </ShimmerButton>
          <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
            <span className="mx-4 inline-flex items-center -space-x-4">
              {reviews.avatars.map((avatar, index) => (
                <Avatar key={index} className="size-14 border">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                </Avatar>
              ))}
            </span>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="size-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-left font-medium text-muted-foreground">
                from {reviews.count}+ reviews
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-padding">
        <div className="content flex flex-col items-center justify-center gap-10">
          <PricingOptions />
        </div>
      </section>
    </SiteLayout>
  );
}
