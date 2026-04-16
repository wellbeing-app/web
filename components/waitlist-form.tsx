"use client";

import React, { useState } from "react";
import { useDictionary } from "@/components/providers/dictionary-provider";

export function WaitlistForm() {
  const dict = useDictionary();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError(dict.contact.emailError);
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <section id="contact" className="space-y-8 flex flex-col items-center w-full max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {dict.contact.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {dict.contact.description}
        </p>
      </div>

      {!submitted ? (
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              {dict.contact.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder={dict.contact.emailPlaceholder}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "email-error" : undefined}
              className={`w-full px-6 py-3 rounded-full bg-secondary/20 border border-border outline-hidden focus:ring-2 focus:ring-primary/20 transition-all ${error ? "border-red-500" : ""}`}
            />
            {error && (
              <p id="email-error" className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium transition-all hover:bg-primary/90">
            {dict.contact.submitBtn}
          </button>
        </form>
      ) : (
        <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            {dict.contact.successMessage}
          </p>
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        {dict.contact.privacyText}{" "}
        <a
          href="/privacy"
          className="text-primary hover:underline"
        >
          {dict.contact.privacyLink}
        </a>
      </p>
    </section>
  );
}
