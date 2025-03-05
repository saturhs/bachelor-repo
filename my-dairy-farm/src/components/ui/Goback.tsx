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
    <div className="h-10 mt-2"> {/* Fixed height container with small top margin */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleGoBack}
        className="ml-4 hover:bg-gray-100"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );
}