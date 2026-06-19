"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

interface SignUpFormProps {
  redirectUrl?: string;
}

export function SignUpForm({ redirectUrl }: SignUpFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const destination = redirectUrl || "/onboarding";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signUp.email(
      { name, email, password },
    );
    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Registrierung fehlgeschlagen");
    } else {
      router.push(destination);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: destination,
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Passwort erstellen"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && (
          <p className="text-sm text-lingo-red font-medium">{error}</p>
        )}
        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Account erstellen
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-lingo-border" />
        <span className="text-sm text-lingo-text-light uppercase tracking-wide">oder</span>
        <div className="h-px flex-1 bg-lingo-border" />
      </div>

      <Button
        variant="outline"
        loading={googleLoading}
        onClick={handleGoogleSignIn}
        className="w-full"
      >
        <Image src="/google.svg" alt="" width={20} height={20} className="inline-block mr-2" />
        Mit Google registrieren
      </Button>

      <p className="text-center text-sm text-lingo-text-light">
        Bereits einen Account?{" "}
        <Link
          href={redirectUrl ? `/sign-in?redirect=${encodeURIComponent(redirectUrl)}` : "/sign-in"}
          className="font-bold text-lingo-blue hover:underline"
        >
          Anmelden
        </Link>
      </p>
    </div>
  );
}
