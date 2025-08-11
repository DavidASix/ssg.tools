import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { applications } from "@/components/structure/header/quick-links";

// Helper functions for tool metadata
function getToolDescription(toolId: string): string {
  const descriptions: Record<string, string> = {
    businesses:
      "Integrate Google Reviews seamlessly into your static site without client-side API calls.",
    "blog-generator":
      "Generate SEO-optimized blog content with AI to keep your site fresh and engaging.",
  };

  return (
    descriptions[toolId] || "Enhance your static site with powerful features."
  );
}

function getToolFeatures(toolId: string): string[] {
  const features: Record<string, string[]> = {
    businesses: [
      "Display real customer reviews",
      "Star ratings and review text",
      "Fully static generation - no API calls",
      "Customizable styling options",
    ],
    "blog-generator": [
      "AI-powered content creation",
      "SEO optimization built-in",
      "Various topic suggestions",
      "Export in Markdown or HTML",
    ],
  };

  return features[toolId] || ["Feature coming soon"];
}

export default function AvailableTools() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Available Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each tool is designed to solve specific challenges for static site
          developers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications
          .filter((app) => app.id !== "dashboard")
          .map((tool) => (
            <Card key={tool.id} className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="mb-2">
                  <tool.icon className="w-6 h-6" />
                </div>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{getToolDescription(tool.id)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {getToolFeatures(tool.id).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full mt-auto">
                  <Link href={tool.url}>
                    <span>Explore {tool.name}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
