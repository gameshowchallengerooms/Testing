import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const BASE = 'https://framerusercontent.com';

const images = [
  '/images/n0if1GYc13neSTWx3htJSJWrlwU.png',
  '/images/wX62SMRMN1v1X6SFoJaoNdwo.webp',
  '/images/93NVWJJQujdEcPewVpg3Xp7ip4.webp',
  '/images/jFQf7YQJEPbIFQ2mkSrGItZaTLw.png',
  '/images/3pCUVCONlMbPw2vvJvV9TGG1gVY.png',
  '/images/pSSINVOSMIf4PhqxNRckBByjw.webp',
  '/images/oHin3lbqO7tteZ1HgFuQLu0V2fs.png',
  '/images/Q38ypNMBsBVK6qjiF6kKfrobM24.png',
  '/images/hwfGboafSiaVSNxgHI3RAzUZw.png',
  '/images/tN8WgMuSZBg5gEA7bH6lhdoVKbs.png',
  '/images/oIkjl5UzpBOIq5IYexjvpzeqQDI.png',
  '/images/vt5i1qX2nps9VOvw3U6x7sbEFw.png',
  '/images/AVLnSCMId620Xj6gKFiZrOe4G0.png',
  '/images/2534QApTtXFvKYQrEbU80KtEc.png',
  '/images/WYwksWcgznbX1VSN7tG09p5PM.png',
  '/images/CrUPNjiFg8LHxyxPkJDaPSvx6E.png',
  '/images/6tTbkXggWgQCAJ4DO2QEdXXmgM.svg',
  '/images/11KSGbIZoRSg4pjdnUoif6MKHI.svg',
  '/images/pGEpsxpGy4MIjqcG471RdJ7f6Y.png',
  '/images/yty5EEX6I11lbzFXsM3fcTIx0.png',
  '/images/6XVmyesSGqTBk7i6vi9Nai70Q.png',
];

const videos = [
  '/assets/25vAAVNHXPB5rX5qv52YL576GE.webm',
];

const favicons = [
  '/images/ZrnSOoqkPD3fRzQY8ti5PBxhnc.png',
];

async function downloadFile(path, destDir) {
  const url = `${BASE}${path}`;
  const filename = path.split('/').pop();
  const dest = join(destDir, filename);

  try {
    await mkdir(dirname(dest), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed: ${url} (${res.status})`);
      return;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buffer);
    console.log(`Downloaded: ${filename} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`Error downloading ${url}: ${err.message}`);
  }
}

async function downloadBatch(paths, destDir, batchSize = 4) {
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    await Promise.all(batch.map(p => downloadFile(p, destDir)));
  }
}

async function main() {
  console.log('Downloading images...');
  await downloadBatch(images, join(publicDir, 'images'));

  console.log('Downloading videos...');
  await downloadBatch(videos, join(publicDir, 'videos'));

  console.log('Downloading favicons...');
  await downloadBatch(favicons, join(publicDir, 'seo'));

  console.log('Done!');
}

main().catch(console.error);
