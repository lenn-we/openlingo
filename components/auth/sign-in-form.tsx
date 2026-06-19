"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SignInFormProps {
  redirectUrl?: string;
}

export function SignInForm({ redirectUrl }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const destination = redirectUrl || "/onboarding";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn.email(
      { email, password },
    );
    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Anmeldung fehlgeschlagen");
    } else {
      router.push(destination);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-Mail"
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Passwort"
          type="password"
          placeholder="Dein Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end -mt-2">
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-lingo-blue hover:underline"
          >
            Passwort vergessen?
          </Link>
        </div>
        {error && (
          <p className="text-sm text-lingo-red font-medium">{error}</p>
        )}
        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Anmelden
        </Button>
      </form>

      <p className="text-center text-sm text-lingo-text-light">
        Noch keinen Account?{" "}
        <Link
          href={redirectUrl ? `/sign-up?redirect=${encodeURIComponent(redirectUrl)}` : "/sign-up"}
          className="font-bold text-lingo-blue hover:underline"
        >
          Registrieren
        </Link>
      </p>
    </div>
  );
}
