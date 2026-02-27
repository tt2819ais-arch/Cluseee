import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tracksDir = path.join(__dirname, '..', 'public', 'tracks');

function formatName(folderName) {
  return folderName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function generateManifest() {
  if (!fs.existsSync(tracksDir)) {
    fs.mkdirSync(tracksDir, { recursive: true });
  }

  const entries = fs.readdirSync(tracksDir, { withFileTypes: true });
  const tracks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const folder = entry.name;
    const folderPath = path.join(tracksDir, folder);

    const audioExists =
      fs.existsSync(path.join(folderPath, 'audio.mp3'));

    if (!audioExists) continue;

    let title = formatName(folder);
    let artist = 'Unknown Artist';

    const infoPath = path.join(folderPath, 'info.json');
    if (fs.existsSync(infoPath)) {
      try {
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
        if (info.title) title = info.title;
        if (info.artist) artist = info.artist;
      } catch (e) {
        console.warn(`Could not parse ${infoPath}`);
      }
    }

    const coverFile = fs.existsSync(path.join(folderPath, 'cover.jpg'))
      ? 'cover.jpg'
      : fs.existsSync(path.join(folderPath, 'cover.png'))
      ? 'cover.png'
      : null;

    const hasLrc = fs.existsSync(path.join(folderPath, 'lyrics.lrc'));
    const hasTxt = fs.existsSync(path.join(folderPath, 'lyrics.txt'));

    tracks.push({
      id: folder,
      title,
      artist,
      audio: `/tracks/${folder}/audio.mp3`,
      cover: coverFile ? `/tracks/${folder}/${coverFile}` : null,
      lrc: hasLrc ? `/tracks/${folder}/lyrics.lrc` : null,
      txt: hasTxt ? `/tracks/${folder}/lyrics.txt` : null
    });
  }

  const manifestPath = path.join(tracksDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(tracks, null, 2), 'utf-8');
  console.log(`Manifest generated: ${tracks.length} tracks found.`);
}

generateManifest();
