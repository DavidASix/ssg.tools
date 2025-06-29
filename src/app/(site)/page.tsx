"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star, Code, Users, Globe } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import { ShimmerButton } from "@/components/magicui/shimmer-button";
import PricingOptions from "@/components/common/pricing-options";

const devCount = 24;
const reviews = {
  count: 16,
  avatars: [
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
      alt: "Frontend developer from Austin",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
      alt: "Agency owner from Seattle",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
      alt: "Freelance web developer from NYC",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
      alt: "JAMstack developer from SF",
    },
    {
      src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
      alt: "Static site specialist from Portland",
    },
  ],
};

const steps = [
  {
    step: "01",
    title: "Connect Your Business",
    description: "Add your Google Business Profile in 30 seconds",
  },
  {
    step: "02",
    title: "Get Your API Endpoint",
    description: "Copy your unique endpoint URL for your static site",
  },
  {
    step: "03",
    title: "Fetch in Your Build",
    description:
      "Use the endpoint in your build process - fresh reviews every time",
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
        <div className="content text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-6xl mb-6">
              Your All-in-One
              <br />
              <span className="text-primary">Google Reviews</span> Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Integrate fresh Google Reviews into Gatsby, Next.js, Hugo, or any
              static site generator. Instantly create review displays and boost
              your client&apos;s credibility by 10x.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <ShimmerButton
              className="h-12 px-8 bg-primary text-white hover:bg-primary/90"
              shimmerSize="0.15em"
              onClick={() => router.push("/login")}
            >
              ✨ Try Free Now
            </ShimmerButton>
            <button className="h-12 px-8 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Add to Chrome - Free
            </button>
          </div>

          {/* Product Screenshot */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600 ml-4">
                  ssg.tools - Google Reviews API
                </span>
              </div>
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-4">API Endpoint</h3>
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                      <span className="text-green-400">GET</span>{" "}
                      <span className="text-blue-400">
                        https://api.ssg.tools/reviews/
                      </span>
                      <span className="text-yellow-400">{"{business-id}"}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-4">
                      Fresh Reviews
                    </h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {i}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-600">
                              &quot;Example review text for demo...&quot;
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="content text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Loved by Over {devCount} Developers Worldwide
          </h2>
          <div className="mx-auto my-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
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

          {/* Company/Framework Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">Gatsby</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">Next.js</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">Hugo</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">Jekyll</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">11ty</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Personas Section */}
      <section className="py-20 bg-blue-50">
        <div className="content">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Developers</h3>
              <p className="text-gray-600 leading-relaxed">
                SSG.tools enables developers to integrate Google Reviews into
                any static site generator, eliminating API complexity and rate
                limiting issues for faster client delivery.
              </p>
            </Card>

            <Card className="p-8 text-center bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Agencies</h3>
              <p className="text-gray-600 leading-relaxed">
                SSG.tools helps agencies streamline client projects by providing
                reliable review data, reducing development time and ensuring
                consistent review updates across all client sites.
              </p>
            </Card>

            <Card className="p-8 text-center bg-white">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Freelancers</h3>
              <p className="text-gray-600 leading-relaxed">
                SSG.tools empowers freelancers to offer professional review
                integration services, impressing clients with automated,
                always-fresh Google Reviews on their websites.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="content">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Setup takes 5 minutes. Then your reviews update automatically
              forever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="mt-16 text-center">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">
                  Integration Example
                </span>
              </div>
              <div className="text-left font-mono text-base text-gray-100 leading-relaxed">
                <span className="text-gray-500">
                  {"// Works with any static site generator"}
                </span>
                <br />
                <span className="text-blue-400">const</span>{" "}
                <span className="text-yellow-300">reviews</span> ={" "}
                <span className="text-blue-400">await</span>{" "}
                <span className="text-blue-400">fetch</span>(<br />
                &nbsp;&nbsp;
                <span className="text-green-400">
                  &apos;https://api.ssg.tools/reviews/your-business-id&apos;
                </span>
                <br />
                ).<span className="text-blue-400">then</span>(
                <span className="text-orange-300">res</span> =&gt;{" "}
                <span className="text-orange-300">res</span>.
                <span className="text-blue-400">json</span>())
                <br />
                <br />
                <span className="text-gray-500">
                  {"// Fresh Google Reviews in your static build! ✨"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="content text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Stop Fighting Google&apos;s API?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join the developers who&apos;ve already simplified their review
              integration process. Start building faster with fresh Google
              Reviews in your static sites.
            </p>
            <div className="py-10">
              <PricingOptions />
            </div>
            <div className="flex flex-col gap-4 justify-center items-center">
              <ShimmerButton
                className="h-14 px-10 text-lg"
                shimmerSize="0.15em"
                onClick={() => router.push("/login")}
              >
                ✨ Get Started Today
              </ShimmerButton>
              <p className="text-white/70 text-sm">
                Credit card required, billed through Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About The Developer Section */}
      <section className="py-20 bg-gray-50">
        <div className="content">About the developer</div>
      </section>
    </>
  );
}
