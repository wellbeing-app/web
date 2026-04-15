"use client";

import React from "react";
import { Dictionary } from "@/lib/dictionary";

export function WaitlistForm({ dict }: { dict: Dictionary }) {
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

      <form className="flex flex-col gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder={dict.contact.emailPlaceholder}
          className="w-full px-6 py-3 rounded-full bg-secondary/20 border border-border outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium transition-all hover:bg-primary/90">
          {dict.contact.submitBtn}
        </button>
      </form>
    </section>
  );
}
