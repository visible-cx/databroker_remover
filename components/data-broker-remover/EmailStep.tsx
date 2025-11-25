'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendVerificationCode } from '@/actions/data-broker-remover/send-code';

interface EmailStepProps {
  onNext: (email: string) => void;
  setError: (error: string) => void;
}

export function EmailStep({ onNext, setError }: EmailStepProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendVerificationCode(email);

      if (result.success) {
        onNext(email);
      } else {
        setError(result.error || 'Failed to send verification code');
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
          Enter Your Email
        </h3>
        <p className="text-sm text-warmgray/70 mb-4">
          We&apos;ll send you a verification code to confirm your email address.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-warmgray">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isLoading}
          className="bg-plum-800 border-plum-600 text-warmgray placeholder:text-warmgray/40"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-plum-600 hover:bg-plum-500 text-white"
      >
        {isLoading ? 'Sending Code...' : 'Send Verification Code'}
      </Button>
    </form>
  );
}
