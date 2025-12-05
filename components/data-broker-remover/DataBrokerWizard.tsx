"use client";

import { useState } from "react";
import { EmailStep } from "./EmailStep";
import { VerifyStep } from "./VerifyStep";
import { DetailsStep } from "./DetailsStep";
import { ReviewStep } from "./ReviewStep";
import { WizardStep, UserDetails } from "@/lib/data-broker-remover/types";
import { Card } from "@/components/ui/card";

interface DataBrokerWizardProps {
  onStepChange?: (step: WizardStep) => void;
}

export function DataBrokerWizard({ onStepChange }: DataBrokerWizardProps) {
  const [step, setStep] = useState<WizardStep>("email");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState("");

  const handleEmailSubmit = (emailValue: string) => {
    setEmail(emailValue);
    const newStep: WizardStep = "verify";
    setStep(newStep);
    onStepChange?.(newStep);
    setError("");
  };

  const handleVerifySuccess = () => {
    const newStep: WizardStep = "details";
    setStep(newStep);
    onStepChange?.(newStep);
    setError("");
  };

  const handleDetailsSubmit = (detailsValue: UserDetails) => {
    setDetails(detailsValue);
    const newStep: WizardStep = "review";
    setStep(newStep);
    onStepChange?.(newStep);
    setError("");
  };

  const handleBack = () => {
    let newStep: WizardStep = step;
    if (step === "verify") newStep = "email";
    if (step === "details") newStep = "verify";
    if (step === "review") newStep = "details";
    setStep(newStep);
    onStepChange?.(newStep);
    setError("");
  };

  return (
    <section className="w-full max-w-2xl mx-auto">
      <Card className="bg-plum-900 border-plum-700 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-md">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {step === "email" && (
          <EmailStep onNext={handleEmailSubmit} setError={setError} />
        )}

        {step === "verify" && (
          <VerifyStep
            email={email}
            onNext={handleVerifySuccess}
            onBack={handleBack}
            setError={setError}
          />
        )}

        {step === "details" && (
          <DetailsStep
            email={email}
            onNext={handleDetailsSubmit}
            onBack={handleBack}
            setError={setError}
          />
        )}

        {step === "review" && details && (
          <ReviewStep
            email={email}
            details={details}
            onBack={handleBack}
            setError={setError}
          />
        )}
      </Card>
    </section>
  );
}
