"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { submitFeedback } from "@/lib/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = "idle" | "submitting" | "success" | "error";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!session?.user;

  // Close on escape key
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Close on click outside modal
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay to avoid the opening click triggering this
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  function resetForm() {
    setMessage("");
    setEmail("");
    setFormState("idle");
    setErrorMsg("");
  }

  function handleClose() {
    onClose();
    // Reset after close animation
    setTimeout(resetForm, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) return;

    setFormState("submitting");
    setErrorMsg("");

    const result = await submitFeedback({
      message,
      email: isLoggedIn ? undefined : email,
    });

    if (result.success) {
      setFormState("success");
    } else {
      setFormState("error");
      setErrorMsg(result.error || "Etwas ist schiefgelaufen");
    }
  }

  // Determine if submit should be disabled
  const submitDisabled =
    !message.trim() ||
    (!isLoggedIn && !email.trim());

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-t-2xl md:rounded-2xl bg-white border-2 border-lingo-border p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
      >
        {formState === "success" ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">&#10003;</div>
            <h3 className="text-lg font-bold text-lingo-text mb-2">
              Vielen Dank für dein Feedback!
            </h3>
            <p className="text-sm text-lingo-text-light mb-4">
              Wir melden uns bei dir, falls nötig.
            </p>
            <Button variant="secondary" size="sm" onClick={handleClose}>
              Schließen
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-lingo-text">
                Feedback / Hilfe
              </h2>
              <button
                onClick={handleClose}
                className="text-lingo-text-light hover:text-lingo-text transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Show email field only for unauthenticated users */}
              {!isLoggedIn && (
                <Input
                  label="E-Mail"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}

              {/* Message */}
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-bold text-lingo-text-light uppercase tracking-wide">
                  Nachricht
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Schreib uns, was dich beschäftigt — Feedback, Bugs, Fragen, Feature-Wünsche..."
                  required
                  rows={4}
                  className="w-full rounded-xl border-2 border-lingo-border bg-white px-4 py-3 text-base text-lingo-text placeholder:text-lingo-gray-dark focus:border-lingo-blue focus:outline-none transition-colors resize-y min-h-[120px]"
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-lingo-red font-medium">
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                loading={formState === "submitting"}
                disabled={submitDisabled}
                className="w-full"
              >
                Senden
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Inline text-button that opens the feedback modal.
 * Use this on the landing page (logged-out) and in the top bar (logged-in).
 */
export function FeedbackButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          "rounded-xl bg-lingo-blue px-4 py-1.5 text-sm font-bold text-white border-b-4 border-lingo-blue-dark hover:bg-lingo-blue/90 active:border-b-0 active:mt-1 transition-all duration-100 cursor-pointer"
        }
      >
        Feedback senden / Hilfe anfragen
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
