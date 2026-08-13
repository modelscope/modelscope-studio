// `index.ts` spawns `examine.py` and `build.ts` uses `svelte_runtime_entry.js`,
// both resolved relative to the built entry, so they have to sit next to it.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = ['examine.py', 'svelte_runtime_entry.js'];

mkdirSync(join(root, 'dist'), { recursive: true });

for (const asset of assets) {
  copyFileSync(join(root, 'src', asset), join(root, 'dist', asset));
}

console.log(`copied ${assets.join(', ')} -> dist/`);
