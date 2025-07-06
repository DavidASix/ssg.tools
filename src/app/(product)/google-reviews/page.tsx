"use client";
import { useState } from "react";

import CreateNewApiKey from "@/components/common/api-keys/create-new-api-key";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

import GooglePlaceInput from "./_components/google-place-input";
import { ReviewCard } from "./_components/review-card";
import { ReviewSkeleton } from "./_components/review-skeleton";
import { StepIndicator } from "./_components/step-indicator";
import { WizardStep } from "./_components/wizard-step";
import { FrameworkIntegrationTabs } from "./_components/framework-integration-tabs";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "John Smith",
    rating: 5,
    text: "Excellent service! The team was professional and delivered exactly what we needed. Highly recommend to anyone looking for quality work.",
    date: "2024-01-15",
  },
  {
    id: "2",
    author: "Sarah Johnson",
    rating: 5,
    text: "Outstanding experience from start to finish. Great communication and the results exceeded our expectations.",
    date: "2024-01-10",
  },
  {
    id: "3",
    author: "Mike Davis",
    rating: 4,
    text: "Very satisfied with the service. Professional, timely, and great value for money.",
    date: "2024-01-05",
  },
];

type StepStatus = "completed" | "active" | "inactive";

const STEPS = [
  { num: 1, title: "Select Place", desc: "Choose your Google Business" },
  { num: 2, title: "Fetch Reviews", desc: "Get your latest reviews" },
  { num: 3, title: "Generate API Key", desc: "Create your access token" },
  { num: 4, title: "Display Reviews", desc: "Integrate and show on your site" },
];

export default function GoogleReviewPage() {
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const fetchReviews = async () => {
    if (!placeId) return;

    setIsLoadingReviews(true);

    // Simulate API call with mock data
    setTimeout(() => {
      setReviews(mockReviews);
      setIsLoadingReviews(false);
      setCurrentStep(3);
    }, 2000);
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
            Google Reviews Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Display your Google Reviews directly in your static website without
            client-side API calls
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
                <GooglePlaceInput
                  onPlaceSelect={(selectedPlaceId) => {
                    setPlaceId(selectedPlaceId);
                    setCurrentStep(2);
                  }}
                />
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
                      disabled={isLoadingReviews || reviews.length > 0}
                      className="w-full"
                    >
                      {isLoadingReviews ? (
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

                    {isLoadingReviews && (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <ReviewSkeleton key={i} />
                        ))}
                      </div>
                    )}

                    {reviews.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-sm text-green-800 font-medium">
                          ✓ Found {reviews.length} reviews
                        </p>
                        {reviews.map((review) => (
                          <ReviewCard
                            key={review.id}
                            author={review.author}
                            rating={review.rating}
                            text={review.text}
                            date={review.date}
                          />
                        ))}
                      </div>
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
                <CreateNewApiKey showDetails={false} />
              </WizardStep>

              {/* Step 4: Display Reviews */}
              <WizardStep
                step={4}
                title="Display Your Reviews"
                description="Choose your framework and copy the integration code to display reviews on your site"
                status={getStepStatus(4)}
              >
                <FrameworkIntegrationTabs placeId={placeId} />
              </WizardStep>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
