'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Mail, ShieldCheck, Heart } from 'lucide-react';
import { Github } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';

function HappyBlob() {
  return (
    <svg viewBox="0 0 40 40" className="w-16 h-16 mx-auto mb-3" aria-hidden="true">
      <defs>
        <radialGradient id="happyMood" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(130, 65%, 55%)" />
        </radialGradient>
      </defs>
      <path
        d="M20,2 C31,2 38,10 38,20 C38,30 31,38 20,38 C9,38 2,30 2,20 C2,10 9,2 20,2 Z"
        fill="url(#happyMood)"
      />
      <g fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 17 Q 14.5 14.5 17 17" />
        <path d="M23 17 Q 25.5 14.5 28 17" />
      </g>
      <path
        d="M 12 26 Q 20 32 28 26"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const TRUST_BADGES = [
  { icon: ShieldCheck, key: 'local' as const },
  { icon: Heart, key: 'free' as const },
  { icon: Github, key: 'oss' as const },
];

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
    <div className="relative space-y-5 flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in">
      <div className="space-y-4 text-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.contact.title}
        </h2>
        <p className="text-lg text-muted-foreground">{dict.contact.description}</p>
      </div>

      {/* Trust badges row — quietly anchors the contact card before the form */}
      <ul role="list" className="flex flex-wrap items-center justify-center gap-2 @sm/card:gap-3">
        {TRUST_BADGES.map(({ icon: Icon, key }) => (
          <li
            key={key}
            className="inline-flex items-center gap-2 rounded-(--radius-pill) border border-border/60 bg-(--warmth-50)/40 px-3 py-1.5 text-xs font-medium text-foreground/80"
          >
            <Icon className="w-3.5 h-3.5 text-(--warmth-700)" />
            <span>{dict.contact.trust[key]}</span>
          </li>
        ))}
      </ul>

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
                  className={`w-full px-6 py-3.5 min-h-11 rounded-(--radius-pill) bg-secondary/20 border outline-hidden focus:ring-2 focus:ring-(--warmth-300)/40 transition-all duration-(--duration-soft) shadow-(--shadow-pill) ${
                    error ? 'border-(--warmth-700)/70' : 'border-border'
                  }`}
                />
              </div>
              {error && (
                <p id="email-error" className="text-sm text-(--warmth-700)" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex items-start gap-3 mt-1 px-6">
              <div className="flex items-center h-5 mt-0.5">
                <Checkbox id="gdpr-consent" required />
              </div>
              <label
                htmlFor="gdpr-consent"
                className="text-xs text-muted-foreground text-left leading-relaxed cursor-pointer select-none"
              >
                {dict.contact.privacyText}{' '}
                <Link
                  href="/privacy"
                  className="text-(--warmth-700) underline decoration-(--warmth-300) underline-offset-4 hover:decoration-(--warmth-700)"
                  onClick={(e) => e.stopPropagation()}
                >
                  {dict.contact.privacyLink}
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-3.5 min-h-11 rounded-(--radius-pill) font-medium transition-all duration-(--duration-soft) ease-(--ease-out-soft) hover:-translate-y-0.5 hover:shadow-(--shadow-mood-glow) hover:bg-primary/90 mt-2"
            >
              {dict.contact.submitBtn}
            </button>
          </form>
        ) : (
          <div className="w-full p-6 bg-(--warmth-50)/50 border border-(--warmth-300)/40 rounded-(--radius-card) text-center animate-fade-in">
            <HappyBlob />
            <p className="text-foreground font-medium">{dict.contact.successMessage}</p>
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-border/50 flex flex-col items-center">
          <a
            href="mailto:placeholder@lumi-app.org"
            className="group flex items-center gap-3 text-muted-foreground hover:text-(--warmth-700) transition-colors duration-(--duration-soft)"
          >
            <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">placeholder@lumi-app.org</span>
          </a>
        </div>
      </div>
    </div>
  );
}
