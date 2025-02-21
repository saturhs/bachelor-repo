"use client";

import { Button } from "@/components/ui/Button";

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={() => alert("Button Clicked!")}>Test Button</Button>
    </div>
  );
} 