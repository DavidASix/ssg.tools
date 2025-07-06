"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ClipboardCopyIcon,
  Eye,
  EyeOff,
  Info,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import createApiKeySchema from "@/app/api/security/create-api-key/schema";
import getLatestActiveKeySchema from "@/app/api/security/get-latest-active-key/schema";
import requests from "@/lib/requests";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
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

interface RegenerateKeyDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  isLoading?: boolean;
}

function RegenerateKeyDialog({
  children,
  onConfirm,
  isLoading = false,
}: RegenerateKeyDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
          <AlertDialogDescription>
            This action will invalidate your current API key and generate a new
            one. All existing implementations using the old key will immediately
            stop working.
            <br />
            <br />
            You should only do this if your current API key has been compromised
            or you suspect it has been exposed.
            <br />
            <br />
            Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes, Regenerate Key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CreateNewApiKeyProps {
  showDetails?: boolean;
  className?: string;
}

export default function CreateNewApiKey({
  showDetails = true,
  className = "",
}: CreateNewApiKeyProps) {
  const [showApiKey, setShowApiKey] = useState(false);

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
    if (currentApiKey) {
      navigator.clipboard.writeText(currentApiKey);
      toast.success("API key copied to clipboard");
    }
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const hasApiKey = !apiKeyQuery.isLoading && currentApiKey;

  return (
    <div className={className}>
      {showDetails && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Your API Key
          </h3>
          <p className="text-base text-gray-600">
            This key allows your website to securely fetch reviews from our
            service.
          </p>
        </div>
      )}

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
              {currentApiKey
                ? showApiKey
                  ? currentApiKey
                  : `${currentApiKey.slice(0, 12)}${"•".repeat(20)}`
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
              <ClipboardCopyIcon className="w-4 h-4" />
              <span>Copy</span>
            </Button>
            <RegenerateKeyDialog
              onConfirm={generateApiKey}
              isLoading={generateKeyMutation.isPending}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={generateKeyMutation.isPending}
                className="flex items-center space-x-1"
              >
                {generateKeyMutation.isPending ? (
                  <>
                    <LoadingSpinner size={16} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </>
                )}
              </Button>
            </RegenerateKeyDialog>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-600">
            You need to create an API key to access your reviews
          </p>
          <Button
            onClick={generateApiKey}
            disabled={generateKeyMutation.isPending}
            size="lg"
          >
            {generateKeyMutation.isPending ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                Generating API Key...
              </>
            ) : (
              "Create API Key"
            )}
          </Button>
        </div>
      )}

      {/* Warning message - always shown */}
      <div className="mt-6 flex items-start text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
        <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
        <p>
          Generating a new key will invalidate any existing keys. Only use this
          if your current key has been compromised.
        </p>
      </div>
    </div>
  );
}
