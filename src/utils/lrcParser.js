export function parseLRC(lrcText) {
  if (!lrcText) return [];

  const lines = lrcText.split('\n');
  const result = [];

  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millis = parseInt(match[3].padEnd(3, '0'), 10);
      const time = minutes * 60 + seconds + millis / 1000;
      const text = match[4].trim();

      if (text.length > 0) {
        result.push({ time, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
