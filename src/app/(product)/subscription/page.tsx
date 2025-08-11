"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Stripe from "stripe";

import checkActiveSubscriptionSchema from "@/app/api/purchases/check-active-subscription/schema";
import checkoutContextSchema from "@/app/api/purchases/initialize-checkout/schema";
import cancelSubscriptionSchema from "@/app/api/purchases/cancel-subscription/schema";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SubscriptionPage() {
  const [isCancelling, setIsCancelling] = useState(false);
  const queryClient = useQueryClient();

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

  const onCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const result = await requests.post(cancelSubscriptionSchema, undefined);

      if (result.success) {
        toast.success(result.message);
        // Refresh subscription status to reflect the cancellation
        await queryClient.invalidateQueries({
          queryKey: ["subscription-status"],
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error("Failed to cancel subscription. Please try again later.");
    } finally {
      setIsCancelling(false);
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
                <div className="space-y-4">
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
                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isCancelling}>
                          {isCancelling
                            ? "Cancelling..."
                            : "Cancel Subscription"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your subscription will be cancelled as of{" "}
                            {subscriptionQuery.data.subscriptionEnd
                              ?.toISOString()
                              .slice(0, 10)}
                            . You will not be charged again, but your review
                            integrations will no longer work after that day.
                            <br />
                            You may re-subscribe at any time.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={onCancelSubscription}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, cancel subscription
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
