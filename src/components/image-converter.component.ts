import { Component, Input, inject, signal } from "@angular/core";
import { ConvertService } from "../services/convert.service";
import { formatBytes, type ImageFormat } from "../services/conversion-options";
import type { ImageBlobUrls } from "../services/image-blob-urls";

@Component({
  selector: "app-image-converter",
  standalone: true,
  template: `
    <section class="rounded-xl border border-zinc-300 bg-zinc-50 p-5 sm:p-7" aria-label="Image converter" [attr.aria-busy]="loading()">
      @if (!results().length) {
        <fieldset [disabled]="loading()">
          <legend class="font-semibold text-lg mb-4">Choose your output settings</legend>
          <div class="grid sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label [for]="label + '-resize'" class="block font-medium mb-2">Longest edge</label>
              <select [id]="label + '-resize'" class="border border-zinc-400 rounded px-3 py-2 w-full bg-white" [value]="maxEdge()" (change)="maxEdge.set(+$any($event.target).value)">
                <option value="0">Original size</option>
                <option value="2560">Up to 2560 pixels</option>
                <option value="1920">Up to 1920 pixels</option>
                <option value="1280">Up to 1280 pixels</option>
                <option value="800">Up to 800 pixels</option>
              </select>
              <p class="text-sm text-zinc-600 mt-2">Keeps the photo's proportions. Smaller photos are never enlarged.</p>
            </div>
            @if (format !== 'image/png') {
              <div>
                <label [for]="label + '-quality'" class="block font-medium mb-2">Quality setting: {{ quality() }}</label>
                <input [id]="label + '-quality'" type="range" min="10" max="100" step="1" [value]="quality()" (input)="quality.set(+$any($event.target).value)" class="w-full h-8 accent-blue-700" />
                <p class="text-sm text-zinc-600 mt-2">Higher settings usually increase file size. This is a lossy format; compare the downloaded result.</p>
              </div>
            } @else {
              <p class="text-sm text-zinc-600 self-center">PNG uses lossless image encoding. Keeping the original dimensions does not preserve every HEIC feature or metadata field.</p>
            }
          </div>
          <div class="rounded-lg border-2 border-dashed border-zinc-400 bg-white p-5" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
            <label [for]="label + '-files'" class="block font-semibold mb-3">Choose HEIC photos</label>
            <input [id]="label + '-files'" type="file" accept=".heic" multiple (change)="onFilesChange($event)" class="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-white" />
            <p class="text-sm text-zinc-600 mt-3">Or drop HEIC files here. Photo conversion happens locally in this browser.</p>
          </div>
          @if (files().length) {
            <p class="font-medium mt-5">{{ files().length }} photo(s) selected</p>
            <ul class="mt-2 divide-y divide-zinc-200">
              @for (file of files(); track $index; let index = $index) {
                <li class="flex items-center justify-between gap-3 py-2 text-sm">
                  <span class="break-all">{{ file.name }} <span class="text-zinc-600">({{ bytes(file.size) }})</span></span>
                  <button type="button" class="underline text-blue-800 px-2 py-2 shrink-0" [attr.aria-label]="'Remove ' + file.name" (click)="removeFile(index)">Remove</button>
                </li>
              }
            </ul>
          }
          <button type="button" class="mt-5 bg-blue-700 hover:bg-blue-800 disabled:bg-zinc-400 text-white font-semibold px-6 py-3 rounded-lg" [disabled]="!files().length" (click)="convert()">Convert to {{ label }}</button>
        </fieldset>
      }
      <p role="status" aria-live="polite" class="mt-4 text-zinc-700">{{ status() }}</p>
      @if (error()) { <p role="alert" class="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">{{ error() }}</p> }
      @if (results().length) {
        <div class="flex flex-wrap items-center gap-3 mt-3 mb-6">
          <button type="button" class="bg-blue-700 hover:bg-blue-800 disabled:bg-zinc-400 text-white font-semibold px-5 py-3 rounded-lg" [disabled]="zipping()" (click)="downloadAll()">{{ zipping() ? 'Preparing ZIP…' : 'Download All as ZIP' }}</button>
          <button type="button" class="border border-zinc-400 bg-white px-5 py-3 rounded-lg" [disabled]="zipping()" (click)="reset()">Convert More</button>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          @for (result of results(); track result.name) {
            <div class="rounded-lg border border-zinc-300 bg-white overflow-hidden">
              <a [href]="result.url" [download]="result.name" [attr.aria-label]="'Download ' + result.name" class="block p-4 text-blue-800">
                <img [src]="result.url" [alt]="'Converted preview of ' + result.sourceName" class="w-full h-36 object-contain bg-zinc-100 rounded mb-3" />
                <span class="font-semibold underline break-all">Download {{ result.name }}</span>
              </a>
              <p class="text-sm text-zinc-600 px-4 pb-4">{{ result.width }} × {{ result.height }} pixels · {{ bytes(result.size) }}</p>
            </div>
          }
        </div>
        <p class="text-sm text-zinc-600 mt-5">A ZIP contains separate images. Check the downloaded files before sharing them and keep your HEIC originals.</p>
      }
    </section>
  `,
})
export class ImageConverterComponent {
  @Input() format: ImageFormat = "image/jpeg";
  @Input() label = "JPG";
  @Input() initialQuality = 92;
  private converter = inject(ConvertService);
  private destroyed = false;
  files = signal<File[]>([]);
  results = signal<ImageBlobUrls[]>([]);
  quality = signal(92);
  maxEdge = signal(0);
  loading = signal(false);
  zipping = signal(false);
  status = signal("");
  error = signal("");
  bytes = formatBytes;

  ngOnInit() { this.quality.set(this.initialQuality); }

  onFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectFiles(Array.from(input.files));
    input.value = "";
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.loading() && event.dataTransfer?.files.length) this.selectFiles(Array.from(event.dataTransfer.files));
  }

  selectFiles(files: File[]) {
    this.error.set("");
    const invalid = files.find(file => !/\.heic$/i.test(file.name) || !file.size);
    if (invalid) {
      this.files.set([]);
      this.status.set("");
      this.error.set(`Choose complete .heic photos. “${invalid.name}” is empty or has a different extension.`);
      return;
    }
    this.files.set(files);
    this.status.set(`${files.length} photo(s) ready. Choose Convert to ${this.label} to start.`);
  }

  removeFile(index: number) {
    this.files.update(files => files.filter((_, i) => i !== index));
    this.error.set("");
    this.status.set(this.files().length ? `${this.files().length} photo(s) ready to convert.` : "Choose one or more HEIC photos.");
  }

  async convert() {
    if (this.loading() || !this.files().length) return;
    this.loading.set(true);
    this.error.set("");
    this.status.set(`Converting 0 of ${this.files().length} photos…`);
    try {
      const results = await this.converter.convertFiles(this.files(), this.format, {
        quality: this.quality() / 100,
        maxEdge: this.maxEdge(),
        onProgress: (completed, total) => { if (!this.destroyed) this.status.set(`Converted ${completed} of ${total} photos…`); },
      });
      if (this.destroyed) results.forEach(result => URL.revokeObjectURL(result.url));
      else {
        this.results.set(results);
        this.status.set(`${results.length} ${this.label} image(s) ready to download.`);
      }
    } catch (error) {
      this.status.set("");
      this.error.set(error instanceof Error ? error.message : "Conversion failed. Try a single complete HEIC photo or a smaller batch.");
    } finally { this.loading.set(false); }
  }

  async downloadAll() {
    if (this.zipping()) return;
    this.zipping.set(true);
    this.error.set("");
    try { await this.converter.downloadZip(this.results()); }
    catch { this.error.set("The ZIP could not be created. Try the individual download links."); }
    finally { this.zipping.set(false); }
  }

  reset() {
    this.results().forEach(result => URL.revokeObjectURL(result.url));
    this.results.set([]);
    this.files.set([]);
    this.status.set("");
    this.error.set("");
  }

  ngOnDestroy() { this.destroyed = true; this.reset(); }
}
