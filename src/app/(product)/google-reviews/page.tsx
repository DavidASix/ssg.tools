"use client";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ClipboardCopy,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import getLatestActiveKeySchema from "@/app/api/security/get-latest-active-key/schema";
import requests from "@/lib/requests";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

import GooglePlaceInput from "./_components/google-place-input";
import { ReviewCard } from "./_components/review-card";
import { ReviewSkeleton } from "./_components/review-skeleton";
import { StepIndicator } from "./_components/step-indicator";
import { WizardStep } from "./_components/wizard-step";

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export const mockReviews: Review[] = [
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

const generateCodeSnippet = (
  placeId: string | null,
  apiKey: string | null,
): string => {
  return `// Fetch your Google Reviews at build time
const response = await fetch('https://api.ssg.tools/reviews/${placeId || "YOUR_PLACE_ID"}', {
  headers: {
    'Authorization': 'Bearer ${apiKey || "YOUR_API_KEY"}',
  }
});

const reviews = await response.json();

// Use reviews in your static site generation
console.log(reviews);`;
};

type StepStatus = "completed" | "active" | "inactive";

const STEPS = [
  { num: 1, title: "Select Place", desc: "Choose your Google Business" },
  { num: 2, title: "Fetch Reviews", desc: "Get your latest reviews" },
  { num: 3, title: "Generate API Key", desc: "Create your access token" },
  { num: 4, title: "Integrate", desc: "Add to your build process" },
];

export default function GoogleReviewPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Query to check if API key exists
  const apiKeyQuery = useQuery({
    queryKey: ["apiKey"],
    queryFn: async () => {
      return await requests.get(getLatestActiveKeySchema);
    },
    meta: {
      errorMessage: "Failed to fetch API key",
    },
  });

  const hasApiKey = !apiKeyQuery.isLoading && apiKeyQuery.data?.apiKey;

  const copyApiKey = () => {
    if (apiKeyQuery.data?.apiKey) {
      navigator.clipboard.writeText(apiKeyQuery.data.apiKey);
      toast.success("API key copied to clipboard");
    }
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

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
                {apiKeyQuery.isLoading ? (
                  <div className="flex items-center space-x-2 justify-center py-8">
                    <LoadingSpinner size={16} />
                    <span>Checking API key status...</span>
                  </div>
                ) : hasApiKey ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-green-800 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>API key is active and ready to use</span>
                    </div>

                    <div className="bg-white border border-green-200 p-4 rounded-lg">
                      <div className="font-mono text-sm break-all">
                        {apiKeyQuery.data?.apiKey
                          ? showApiKey
                            ? apiKeyQuery.data.apiKey
                            : `${apiKeyQuery.data.apiKey.slice(0, 12)}${"•".repeat(20)}`
                          : ""}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleApiKeyVisibility}
                        className="flex items-center space-x-1"
                      >
                        {showApiKey ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Show</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyApiKey}
                        className="flex items-center space-x-1"
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        <span>Copy</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center space-x-1"
                      >
                        <Link href="/dashboard#keys">
                          <RefreshCw className="w-4 h-4" />
                          <span>Regenerate</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-gray-600">
                      You need to create an API key to access your reviews
                    </p>
                    <Button asChild size="lg">
                      <Link href="/dashboard">Create API Key in Dashboard</Link>
                    </Button>
                  </div>
                )}
              </WizardStep>

              {/* Step 4: Integration */}
              <WizardStep
                step={4}
                title="Integrate Into Your App"
                description="Use this code snippet to fetch reviews during your build process"
                status={getStepStatus(4)}
              >
                <div className="space-y-6">
                  <CodeBlock
                    code={generateCodeSnippet(
                      placeId,
                      apiKeyQuery.data?.apiKey ?? null,
                    )}
                    language="javascript"
                    title="Integration Code"
                  />

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Framework Examples:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • <strong>Gatsby:</strong> Use in gatsby-node.js during
                        createPages
                      </li>
                      <li>
                        • <strong>Next.js:</strong> Use in getStaticProps or
                        generateStaticParams
                      </li>
                      <li>
                        • <strong>11ty:</strong> Use in _data directory or as a
                        global data file
                      </li>
                      <li>
                        • <strong>Hugo:</strong> Use with Hugo&apos;s data
                        templates and APIs
                      </li>
                    </ul>
                  </div>
                </div>
              </WizardStep>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
