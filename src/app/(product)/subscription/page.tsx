"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Stripe from "stripe";

import checkActiveSubscriptionSchema from "@/app/api/purchases/check-active-subscription/schema";
import checkoutContextSchema from "@/app/api/purchases/initialize-checkout/schema";
import requests from "@/lib/requests";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionPage() {
  const subscriptionQuery = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      return await requests.get(checkActiveSubscriptionSchema);
    },
    meta: {
      errorMessage: "Failed to fetch subscription status",
    },
  });

  const calculateDaysRemaining = (subscriptionEnd: Date) => {
    const now = new Date();
    const diffTime = subscriptionEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const onClickCheckout = async () => {
    try {
      const checkout = await requests.post(checkoutContextSchema, {
        product: "all_access",
      });
      const session = checkout.session satisfies Stripe.Checkout.Session;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );
      if (!session.id || !stripe) {
        throw new Error("Error initializing checkout session or Stripe");
      }
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate checkout. Please try again later.");
    }
  };

  return (
    <section className="section section-padding">
      <div className="content">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Subscription Status</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              Manage your subscription and access to all tools
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Your subscription status and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscriptionQuery.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : subscriptionQuery.data?.hasActiveSubscription ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-green-600">
                    ✅ You have an active subscription
                  </p>
                  {subscriptionQuery.data.subscriptionEnd && (
                    <p className="text-sm text-muted-foreground">
                      Days remaining:{" "}
                      {calculateDaysRemaining(
                        subscriptionQuery.data.subscriptionEnd,
                      )}{" "}
                      days
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-red-600">
                    ❌ You do not have an active subscription
                  </p>
                  <p className="text-muted-foreground">
                    Get unlimited access to all tools with your subscription
                  </p>
                  <Button size="lg" onClick={onClickCheckout}>
                    Subscribe Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
