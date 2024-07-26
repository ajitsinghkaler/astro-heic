import { Component, inject, signal } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { PdfService } from "../services/pdf.service";

@Component({
  standalone: true,
  template: `
    <div
      class="relative rounded-lg overflow-hidden bg-zinc-50 p-4 border border-zinc-300"
      [class.hover:bg-zinc-100]="!selectedFiles().length"
    >
      <div class="relative w-full min-h-60 flex flex-col justify-between">
        @if(!selectedFiles().length){
        <div class="flex justify-center absolute top-0 left-0 w-full h-full">
          <div class="flex flex-col items-center justify-center h-full">
            <div class="text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="40"
                zoomAndPan="magnify"
                viewBox="0 0 30 44.999999"
                height="60"
                preserveAspectRatio="xMidYMid meet"
                version="1.0"
              >
                <g clip-path="url(#b1635a3719)">
                  <path
                    fill="currentColor"
                    d="M 28.050781 12.816406 L 19.464844 4.246094 C 18.933594 3.722656 18.140625 3.390625 17.347656 3.390625 L 4.132812 3.390625 C 2.484375 3.390625 1.160156 4.710938 1.160156 6.355469 L 1.160156 38.644531 C 1.160156 40.292969 2.484375 41.609375 4.132812 41.609375 L 25.9375 41.609375 C 27.589844 41.609375 28.910156 40.292969 28.910156 38.644531 L 28.910156 14.855469 C 28.910156 14.066406 28.582031 13.339844 28.050781 12.816406 Z M 20.453125 13.011719 C 19.792969 13.011719 19.265625 12.484375 19.265625 11.824219 L 19.265625 5.761719 L 26.53125 13.011719 Z M 20.453125 13.011719 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  ></path>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(5.028566, 27.290389)">
                    <g>
                      <path
                        d="M 3.6875 -7.140625 C 4.195312 -7.140625 4.632812 -7.046875 5 -6.859375 C 5.363281 -6.671875 5.632812 -6.40625 5.8125 -6.0625 C 6 -5.726562 6.09375 -5.335938 6.09375 -4.890625 C 6.09375 -4.453125 6 -4.0625 5.8125 -3.71875 C 5.632812 -3.382812 5.363281 -3.125 5 -2.9375 C 4.632812 -2.75 4.195312 -2.65625 3.6875 -2.65625 L 2.34375 -2.65625 L 2.34375 0 L 0.921875 0 L 0.921875 -7.140625 Z M 3.5 -3.78125 C 4.28125 -3.78125 4.671875 -4.148438 4.671875 -4.890625 C 4.671875 -5.640625 4.28125 -6.015625 3.5 -6.015625 L 2.34375 -6.015625 L 2.34375 -3.78125 Z M 3.5 -3.78125 "
                      ></path>
                    </g>
                  </g>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(11.549455, 27.290389)">
                    <g>
                      <path
                        d="M 3.5 -7.140625 C 4.65625 -7.140625 5.535156 -6.835938 6.140625 -6.234375 C 6.753906 -5.640625 7.0625 -4.75 7.0625 -3.5625 C 7.0625 -2.382812 6.753906 -1.492188 6.140625 -0.890625 C 5.535156 -0.296875 4.65625 0 3.5 0 L 0.921875 0 L 0.921875 -7.140625 Z M 3.40625 -1.1875 C 4.144531 -1.1875 4.695312 -1.375 5.0625 -1.75 C 5.425781 -2.125 5.609375 -2.726562 5.609375 -3.5625 C 5.609375 -4.40625 5.425781 -5.015625 5.0625 -5.390625 C 4.695312 -5.765625 4.144531 -5.953125 3.40625 -5.953125 L 2.34375 -5.953125 L 2.34375 -1.1875 Z M 3.40625 -1.1875 "
                      ></path>
                    </g>
                  </g>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(19.178315, 27.290389)">
                    <g>
                      <path
                        d="M 5.453125 -7.140625 L 5.453125 -5.953125 L 2.34375 -5.953125 L 2.34375 -4.0625 L 5.171875 -4.0625 L 5.171875 -2.90625 L 2.34375 -2.90625 L 2.34375 0 L 0.921875 0 L 0.921875 -7.140625 Z M 5.453125 -7.140625 "
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <button
              class="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded text-lg font-bold my-3"
            >
              Choose files
            </button>
            <input
              #fileInput
              type="file"
              class="absolute w-full h-full z-10 opacity-0 cursor-pointer top-0"
              accept=".heic"
              (change)="onFilesChange($event)"
              multiple
            />
            <p class="text-sm text-center font-semibold text-red-500">
              or drop files here
            </p>
            <p class="text-sm text-gray-500 mt-2"></p>
          </div>
        </div>
        } @if(loading()){
        <div
          class="flex justify-center items-center absolute top-0 left-0 w-full h-full flex-col"
        >
        <div
            class="w-10 h-10 border-4 border-red-400 border-t-red-500 rounded-full animate-spin"
          ></div>
          <p class="mt-6 text-zinc-700 font-semibold">Converting...</p>
        </div>
        } @if(pdfBlobUrl()){
        <div
          class="flex justify-center items-center absolute top-0 left-0 w-full h-full"
        >
          <a
            [href]="pdfBlobUrl()"
            download="output.pdf"
            class="text-red-500 hover:text-red-600 px-4 py-2 rounded z-20 font-semibold text-lg"
          >
            Download
          </a>
          <button
            class="text-red-500 hover:text-red-600 px-4 py-2 rounded z-20 font-semibold text-lg"
            (click)="cancel()"
          >
            Convert More
          </button>
        </div>
        }
      </div>
    </div>
    @if(error()){
    <div class="text-red-600 bg-red-100 border border-red-600 rounded-lg mt-6">
      <p class="text-sm font-semibold text-center p-2">{{ error() }}</p>
    </div>
    }
  `,

  imports: [NgOptimizedImage],
})
export class PdfComponent {
  static renderProviders = [PdfService];

  pdfService = inject(PdfService);
  selectedFiles = signal<File[]>([]);
  loading = signal(false);
  pdfBlobUrl = signal<string>("");
  error = signal("");


  onFilesChange(event: any) {
    this.selectedFiles.set(Array.from(event.target.files));
    this.convertHeicToPdf();
  }

  cancel() {
    this.selectedFiles.set([]);
    this.pdfBlobUrl.set("");
    this.loading.set(false);
  }

  ngOnDestroy() {
    this.cancel();
  }

  async convertHeicToPdf() {
    this.loading.set(true);
    this.error.set("");
    try {
      const result = (await this.pdfService.convertToPdf(
        this.selectedFiles(),
      )) as string;
      this.pdfBlobUrl.set(result);
      this.loading.set(false);
    } catch (error) {
      this.cancel();
      this.error.set(
        "An error occured while converting. Please try again or report on the contact us form."
      );
    }
  }
}
