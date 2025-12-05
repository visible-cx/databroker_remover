"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserDetails } from "@/lib/data-broker-remover/types";

interface DetailsStepProps {
  email: string;
  onNext: (details: UserDetails) => void;
  onBack: () => void;
  setError: (error: string) => void;
}

export function DetailsStep({ onNext, onBack, setError }: DetailsStepProps) {
  const [details, setDetails] = useState<UserDetails>({
    name: "",
    street: "",
    city: "",
    country: "",
    postcode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields are filled
    if (
      !details.name ||
      !details.street ||
      !details.city ||
      !details.country ||
      !details.postcode
    ) {
      setError("Please fill in all fields");
      return;
    }

    onNext(details);
  };

  const handleChange = (field: keyof UserDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-warmgray mb-2">
          Enter Your Details
        </h3>
        <p className="text-sm text-warmgray/70 mb-4">
          We need your details to generate the removal request emails. Your
          information is only used to create the emails and is not stored.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-warmgray">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            value={details.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            required
            className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street" className="text-warmgray">
            Street Address
          </Label>
          <Input
            id="street"
            type="text"
            value={details.street}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="123 Main Street"
            required
            className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-warmgray">
            City
          </Label>
          <Input
            id="city"
            type="text"
            value={details.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="New York"
            required
            className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-warmgray">
            Country
          </Label>
          <Input
            id="country"
            type="text"
            value={details.country}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="USA"
            required
            className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postcode" className="text-warmgray">
            Postal/Zip Code
          </Label>
          <Input
            id="postcode"
            type="text"
            value={details.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
            placeholder="10001"
            required
            className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          className="flex-1 bg-plum-600 hover:bg-plum-500 text-white"
        >
          Back
        </Button>
        <Button type="submit" variant="secondary" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
}
