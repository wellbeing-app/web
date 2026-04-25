'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function WaitlistForm() {
  const dict = useDictionary();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError(dict.contact.emailError);
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <div className="relative space-y-8 flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{dict.contact.title}</h2>
        <p className="text-lg text-muted-foreground">{dict.contact.description}</p>
      </div>

      <div className="w-full max-w-md">
        {!submitted ? (
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder={dict.contact.emailPlaceholder}
                  aria-label={dict.contact.emailLabel}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'email-error' : undefined}
                  className={`w-full px-6 py-3.5 min-h-11 rounded-full bg-secondary/20 border border-border outline-hidden focus:ring-2 focus:ring-primary/20 transition-all ${error ? 'border-red-500' : ''}`}
                />
              </div>
              {error && (
                <p id="email-error" className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex items-start gap-3 mt-1 px-6">
              <div className="flex items-center h-5 mt-0.5">
                <Checkbox
                  id="gdpr-consent"
                  required
                />
              </div>
              <label htmlFor="gdpr-consent" className="text-xs text-muted-foreground text-left leading-relaxed cursor-pointer select-none">
                {dict.contact.privacyText}{' '}
                <Link href="/privacy" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                  {dict.contact.privacyLink}
                </Link>
              </label>
            </div>
            
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-3.5 min-h-11 rounded-full font-medium transition-all hover:bg-primary/90 mt-2"
            >
              {dict.contact.submitBtn}
            </button>
          </form>
        ) : (
          <div className="w-full p-6 bg-secondary/20 border border-border rounded-3xl text-center animate-fade-in">
            <p className="text-foreground font-medium">{dict.contact.successMessage}</p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col items-center">
          <a 
            href="mailto:placeholder@wellbeing-app.org"
            className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">placeholder@wellbeing-app.org</span>
          </a>
        </div>
      </div>
    </div>
  );
}
