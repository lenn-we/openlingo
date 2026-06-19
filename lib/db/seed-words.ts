import fs from "fs/promises";
import path from "path";
import { count, eq } from "drizzle-orm";
import { db } from "./index";
import { dictionaryWord } from "./schema";
import { supportedLanguages } from "../languages";

interface RawWord {
  word: string;
  pos?: string;
  cefr_level?: string;
  translation: string;
  example_sentence_native?: string;
  example_sentence_translation?: string;
  gender?: string;
  word_frequency?: number;
  useful_for_flashcard?: boolean;
  aspect?: string;
  reflexive?: boolean;
}

export async function seedWords() {
  for (const [langCode, fileName] of Object.entries(supportedLanguages)) {
    const filePath = path.join(process.cwd(), "words", `${fileName}.json`);
    const [{ n }] = await db
      .select({ n: count() })
      .from(dictionaryWord)
      .where(eq(dictionaryWord.language, langCode));

    if (n > 0) {
      console.log(`  ${langCode}: already seeded (${n} rows)`);
      continue;
    }

    let raw: string;
    try {
      raw = await fs.readFile(filePath, "utf-8");
    } catch {
      console.log(`  Skipping ${langCode} — no file at ${filePath}`);
      continue;
    }

    const allWords: RawWord[] = JSON.parse(raw);
    const words = allWords.filter((w) => w.word && w.translation);
    console.log(`  ${langCode}: ${words.length} words (${allWords.length - words.length} skipped)`);

    // Batch insert in chunks of 500
    const CHUNK = 500;
    for (let i = 0; i < words.length; i += CHUNK) {
      const chunk = words.slice(i, i + CHUNK);
      const rows = chunk.map((w) => ({
        word: w.word,
        language: langCode,
        pos: w.pos ?? null,
        cefrLevel: w.cefr_level ?? null,
        translation: w.translation,
        exampleSentenceNative: w.example_sentence_native ?? null,
        exampleSentenceTranslation: w.example_sentence_translation ?? null,
        gender: w.gender ?? null,
        wordFrequency: w.word_frequency ?? null,
        usefulForFlashcard: w.useful_for_flashcard ?? true,
        aspect: w.aspect ?? null,
        reflexive: w.reflexive ?? false,
      }));

      await db
        .insert(dictionaryWord)
        .values(rows)
        .onConflictDoNothing();
    }
  }
}
