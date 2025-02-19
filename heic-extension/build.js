// build.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import archiver from 'archiver';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildContentScript() {
  await build({
    configFile: path.resolve(__dirname, 'vite.config.js'),
  });
}

async function zipOutput() {
  const output = fs.createWriteStream(path.resolve(__dirname, 'output.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level
  });

  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log('Archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Append files from the build output directory
  const distPath = path.resolve(__dirname, 'dist');
  fs.readdirSync(distPath).forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      archive.directory(filePath, file);
    } else {
      archive.file(filePath, { name: file });
    }
  });

  await archive.finalize();
}

async function main() {
  await buildContentScript();
  await zipOutput();
  console.log('Build and zip process completed.');
}

main().catch(console.error);