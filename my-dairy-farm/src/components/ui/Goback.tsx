"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export function GoBack() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.location.pathname !== '/') { // Check if the current path is not the root
      router.back();
    }
    // No action needed if on the root page
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleGoBack}
      className="ml-4 mt-20 hover:bg-gray-100" // Removed absolute positioning, added margin-top and margin-left
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  );
}