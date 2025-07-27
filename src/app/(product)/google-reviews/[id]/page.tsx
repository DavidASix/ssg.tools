"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import getBusinessDetailsSchema from "@/app/api/google/get-business-details/schema";
import requests from "@/lib/requests";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import { ReviewCard } from "../add-business/_components/review-card";

export default function BusinessDetailsPage() {
  const params = useParams();
  const businessId = params.id as string;

  const businessQuery = useQuery({
    queryKey: ["businessDetails", businessId],
    queryFn: async () => {
      return requests.post(getBusinessDetailsSchema, { businessId });
    },
    enabled: !!businessId,
    meta: {
      errorMessage: "Failed to fetch business details",
    },
  });

  if (businessQuery.isLoading) {
    return (
      <section className="section section-padding">
        <div className="content">
          <div className="flex justify-center py-12">
            <LoadingSpinner size={48} />
          </div>
        </div>
      </section>
    );
  }

  if (businessQuery.error || !businessQuery.data?.business) {
    return (
      <section className="section section-padding">
        <div className="content text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Business Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The business you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Button asChild>
            <Link href="/google-reviews">Back to Businesses</Link>
          </Button>
        </div>
      </section>
    );
  }

  const { business, reviews } = businessQuery.data;

  return (
    <>
      {/* Header Section */}
      <section className="section section-padding bg-gradient-to-b from-blue-50 to-white">
        <div className="content">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" asChild>
              <Link href="/google-reviews">← Back</Link>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl mb-4">
              {business.name || "Unnamed Business"}
            </h1>
            {business.address && (
              <p className="text-xl text-gray-600 mb-6">{business.address}</p>
            )}

            {/* Business Stats */}
            {business.stats && (
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {business.stats.review_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {business.stats.review_score
                      ? business.stats.review_score.toFixed(1)
                      : "—"}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section section-padding">
        <div className="content">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Reviews ({reviews.length})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No reviews have been fetched for this business yet.
                  </p>
                  <p className="text-sm text-gray-400">
                    Reviews are automatically updated when you add a business.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    author={review.author_name || "Anonymous"}
                    rating={review.rating || 0}
                    text={review.comments || "No comment"}
                    date={review.datetime ? new Date(review.datetime) : null}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="section section-padding bg-gray-50">
        <div className="content">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Integration Details
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Business ID
                  </h3>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {business.id}
                  </code>
                </div>
                {business.place_id && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Google Place ID
                    </h3>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
                      {business.place_id}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
