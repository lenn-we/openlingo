"use client";

import { useState, useTransition } from "react";
import { saveMemory } from "@/lib/actions/prompts";

export function MemoryEditor({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startSave(async () => {
      await saveMemory(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="rounded-2xl border-2 border-lingo-border bg-white p-5">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-lg font-black text-lingo-text">Memory</h2>
        {saved && (
          <span className="text-xs font-bold text-lingo-green bg-lingo-green/10 px-2 py-0.5 rounded-full">
            Gespeichert
          </span>
        )}
      </div>
      <p className="text-sm text-lingo-text-light font-bold mb-3">
        Die KI liest dies zu Beginn jeder Unterhaltung. Bearbeite den Text, um
        Fehler zu korrigieren oder Kontext über dich hinzuzufügen.
      </p>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Noch keine Erinnerungen. Die KI fügt hier Notizen hinzu, während du chattest – oder du schreibst selbst."
        className="w-full p-3 text-sm font-mono rounded-xl border-2 border-lingo-border bg-lingo-gray/20 resize-none focus:outline-none focus:border-lingo-blue h-40"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-lingo-blue text-white text-sm font-bold rounded-xl border-b-4 border-lingo-blue/70 active:border-b-0 active:mt-1 transition-all disabled:opacity-50"
        >
          {saving ? "Speichern..." : "Speichern"}
        </button>
        {value && (
          <button
            onClick={() => setValue("")}
            className="px-4 py-2 text-sm font-bold text-lingo-text-light hover:text-lingo-text rounded-xl transition-colors"
          >
            Löschen
          </button>
        )}
      </div>
    </div>
  );
}
