'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyCode } from '@/actions/data-broker-remover/verify-code';

interface VerifyStepProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
  setError: (error: string) => void;
}

export function VerifyStep({ email, onNext, onBack, setError }: VerifyStepProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || code.length < 6) {
      setError('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyCode(email, code);

      if (result.success) {
        onNext();
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-warmgray mb-2">
          Verify Your Email
        </h3>
        <p className="text-sm text-warmgray/70 mb-4">
          We&apos;ve sent a verification code to <strong>{email}</strong>. Please
          enter it below.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code" className="text-warmgray">
          Verification Code
        </Label>
        <Input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          required
          disabled={isLoading}
          className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
        />
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
          type="submit"
          disabled={isLoading}
          variant="secondary"
          className="flex-1 border-plum-600 text-grey-500"

        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </div>
    </form>
  );
}
