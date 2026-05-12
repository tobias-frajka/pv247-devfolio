export function safeHttpUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  try {
    const u = new URL(input);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export function safeMailtoUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    try {
      const u = new URL(trimmed);
      return u.protocol === 'mailto:' ? u.toString() : null;
    } catch {
      return null;
    }
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? `mailto:${trimmed}` : null;
}
