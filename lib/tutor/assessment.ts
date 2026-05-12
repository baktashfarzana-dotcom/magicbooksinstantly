export type WordAssessment = {
  wordIndex: number;
  expectedWord: string;
  spokenWord: string | null;
  accuracyScore: number;
  status: "correct" | "close" | "missed";
};

export type PronunciationAssessment = {
  provider: "mock-azure" | "azure-speech";
  accuracyScore: number;
  completionScore: number;
  status: "needs_practice" | "completed";
  starDustAwarded: number;
  words: WordAssessment[];
};

const COMPLETE_THRESHOLD = 82;

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9']/g, "");
}

function scoreWord(expected: string, spoken: string | null) {
  if (!spoken) return 0;
  const normalizedExpected = normalizeWord(expected);
  const normalizedSpoken = normalizeWord(spoken);
  if (normalizedExpected === normalizedSpoken) return 100;
  if (normalizedExpected[0] === normalizedSpoken[0] && Math.abs(normalizedExpected.length - normalizedSpoken.length) <= 2) {
    return 72;
  }
  return 20;
}

export function assessTranscript({
  targetText,
  transcript,
}: {
  targetText: string;
  transcript: string;
}): PronunciationAssessment {
  const targetWords = targetText.split(/\s+/).filter(Boolean);
  const spokenWords = transcript.split(/\s+/).filter(Boolean);
  const words = targetWords.map((expectedWord, wordIndex) => {
    const spokenWord = spokenWords[wordIndex] ?? null;
    const accuracyScore = scoreWord(expectedWord, spokenWord);

    return {
      wordIndex,
      expectedWord,
      spokenWord,
      accuracyScore,
      status: accuracyScore >= 90 ? "correct" : accuracyScore >= 60 ? "close" : "missed",
    } satisfies WordAssessment;
  });

  const accuracyScore = Math.round(words.reduce((sum, word) => sum + word.accuracyScore, 0) / Math.max(words.length, 1));
  const completionScore = Math.round((words.filter((word) => word.status !== "missed").length / Math.max(words.length, 1)) * 100);
  const completed = accuracyScore >= COMPLETE_THRESHOLD && completionScore >= COMPLETE_THRESHOLD;

  return {
    provider: process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION ? "azure-speech" : "mock-azure",
    accuracyScore,
    completionScore,
    status: completed ? "completed" : "needs_practice",
    starDustAwarded: completed ? 25 : 0,
    words,
  };
}

export const BEDTIME_TRAINING_SCRIPT =
  "In the moonlit library, every brave little breath turned a locked door into a glowing page.";
