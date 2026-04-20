export function shouldBypassImageOptimizer(src: string) {
  const normalized = src.toLowerCase();

  return (
    normalized.startsWith("data:") ||
    normalized.includes(".svg") ||
    normalized.includes("%2fseed-products%2f")
  );
}
