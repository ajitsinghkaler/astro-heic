import { Component, inject, signal } from "@angular/core";
import { PdfService, type PdfPageSize } from "../services/pdf.service";
import { formatBytes, outputFilename } from "../services/conversion-options";

@Component({
  standalone: true,
  template: `
    <section class="rounded-xl border border-zinc-300 bg-zinc-50 p-5 sm:p-7" aria-label="PDF converter" [attr.aria-busy]="loading()">
      @if (!pdfBlobUrl()) {
        <fieldset [disabled]="loading()">
          <legend class="font-semibold text-lg mb-4">Prepare your PDF</legend>
          <label for="pdf-files" class="block font-medium mb-3">Choose HEIC photos</label>
          <input id="pdf-files" type="file" accept=".heic" multiple (change)="onFilesChange($event)" class="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-white" />
          <p class="text-sm text-zinc-600 mt-3">Each photo becomes one page. Review the order before creating the PDF.</p>
          <label for="pdf-page-size" class="block font-medium mt-6 mb-2">PDF page size</label>
          <select id="pdf-page-size" class="w-full sm:w-auto border border-zinc-400 bg-white rounded px-3 py-2" [value]="pageSize()" (change)="setPageSize($any($event.target).value)">
            <option value="photo">Photo proportions</option>
            <option value="a4">A4 portrait</option>
            <option value="letter">US Letter portrait</option>
          </select>
          <p class="text-sm text-zinc-600 mt-2">A4 and Letter fit each photo inside the page with a 24-point margin. Photos keep their proportions.</p>
          @if (selectedFiles().length) {
            <h2 class="font-semibold mt-6 mb-2">Page order</h2>
            <ol class="divide-y divide-zinc-200">
              @for (file of selectedFiles(); track file; let index = $index) {
                <li class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 py-3 text-sm">
                  <span class="break-all">{{ index + 1 }}. {{ file.name }} <span class="text-zinc-600">({{ bytes(file.size) }})</span></span>
                  <span class="flex gap-3 shrink-0">
                    <button type="button" class="underline text-blue-800 px-2 py-2 disabled:text-zinc-400" [disabled]="index === 0" [attr.aria-label]="'Move ' + file.name + ' up'" (click)="movePage(index, -1)">Up</button>
                    <button type="button" class="underline text-blue-800 px-2 py-2 disabled:text-zinc-400" [disabled]="index === selectedFiles().length - 1" [attr.aria-label]="'Move ' + file.name + ' down'" (click)="movePage(index, 1)">Down</button>
                    <button type="button" class="underline text-blue-800 px-2 py-2" [attr.aria-label]="'Remove ' + file.name" (click)="removePage(index)">Remove</button>
                  </span>
                </li>
              }
            </ol>
          }
          <button type="button" class="mt-5 bg-blue-700 hover:bg-blue-800 disabled:bg-zinc-400 text-white font-semibold px-6 py-3 rounded-lg" [disabled]="!selectedFiles().length" (click)="convertHeicToPdf()">Create PDF</button>
        </fieldset>
      }
      <p role="status" aria-live="polite" class="mt-4 text-zinc-700">{{ status() }}</p>
      @if (error()) { <p role="alert" class="mt-4 border border-red-300 bg-red-50 text-red-800 rounded p-3">{{ error() }}</p> }
      @if (pdfBlobUrl()) {
        <div class="flex flex-wrap gap-3 mt-4">
          <a [href]="pdfBlobUrl()" [download]="downloadName()" class="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-lg">Download PDF</a>
          <button type="button" class="border border-zinc-400 bg-white px-5 py-3 rounded-lg" (click)="editPages()">Edit page order</button>
          <button type="button" class="border border-zinc-400 bg-white px-5 py-3 rounded-lg" (click)="cancel()">Convert More</button>
        </div>
        <p class="text-sm text-zinc-600 mt-5">Open the PDF to check every page before sharing it. This is an image-only PDF without OCR or selectable text.</p>
      }
    </section>
  `,
})
export class PdfComponent {
  static renderProviders = [PdfService];
  pdfService = inject(PdfService);
  private destroyed = false;
  selectedFiles = signal<File[]>([]);
  pageSize = signal<PdfPageSize>("photo");
  loading = signal(false);
  pdfBlobUrl = signal("");
  error = signal("");
  status = signal("");
  bytes = formatBytes;

  onFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (!files.length) return;
    this.error.set("");
    const invalid = files.find(file => !/\.heic$/i.test(file.name) || !file.size);
    if (invalid) {
      this.selectedFiles.set([]);
      this.status.set("");
      this.error.set(`Choose complete .heic photos. “${invalid.name}” is empty or has a different extension.`);
      return;
    }
    this.selectedFiles.set(files);
    this.status.set(`${files.length} photo(s) ready. Review the page order, then choose Create PDF.`);
  }

  setPageSize(value: string) { if (value === "photo" || value === "a4" || value === "letter") this.pageSize.set(value); }

  movePage(index: number, direction: number) {
    const next = index + direction;
    if (next < 0 || next >= this.selectedFiles().length) return;
    this.selectedFiles.update(files => { const reordered = [...files]; [reordered[index], reordered[next]] = [reordered[next], reordered[index]]; return reordered; });
    this.status.set("Page order updated.");
  }

  removePage(index: number) {
    this.selectedFiles.update(files => files.filter((_, i) => i !== index));
    this.error.set("");
    this.status.set(this.selectedFiles().length ? `${this.selectedFiles().length} photo(s) ready. Review the order and choose Create PDF.` : "Choose one or more HEIC photos.");
  }

  downloadName() { return this.selectedFiles().length === 1 ? outputFilename(this.selectedFiles()[0].name, "pdf", new Set()) : "heic-photos.pdf"; }

  editPages() {
    if (this.pdfBlobUrl()) URL.revokeObjectURL(this.pdfBlobUrl());
    this.pdfBlobUrl.set("");
    this.status.set("Review your photos and create a new PDF when ready.");
  }

  cancel() {
    this.editPages();
    this.selectedFiles.set([]);
    this.status.set("");
    this.error.set("");
  }

  ngOnDestroy() { this.destroyed = true; this.cancel(); }

  async convertHeicToPdf() {
    if (this.loading() || !this.selectedFiles().length) return;
    this.loading.set(true);
    this.error.set("");
    this.status.set(`Preparing 0 of ${this.selectedFiles().length} pages…`);
    try {
      const url = await this.pdfService.convertToPdf(this.selectedFiles(), {
        pageSize: this.pageSize(),
        onProgress: (completed, total) => { if (!this.destroyed) this.status.set(`Prepared ${completed} of ${total} pages…`); },
      });
      if (this.destroyed) URL.revokeObjectURL(url);
      else { this.pdfBlobUrl.set(url); this.status.set(`${this.selectedFiles().length} page(s) ready to download.`); }
    } catch {
      this.status.set("");
      this.error.set("The PDF could not be created. Try a single complete HEIC photo or a smaller batch.");
    } finally { this.loading.set(false); }
  }
}
