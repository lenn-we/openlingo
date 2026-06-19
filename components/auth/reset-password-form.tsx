"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (errorParam === "INVALID_TOKEN" || !token) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lingo-red/10">
          <svg
            className="h-6 w-6 text-lingo-red"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-lingo-text">
          {errorParam === "INVALID_TOKEN"
            ? "Link abgelaufen"
            : "Ungültiger Link"}
        </h3>
        <p className="text-sm text-lingo-text-light">
          {errorParam === "INVALID_TOKEN"
            ? "Dieser Link ist abgelaufen. Bitte fordere einen neuen an."
            : "Dieser Link ist ungültig. Bitte fordere einen neuen an."}
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-bold text-lingo-blue hover:underline"
        >
          Neuen Link anfordern
        </Link>
      </div>
    );
  }

  if (success) {
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
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-lingo-text">
          Passwort aktualisiert
        </h3>
        <p className="text-sm text-lingo-text-light">
          Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt mit
          deinem neuen Passwort anmelden.
        </p>
        <Link
          href="/sign-in"
          className="inline-block text-sm font-bold text-lingo-blue hover:underline"
        >
          Anmelden
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-lingo-text-light">
        Gib dein neues Passwort ein.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Neues Passwort"
          type="password"
          placeholder="Neues Passwort eingeben"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Input
          label="Passwort bestätigen"
          type="password"
          placeholder="Neues Passwort bestätigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && (
          <p className="text-sm text-lingo-red font-medium">{error}</p>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Passwort zurücksetzen
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
