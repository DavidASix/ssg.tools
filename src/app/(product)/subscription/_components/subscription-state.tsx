"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type SubscriptionStateProps = {
  dataIsLoading: boolean;
  cancelIsLoading: boolean;
  hasActiveSubscription: boolean;
  endDate?: Date;
  onClickCheckout: () => void;
  onClickCancel: () => void;
};

const calculateDaysRemaining = (subscriptionEnd: Date) => {
  const now = new Date();
  const diffTime = subscriptionEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export function SubscriptionState({
  dataIsLoading,
  cancelIsLoading,
  hasActiveSubscription,
  endDate,
  onClickCheckout,
  onClickCancel,
}: SubscriptionStateProps) {
  if (dataIsLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasActiveSubscription ? (
        <>
          <p className="text-lg font-semibold text-green-600">
            ✅ You have an active subscription
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={cancelIsLoading}>
                {cancelIsLoading ? (
                  <>
                    Cancelling...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your subscription will be cancelled as of{" "}
                  {endDate?.toISOString().slice(0, 10)}
                  . You will not be charged again, but your review integrations
                  will no longer work after that day.
                  <br />
                  You may re-subscribe at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClickCancel}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, cancel subscription
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-red-600">
            ❌ You do not have an active subscription
          </p>
          <Button size="lg" onClick={onClickCheckout}>
            Subscribe Now
          </Button>
        </>
      )}

      {endDate && (
        <p className="text-sm text-muted-foreground">
          Days remaining: {calculateDaysRemaining(endDate)} days
        </p>
      )}
    </div>
  );
}
