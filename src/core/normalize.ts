export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ");
}

export function isAnswerCorrect(
  userAnswer: string,
  correctAnswer: string,
  alternativeAnswers: string[] = []
): boolean {
  const normalizedUser = normalizeText(userAnswer);
  const accepted = [correctAnswer, ...alternativeAnswers]
    .map(normalizeText)
    .filter(Boolean);

  return accepted.includes(normalizedUser);
}