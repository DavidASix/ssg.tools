"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClipboardCopyIcon, Info } from "lucide-react";
import { toast } from "sonner";

import createApiKeySchema from "@/app/api/security/create-api-key/schema";
import getLatestActiveKeySchema from "@/app/api/security/get-latest-active-key/schema";
import requests from "@/lib/requests";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateNewApiKey() {
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

  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      await requests.get(createApiKeySchema);
    },
    onSuccess: () => {
      toast.success("API key generated successfully");
      apiKeyQuery.refetch();
    },
    onError: (error) => {
      console.log("Error generating API key:", error);
      toast.error("Error generating API key");
    },
  });

  const currentApiKey = apiKeyQuery.data;

  const generateApiKey = () => {
    generateKeyMutation.mutate();
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(currentApiKey ?? "");
    toast.success("API key copied to clipboard");
  };

  const apiKeyText = apiKeyQuery.isLoading
    ? "Fetching..."
    : currentApiKey
      ? `${currentApiKey.slice(0, 8)}************************`
      : "Generate a key below";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Key</CardTitle>
        <CardDescription>
          This key allows your website to securely fetch reviews from our
          service.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-muted p-3 rounded-md font-mono text-sm overflow-hidden">
            {apiKeyQuery.isLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <span>{apiKeyText}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyApiKey}
            disabled={apiKeyQuery.isLoading || !currentApiKey}
            title="Copy API key"
          >
            <ClipboardCopyIcon className="w-4 h-4" />
          </Button>
        </div>

        <Button
          className="w-full"
          disabled={generateKeyMutation.isPending || apiKeyQuery.isLoading}
          onClick={generateApiKey}
        >
          {generateKeyMutation.isPending ? (
            <div className="flex items-center">
              <LoadingSpinner size={16} className="mr-2" />
              <span>Generating new key...</span>
            </div>
          ) : (
            "Generate New API Key"
          )}
        </Button>
      </CardContent>
      <CardFooter>
        <div className="flex items-start text-sm text-muted-foreground bg-muted/50 p-3 rounded-md w-full">
          <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>
            Generating a new key will invalidate any existing keys. Only use
            this if your current key has been compromised.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
