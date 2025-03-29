/**
 * Calculates estimated reading time for a given text string
 * @param text - The text content to analyze
 * @param options - Configuration options:
 *   - wordsPerMinute: Average reading speed (default: 200)
 *   - format: 'short' (e.g., "5 min") or 'long' (e.g., "5 minutes")
 *   - includeSeconds: Whether to show seconds for times < 1 minute (default: false)
 * @returns Formatted reading time string
 */
export function estimateReadingTime(
  text: string,
  options?: {
    wordsPerMinute?: number;
    format?: "short" | "long";
    includeSeconds?: boolean;
  }
): string {
  const { wordsPerMinute = 200, format = "long", includeSeconds = false } = options || {};

  // Clean the text and count words
  const cleanedText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
  const wordCount = cleanedText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate minutes
  const minutes = wordCount / wordsPerMinute;

  // Handle cases where reading time is less than 1 minute
  if (minutes < 1) {
    if (includeSeconds) {
      const seconds = Math.round(minutes * 60);
      return format === "short"
        ? `${seconds} sec`
        : `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
    }
    return format === "short" ? "<1 min" : "less than a minute";
  }

  // Handle cases between 1-60 minutes
  if (minutes < 60) {
    const roundedMinutes = Math.round(minutes);
    return format === "short"
      ? `${roundedMinutes} min`
      : `${roundedMinutes} ${roundedMinutes === 1 ? "minute" : "minutes"}`;
  }

  // Handle cases over 1 hour
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (remainingMinutes === 0) {
    return format === "short" ? `${hours} hr` : `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return format === "short"
    ? `${hours} hr ${remainingMinutes} min`
    : `${hours} ${hours === 1 ? "hour" : "hours"} and ${remainingMinutes} minutes`;
}
