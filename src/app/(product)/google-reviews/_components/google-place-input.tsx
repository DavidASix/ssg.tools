"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

import { cn } from "@/lib/utils";

import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface GMPSelectEvent extends Event {
  placePrediction: google.maps.places.PlacePrediction;
}

interface GooglePlaceInputProps {
  onPlaceSelect?: (
    placeId: string,
    place: google.maps.places.PlaceResult,
  ) => void;
  placeholder?: string;
  className?: string;
}

export default function GooglePlaceInput({
  onPlaceSelect,
  placeholder = "Search for a place...",
  className,
}: GooglePlaceInputProps) {
  const autocompleteRef = useRef<HTMLElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  useEffect(() => {
    const autocompleteElement = autocompleteRef.current;
    if (!autocompleteElement) return;

    const handlePlaceSelect = async (event: GMPSelectEvent) => {
      const { placePrediction } = event;

      // Convert placePrediction to Place and fetch details
      const place = placePrediction.toPlace();
      await place.fetchFields({
        fields: ["id", "displayName", "formattedAddress", "location"],
      });

      // Extract place data using proper Place API methods
      const placeId = place.id;
      const displayName = place.displayName;
      const formattedAddress = place.formattedAddress;
      const location = place.location;

      if (placeId) {
        setSelectedPlaceId(placeId);

        // Create a proper PlaceResult for compatibility
        const legacyPlaceResult: google.maps.places.PlaceResult = {
          place_id: placeId,
          name: displayName || undefined,
          formatted_address: formattedAddress || undefined,
          geometry: location
            ? {
                location: location,
              }
            : undefined,
        };

        // Call the onPlaceSelect callback if provided
        onPlaceSelect?.(placeId, legacyPlaceResult);
      }
    };

    const selectEventHandler = (event: Event) => {
      handlePlaceSelect(event as GMPSelectEvent);
    };

    const inputEventHandler = () => {
      // If a place is currently selected and user starts typing, clear the selection
      if (selectedPlaceId) {
        setSelectedPlaceId(null);
        onPlaceSelect?.("", {
          place_id: "",
          name: undefined,
          formatted_address: undefined,
          geometry: undefined,
        });
      }
    };

    autocompleteElement.addEventListener("gmp-select", selectEventHandler);
    autocompleteElement.addEventListener("input", inputEventHandler);

    return () => {
      autocompleteElement.removeEventListener("gmp-select", selectEventHandler);
      autocompleteElement.removeEventListener("input", inputEventHandler);
    };
  }, [onPlaceSelect, selectedPlaceId]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`}
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />
      {React.createElement("gmp-place-autocomplete", {
        ref: (node: HTMLElement | null) => {
          autocompleteRef.current = node;
        },
        placeholder: placeholder,
        className: cn("w-full bg-white border rounded-lg", className),
        style: { display: isLoaded ? "block" : "none" },
      })}
      {!isLoaded && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
