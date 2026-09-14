import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NUI_RAINBOW_CSS } from '../dist/css.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

writeFileSync(resolve(root, 'dist/styles.css'), NUI_RAINBOW_CSS);
writeFileSync(resolve(root, 'src/styles.css'), NUI_RAINBOW_CSS);
