// /src/lib/stringUtils.ts

/**
 * Creates a safe ID from a string (e.g., "Practice & Fieldwork" -> "practice-fieldwork")
 */
// /src/lib/stringUtils.ts

/**
 * Creates a safe ID from a string (e.g., "Biography" -> "biography")
 */
// /src/lib/stringUtils.ts

/**
 * Creates a safe ID from a string (e.g., "Biography" -> "biography")
 */
export const sluggifyTitle = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') // Normalize Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};
/**
 * Normalizes a string for searching/comparing (lowercase, no spaces, no punctuation)
 */
const normalize = (str: string): string => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove punctuation
    .replace(/[\s-]+/g, ''); // Remove spaces and hyphens
};

/**
 * Fuzzy check if a card title is similar enough to a section title
 */
export const titlesAreSimilar = (cardTitle: string, sectionTitle: string): boolean => {
  if (!cardTitle || !sectionTitle) return false;

  const nCard = normalize(cardTitle);
  const nSection = normalize(sectionTitle);

  // Exact normalized match
  if (nCard === nSection) return true;

  // Basic word overlap check (must have more than 3 chars)
  const cardWords = cardTitle.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const sectionWords = sectionTitle.toLowerCase().split(/\s+/).filter(word => word.length > 3);

  for (const word of cardWords) {
    if (sectionWords.includes(word)) return true;
  }

  // Section title contains card title
  if (nSection.includes(nCard)) return true;

  return false;
};