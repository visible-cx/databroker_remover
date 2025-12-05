"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserDetails } from "@/lib/data-broker-remover/types";
import { sendEmails } from "@/actions/data-broker-remover/send-emails";
import { CheckCircle2 } from "lucide-react";

interface ReviewStepProps {
  email: string;
  details: UserDetails;
  onBack: () => void;
  setError: (error: string) => void;
}

export function ReviewStep({
  email,
  details,
  onBack,
  setError,
}: ReviewStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await sendEmails(email, details);

      if (result.success) {
        setIsComplete(true);
      } else {
        setError(result.error || "Failed to send emails");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="space-y-4 text-center py-8">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-warmgray mb-2">
            Emails Sent Successfully!
          </h3>
          <p className="text-warmgray/70">
            We&apos;ve sent removal requests to all data brokers. You&apos;ll be
            CC&apos;d on all emails so you can track responses.
          </p>
          <p className="text-warmgray/70 mt-4 text-sm">
            Data brokers typically respond within 30-45 days. You may receive
            confirmation emails from them directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-warmgray mb-2">
          Review & Send
        </h3>
        <p className="text-sm text-warmgray/70 mb-4">
          Please review your information before sending the removal requests.
        </p>
      </div>

      <div className="bg-plum-800 rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm text-warmgray/60">Email</p>
          <p className="text-warmgray font-medium">{email}</p>
        </div>
        <div>
          <p className="text-sm text-warmgray/60">Name</p>
          <p className="text-warmgray font-medium">{details.name}</p>
        </div>
        <div>
          <p className="text-sm text-warmgray/60">Address</p>
          <p className="text-warmgray font-medium">
            {details.street}
            <br />
            {details.city}, {details.postcode}
            <br />
            {details.country}
          </p>
        </div>
      </div>

      <div className="bg-plum-800/50 border border-plum-600 rounded-lg p-4">
        <p className="text-sm text-warmgray/80">
          By clicking &quot;Send Requests&quot;, emails will be sent to all data
          brokers requesting removal of your information. You will be CC&apos;d
          on all emails.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 bg-plum-600 hover:bg-plum-500 text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          variant="secondary"
          className="flex-1"
        >
          {isLoading ? "Sending..." : "Send Requests"}
        </Button>
      </div>
    </div>
  );
}
