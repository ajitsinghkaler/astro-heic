import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real service with controlled decode completion and browser APIs.
// Encoding is stubbed here; this test checks page ordering and error handling,
// not support for every HEIC variant or the visual fidelity of the decoder.
const source = readFileSync(new URL('../src/services/pdf.service.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true },
}).outputText;

function setup() {
  const photos = new Map();
  const decodes = [];
  let result;
  class Pdf {
    constructor(options) { assert.equal(options.unit, 'pt'); }
    pages = [{ blank: true }];
    deletePage(number) { this.pages.splice(number - 1, 1); }
    addPage(size, orientation) { this.pages.push({ size, orientation }); }
    addImage(data, format, x, y, width, height) { Object.assign(this.pages.at(-1), { data, format, x, y, width, height }); }
    output(type) { assert.equal(type, 'blob'); return { pages: this.pages }; }
  }
  class Reader {
    readAsDataURL(blob) {
      queueMicrotask(() => blob.readerError ? this.onerror(new Error('read failed')) : this.onload({ target: { result: blob.id } }));
    }
  }
  class BrowserImage {
    set src(id) {
      const photo = photos.get(id);
      this.width = photo.width;
      this.height = photo.height;
      queueMicrotask(() => photo.imageError ? this.onerror() : this.onload());
    }
  }
  const exports = {};
  const context = {
    exports, console, FileReader: Reader, Image: BrowserImage,
    URL: { createObjectURL(blob) { result = blob; return 'blob:test/pdf'; } },
    require(name) {
      if (name === '@angular/core') return { Injectable: () => value => value };
      if (name === 'jspdf') return { jsPDF: Pdf };
      if (name === 'heic-to') return { async heicTo(options) {
        decodes.push(options);
        await new Promise(resolve => setTimeout(resolve, options.blob.delay ?? 0));
        if (options.blob.decodeError) throw new Error('decode failed');
        return options.blob;
      }};
      throw new Error(`Unexpected module: ${name}`);
    },
  };
  vm.runInNewContext(compiled, context, { filename: 'pdf.service.cjs' });
  return {
    service: new exports.PdfService(), decodes,
    photo(id, width, height, extra = {}) { const file = { id, width, height, ...extra }; photos.set(id, file); return file; },
    result: () => result,
  };
}

test('keeps selection order when the first photo decodes more slowly', async () => {
  const t = setup();
  const files = [t.photo('first', 320, 180, { delay: 20 }), t.photo('second', 180, 320), t.photo('third', 240, 240)];
  assert.equal(await t.service.convertToPdf(files), 'blob:test/pdf');
  assert.deepEqual(Array.from(t.result().pages, page => page.data), ['first', 'second', 'third']);
  assert.equal(t.result().pages.length, 3);
});

test('fits a landscape photo on A4 portrait without stretching or clipping', async () => {
  const t = setup();
  await t.service.convertToPdf([t.photo('landscape', 320, 180)], { pageSize: 'a4' });
  const page = t.result().pages[0];
  assert.deepEqual(Array.from(page.size), [595.28, 841.89]);
  assert.equal(page.orientation, 'portrait');
  assert(Math.abs(page.width / page.height - 320 / 180) < 0.0001);
  assert(page.x >= 24 && page.y >= 24);
  assert(page.x + page.width <= 595.28 - 24 + 0.0001);
  assert(page.y + page.height <= 841.89 - 24 + 0.0001);
});

test('creates US Letter pages and reports completed pages in order', async () => {
  const t = setup(), progress = [];
  await t.service.convertToPdf([t.photo('first', 180, 320), t.photo('second', 320, 180)], {
    pageSize: 'letter', onProgress: (completed, total) => progress.push([completed, total]),
  });
  assert.deepEqual(Array.from(t.result().pages[0].size), [612, 792]);
  assert.deepEqual(Array.from(t.result().pages, page => page.data), ['first', 'second']);
  assert.deepEqual(progress, [[1, 2], [2, 2]]);
});

test('rejects an unknown paper size', async () => {
  const t = setup();
  await assert.rejects(t.service.convertToPdf([t.photo('photo', 20, 20)], { pageSize: 'invalid' }), /page size/);
});

test('creates a single correctly sized page without a blank leading page', async () => {
  const t = setup();
  await t.service.convertToPdf([t.photo('landscape', 320, 180)]);
  const pages = t.result().pages;
  assert.equal(pages.length, 1);
  assert.equal(pages[0].orientation, 'landscape');
  assert.deepEqual(Array.from(pages[0].size), [240, 135]);
  assert.equal(pages[0].format, 'JPEG');
  assert.equal(t.decodes[0].type, 'image/jpeg');
  assert.equal(t.decodes[0].quality, 0.92);
});

test('preserves portrait proportions in a mixed-orientation batch', async () => {
  const t = setup();
  await t.service.convertToPdf([t.photo('portrait', 180, 320), t.photo('landscape', 320, 180)]);
  assert.deepEqual(Array.from(t.result().pages, page => page.orientation), ['portrait', 'landscape']);
  assert.deepEqual(Array.from(t.result().pages[0].size), [135, 240]);
});

test('rejects an empty selection instead of producing a blank PDF', async () => {
  const t = setup();
  await assert.rejects(t.service.convertToPdf([]), /select|photo|file/i);
  assert.equal(t.result(), undefined);
});

for (const [flag, message] of [['decodeError', /decode failed/], ['readerError', /read failed/], ['imageError', /load image/]]) {
  test(`does not return a partial document after ${flag}`, async () => {
    const t = setup();
    await assert.rejects(t.service.convertToPdf([t.photo('good', 20, 20), t.photo('bad', 20, 20, { [flag]: true })]), message);
    assert.equal(t.result(), undefined);
  });
}
