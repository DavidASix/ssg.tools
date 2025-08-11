"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Stripe from "stripe";

import getSubscriptionDetailsSchema from "@/app/api/purchases/get-subscription-details/schema";
import checkoutContextSchema from "@/app/api/purchases/initialize-checkout/schema";
import cancelSubscriptionSchema from "@/app/api/purchases/cancel-subscription/schema";
import requests from "@/lib/requests";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SubscriptionState } from "./_components/subscription-state";

export default function SubscriptionPage() {
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      return await requests.get(getSubscriptionDetailsSchema);
    },
    meta: {
      errorMessage: "Failed to fetch subscription status",
    },
  });

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

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await requests.post(cancelSubscriptionSchema, undefined);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        // Refresh subscription status to reflect the cancellation
        queryClient.invalidateQueries({
          queryKey: ["subscription-status"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Cancel subscription error:", error);
      toast.error("Failed to cancel subscription. Please try again later.");
    },
  });

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
              <SubscriptionState
                dataIsLoading={subscriptionQuery.isLoading}
                cancelIsLoading={cancelSubscriptionMutation.isPending}
                hasActiveSubscription={
                  subscriptionQuery.data?.hasActiveSubscription ?? false
                }
                endDate={subscriptionQuery.data?.subscriptionEnd}
                onClickCheckout={onClickCheckout}
                onClickCancel={() => {
                  cancelSubscriptionMutation.mutate();
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
