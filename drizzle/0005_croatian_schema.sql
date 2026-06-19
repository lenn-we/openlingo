-- Phase 1: Kroatisch-Schema
-- 1) Rename columns (english → language-neutral)
ALTER TABLE "dictionary_word" RENAME COLUMN "english_translation" TO "translation";
ALTER TABLE "dictionary_word" RENAME COLUMN "example_sentence_english" TO "example_sentence_translation";
ALTER TABLE "srs_card" RENAME COLUMN "example_english" TO "example_translation";
ALTER TABLE "word_cache" RENAME COLUMN "example_english" TO "example_translation";

-- 2) Drop German-specific column
ALTER TABLE "dictionary_word" DROP COLUMN "goethe_b1_wordlist";

-- 3) Add Croatian-specific columns
ALTER TABLE "dictionary_word" ADD COLUMN "aspect" text;
ALTER TABLE "dictionary_word" ADD COLUMN "reflexive" boolean DEFAULT false;

ALTER TABLE "word_cache" ADD COLUMN "aspect" text;
ALTER TABLE "word_cache" ADD COLUMN "reflexive" boolean DEFAULT false;

ALTER TABLE "srs_card" ADD COLUMN "aspect" text;
ALTER TABLE "srs_card" ADD COLUMN "reflexive" boolean DEFAULT false;
