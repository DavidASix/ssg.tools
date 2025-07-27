"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import insertNewBusinessSchema from "@/app/api/google/insert-new-business/schema";
import getLatestActiveKeySchema from "@/app/api/security/get-latest-active-key/schema";
import requests from "@/lib/requests";

import CreateNewApiKey from "@/components/common/api-keys/create-new-api-key";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

import GooglePlaceInput from "./_components/google-place-input";
import { ReviewCard } from "./_components/review-card";
import { ReviewSkeleton } from "./_components/review-skeleton";
import { StepIndicator } from "./_components/step-indicator";
import { WizardStep } from "./_components/wizard-step";

interface Review {
  author_name: string | null;
  author_image: string | null;
  datetime: Date | null;
  link: string | null;
  rating: number | null;
  comments: string | null;
}

interface BusinessStats {
  review_count: number | null;
  review_score: number | null;
}

type StepStatus = "completed" | "active" | "inactive";

const STEPS = [
  { num: 1, title: "Select Place", desc: "Choose your Google Business" },
  { num: 2, title: "Fetch Reviews", desc: "Get your latest reviews" },
  { num: 3, title: "Generate API Key", desc: "Create your access token" },
];

export default function AddBusinessPage() {
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [placeAddress, setPlaceAddress] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(1);

  const apiKeyQuery = useQuery({
    queryKey: ["apiKey"],
    queryFn: async () => {
      const { apiKey } = await requests.get(getLatestActiveKeySchema);
      return apiKey;
    },
    meta: {
      errorMessage: "Failed to fetch API key",
    },
  });

  const fetchReviewsMutation = useMutation({
    mutationFn: async (data: {
      place_id: string;
      name?: string;
      formatted_address?: string;
    }) => {
      return requests.post(insertNewBusinessSchema, data);
    },
    onSuccess: (data) => {
      setReviews(data.reviews);
      setBusinessStats(data.stats);
      setCurrentStep(apiKeyQuery.data ? 4 : 3);
    },
    meta: {
      errorMessage: "Failed to fetch reviews",
    },
  });

  const onPlaceSelect = (
    selectedPlaceId: string,
    placeData: { name?: string; formatted_address?: string },
  ) => {
    setPlaceId(selectedPlaceId);
    setPlaceName(placeData.name ?? null);
    setPlaceAddress(placeData.formatted_address ?? null);
    setCurrentStep(2);
  };

  const fetchReviews = () => {
    if (!placeId) return;

    fetchReviewsMutation.mutate({
      place_id: placeId,
      name: placeName || undefined,
      formatted_address: placeAddress || undefined,
    });
  };

  const getStepStatus = (step: number): StepStatus => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "inactive";
  };

  return (
    <>
      {/* Header Section */}
      <section className="section section-padding bg-gradient-to-b from-blue-50 to-white">
        <div className="content text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
            Add New Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Connect your Google Business Profile to display reviews on your
            static website
          </p>
        </div>
      </section>

      {/* Wizard Steps */}
      <section className="section section-padding bg-white">
        <div className="content">
          <div className="max-w-4xl mx-auto">
            {/* Step Progress Indicator */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {STEPS.map((step) => (
                <StepIndicator
                  key={step.num}
                  step={step.num}
                  title={step.title}
                  description={step.desc}
                  status={getStepStatus(step.num)}
                  size="lg"
                  layout="vertical"
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-8">
              {/* Step 1: Select Place */}
              <WizardStep
                step={1}
                title="Select Your Google Place"
                description="Find and select your Google Business Profile from the search results"
                status={getStepStatus(1)}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your business name as it appears on Google Maps
                  </label>
                </div>
                <GooglePlaceInput onPlaceSelect={onPlaceSelect} />
                {placeId && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      ✓ Selected Place ID: <strong>{placeId}</strong>
                    </p>
                  </div>
                )}
              </WizardStep>

              {/* Step 2: Fetch Reviews */}
              <WizardStep
                step={2}
                title="Fetch Your Reviews"
                description="Preview your Google Reviews that will be available via the API"
                status={getStepStatus(2)}
              >
                {!placeId ? (
                  <p className="text-gray-500 text-center py-8">
                    Please select a Google Place first to fetch reviews
                  </p>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={fetchReviews}
                      disabled={
                        fetchReviewsMutation.isPending || reviews.length > 0
                      }
                      className="w-full"
                    >
                      {fetchReviewsMutation.isPending ? (
                        <>
                          <LoadingSpinner size={16} className="mr-2" />
                          Fetching Reviews...
                        </>
                      ) : reviews.length > 0 ? (
                        "✓ Reviews Fetched"
                      ) : (
                        "Fetch Reviews"
                      )}
                    </Button>

                    {fetchReviewsMutation.isPending &&
                      [1, 2, 3].map((i) => <ReviewSkeleton key={i} />)}

                    {reviews.length > 0 && (
                      <>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          {businessStats && (
                            <div className="mt-2 text-sm text-green-700">
                              <p>Total Reviews: {businessStats.review_count}</p>
                              <p>
                                Average Rating: {businessStats.review_score}/5
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {Math.min(reviews.length, 5)} recent reviews:
                        </p>
                        {reviews.slice(0, 5).map((review, index) => (
                          <ReviewCard
                            key={index}
                            author={review.author_name || "Anonymous"}
                            rating={review.rating || 0}
                            text={review.comments || "No comment"}
                            date={review.datetime}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </WizardStep>

              {/* Step 3: Generate API Key */}
              <WizardStep
                step={3}
                title="Generate Your API Key"
                description="Create a secure API key to access your reviews programmatically"
                status={getStepStatus(3)}
              >
                <CreateNewApiKey
                  showDetails={false}
                  onKeyGenerated={() => setCurrentStep(4)}
                />
              </WizardStep>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
