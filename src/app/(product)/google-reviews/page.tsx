import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GoogleReviewsHomePage() {
  return (
    <section className="section section-padding">
      <div className="content text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl mb-6">
          Google Reviews
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Manage your Google Business Profile integrations and display reviews
          on your static websites
        </p>
        <Button size="lg" asChild>
          <Link href="/google-reviews/add-business">Add New Business</Link>
        </Button>
      </div>
    </section>
  );
}
