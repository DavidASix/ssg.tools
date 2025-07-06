"use client";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ClipboardCopy,
  Eye,
  EyeOff,
  RefreshCw,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import getLatestActiveKeySchema from "@/app/api/security/get-latest-active-key/schema";
import requests from "@/lib/requests";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import GooglePlaceInput from "./_components/google-place-input";

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

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
      const mockReviews: Review[] = [
        {
          id: "1",
          author: "John Smith",
          rating: 5,
          text: "Excellent service! The team was professional and delivered exactly what we needed. Highly recommend to anyone looking for quality work.",
          date: "2024-01-15"
        },
        {
          id: "2",
          author: "Sarah Johnson",
          rating: 5,
          text: "Outstanding experience from start to finish. Great communication and the results exceeded our expectations.",
          date: "2024-01-10"
        },
        {
          id: "3",
          author: "Mike Davis",
          rating: 4,
          text: "Very satisfied with the service. Professional, timely, and great value for money.",
          date: "2024-01-05"
        }
      ];
      
      setReviews(mockReviews);
      setIsLoadingReviews(false);
      setCurrentStep(3);
    }, 2000);
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "inactive";
  };

  const copyCodeSnippet = () => {
    const codeSnippet = `// Fetch your Google Reviews at build time
const response = await fetch('https://api.ssg.tools/reviews/${placeId}', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const reviews = await response.json();

// Use reviews in your static site generation
console.log(reviews);`;
    
    navigator.clipboard.writeText(codeSnippet);
    toast.success("Code snippet copied to clipboard");
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
              {[
                { num: 1, title: "Select Place", desc: "Choose your Google Business" },
                { num: 2, title: "Fetch Reviews", desc: "Get your latest reviews" },
                { num: 3, title: "Generate API Key", desc: "Create your access token" },
                { num: 4, title: "Integrate", desc: "Add to your build process" }
              ].map((step, index) => {
                const status = getStepStatus(step.num);
                return (
                  <div key={step.num} className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transition-all ${
                      status === "completed" ? "bg-green-500 text-white" :
                      status === "active" ? "bg-primary text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {status === "completed" ? <CheckCircle className="w-8 h-8" /> : step.num}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      status === "inactive" ? "text-gray-400" : "text-gray-900"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      status === "inactive" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="space-y-8">
              {/* Step 1: Select Place */}
              <Card className={`${getStepStatus(1) === "inactive" ? "opacity-50" : ""}`}>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      getStepStatus(1) === "completed" ? "bg-green-500 text-white" :
                      getStepStatus(1) === "active" ? "bg-primary text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {getStepStatus(1) === "completed" ? <CheckCircle className="w-6 h-6" /> : "1"}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Select Your Google Place</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Find and select your Google Business Profile from the search results
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
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
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Fetch Reviews */}
              <Card className={`${getStepStatus(2) === "inactive" ? "opacity-50" : ""}`}>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      getStepStatus(2) === "completed" ? "bg-green-500 text-white" :
                      getStepStatus(2) === "active" ? "bg-primary text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {getStepStatus(2) === "completed" ? <CheckCircle className="w-6 h-6" /> : "2"}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Fetch Your Reviews</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Preview your Google Reviews that will be available via the API
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
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
                              <div key={i} className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-3/4" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {reviews.length > 0 && (
                          <div className="space-y-4">
                            <p className="text-sm text-green-800 font-medium">
                              ✓ Found {reviews.length} reviews
                            </p>
                            {reviews.map((review) => (
                              <div key={review.id} className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {review.author.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm">{review.author}</span>
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{review.text}</p>
                                  <p className="text-xs text-gray-400">{review.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Generate API Key */}
              <Card className={`${getStepStatus(3) === "inactive" ? "opacity-50" : ""}`}>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      getStepStatus(3) === "completed" ? "bg-green-500 text-white" :
                      getStepStatus(3) === "active" ? "bg-primary text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {getStepStatus(3) === "completed" ? <CheckCircle className="w-6 h-6" /> : "3"}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Generate Your API Key</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Create a secure API key to access your reviews programmatically
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
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
                                : `${apiKeyQuery.data.apiKey.slice(0, 12)}${'•'.repeat(20)}`
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
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Integration */}
              <Card className={`${getStepStatus(4) === "inactive" ? "opacity-50" : ""}`}>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      getStepStatus(4) === "completed" ? "bg-green-500 text-white" :
                      getStepStatus(4) === "active" ? "bg-primary text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {getStepStatus(4) === "completed" ? <CheckCircle className="w-6 h-6" /> : "4"}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Integrate Into Your App</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Use this code snippet to fetch reviews during your build process
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="bg-gray-900 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-gray-400 text-sm ml-4">
                          Integration Code
                        </span>
                      </div>
                      <div className="text-left font-mono text-sm text-gray-100 leading-relaxed">
                        <span className="text-gray-500">
                          {"// Fetch your Google Reviews at build time"}
                        </span>
                        <br />
                        <span className="text-blue-400">const</span>{" "}
                        <span className="text-yellow-300">response</span> ={" "}
                        <span className="text-blue-400">await</span>{" "}
                        <span className="text-blue-400">fetch</span>(<br />
                        &nbsp;&nbsp;
                        <span className="text-green-400">
                          'https://api.ssg.tools/reviews/{placeId || "YOUR_PLACE_ID"}'</span>,<br />
                        &nbsp;&nbsp;{"{"}}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-300">headers</span>: {"{"}}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="text-green-400">'Authorization'</span>:{" "}
                        <span className="text-green-400">'Bearer YOUR_API_KEY'</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{"}"}}<br />
                        &nbsp;&nbsp;{"}"})<br />
                        <br />
                        <span className="text-blue-400">const</span>{" "}
                        <span className="text-yellow-300">reviews</span> ={" "}
                        <span className="text-blue-400">await</span>{" "}
                        <span className="text-yellow-300">response</span>.
                        <span className="text-blue-400">json</span>()<br />
                        <br />
                        <span className="text-gray-500">
                          {"// Use reviews in your static site generation"}
                        </span>
                        <br />
                        <span className="text-yellow-300">console</span>.
                        <span className="text-blue-400">log</span>(
                        <span className="text-yellow-300">reviews</span>)
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={copyCodeSnippet}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        <span>Copy Code Snippet</span>
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Framework Examples:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Gatsby:</strong> Use in gatsby-node.js during createPages</li>
                        <li>• <strong>Next.js:</strong> Use in getStaticProps or generateStaticParams</li>
                        <li>• <strong>11ty:</strong> Use in _data directory or as a global data file</li>
                        <li>• <strong>Hugo:</strong> Use with Hugo's data templates and APIs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
