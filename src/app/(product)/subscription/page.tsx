"use client";

import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import requests from "@/lib/requests";
import checkoutContextSchema from "@/app/api/purchases/initialize-checkout/schema";

export default function SubscriptionPage() {
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
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Subscribe to All Access</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get unlimited access to all tools with your subscription
          </p>
          <Button size="lg" onClick={onClickCheckout}>
            Subscribe Now
          </Button>
        </div>
      </div>
    </section>
  );
}
