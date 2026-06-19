"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lingo-green/10">
          <svg
            className="h-6 w-6 text-lingo-green"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-lingo-text">E-Mail prüfen</h3>
        <p className="text-sm text-lingo-text-light">
          Falls ein Account mit <strong>{email}</strong> existiert, erhältst du
          in Kürze einen Link zum Zurücksetzen des Passworts.
        </p>
        <Link
          href="/sign-in"
          className="inline-block text-sm font-bold text-lingo-blue hover:underline"
        >
          Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-lingo-text-light">
        Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum
        Zurücksetzen deines Passworts.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-Mail"
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && (
          <p className="text-sm text-lingo-red font-medium">{error}</p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Link senden
        </Button>
      </form>
      <p className="text-center text-sm text-lingo-text-light">
        Passwort gemerkt?{" "}
        <Link
          href="/sign-in"
          className="font-bold text-lingo-blue hover:underline"
        >
          Anmelden
        </Link>
      </p>
    </div>
  );
}
