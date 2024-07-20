import { Component, inject, signal } from "@angular/core";
import { ConvertService } from "../services/convert.service";
import { NgOptimizedImage } from "@angular/common";
import type { ImageBlobUrls } from "../services/image-blob-urls";

@Component({
  selector: "app-webp",
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
            <div class="text-purple-500">
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
                <g clip-path="url(#926ea1de57)">
                  <path
                    fill="currentColor"
                    d="M 28.050781 12.816406 L 19.464844 4.246094 C 18.933594 3.722656 18.140625 3.390625 17.347656 3.390625 L 4.132812 3.390625 C 2.484375 3.390625 1.160156 4.710938 1.160156 6.355469 L 1.160156 38.644531 C 1.160156 40.292969 2.484375 41.609375 4.132812 41.609375 L 25.9375 41.609375 C 27.589844 41.609375 28.910156 40.292969 28.910156 38.644531 L 28.910156 14.855469 C 28.910156 14.066406 28.582031 13.339844 28.050781 12.816406 Z M 20.453125 13.011719 C 19.792969 13.011719 19.265625 12.484375 19.265625 11.824219 L 19.265625 5.761719 L 26.53125 13.011719 Z M 20.453125 13.011719 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  ></path>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(2.667276, 26.399976)">
                    <g>
                      <path
                        d="M 2.890625 0 L 1.5625 0 L 0.171875 -6.0625 L 1.359375 -6.0625 L 2.28125 -1.796875 L 2.375 -1.796875 L 3.46875 -6.0625 L 4.5 -6.0625 L 5.609375 -1.796875 L 5.703125 -1.796875 L 6.625 -6.0625 L 7.78125 -6.0625 L 6.390625 0 L 5.046875 0 L 3.984375 -3.90625 L 3.90625 -3.90625 Z M 2.890625 0 "
                      ></path>
                    </g>
                  </g>
                  <g transform="translate(10.6111, 26.399976)">
                    <g>
                      <path
                        d="M 1.984375 -2.671875 L 1.984375 -1 L 4.890625 -1 L 4.890625 0 L 0.78125 0 L 0.78125 -6.0625 L 4.8125 -6.0625 L 4.8125 -5.0625 L 1.984375 -5.0625 L 1.984375 -3.640625 L 4.46875 -3.640625 L 4.46875 -2.671875 Z M 1.984375 -2.671875 "
                      ></path>
                    </g>
                  </g>
                  <g transform="translate(15.828126, 26.399976)">
                    <g>
                      <path
                        d="M 0.78125 0 L 0.78125 -6.0625 L 3.375 -6.0625 C 3.75 -6.0625 4.066406 -6.003906 4.328125 -5.890625 C 4.585938 -5.773438 4.78125 -5.609375 4.90625 -5.390625 C 5.039062 -5.171875 5.109375 -4.914062 5.109375 -4.625 C 5.109375 -4.351562 5.039062 -4.113281 4.90625 -3.90625 C 4.78125 -3.707031 4.597656 -3.546875 4.359375 -3.421875 L 4.359375 -3.328125 C 4.742188 -3.222656 5.035156 -3.039062 5.234375 -2.78125 C 5.441406 -2.519531 5.546875 -2.195312 5.546875 -1.8125 C 5.546875 -1.238281 5.367188 -0.789062 5.015625 -0.46875 C 4.671875 -0.15625 4.15625 0 3.46875 0 Z M 3.125 -3.640625 C 3.6875 -3.640625 3.96875 -3.894531 3.96875 -4.40625 C 3.96875 -4.664062 3.894531 -4.859375 3.75 -4.984375 C 3.613281 -5.109375 3.40625 -5.171875 3.125 -5.171875 L 1.984375 -5.171875 L 1.984375 -3.640625 Z M 3.34375 -0.953125 C 4.007812 -0.953125 4.34375 -1.25 4.34375 -1.84375 C 4.34375 -2.445312 4.007812 -2.75 3.34375 -2.75 L 1.984375 -2.75 L 1.984375 -0.953125 Z M 3.34375 -0.953125 "
                      ></path>
                    </g>
                  </g>
                  <g transform="translate(21.763167, 26.399976)">
                    <g>
                      <path
                        d="M 3.140625 -6.0625 C 3.566406 -6.0625 3.929688 -5.984375 4.234375 -5.828125 C 4.546875 -5.671875 4.78125 -5.445312 4.9375 -5.15625 C 5.101562 -4.875 5.1875 -4.539062 5.1875 -4.15625 C 5.1875 -3.78125 5.101562 -3.445312 4.9375 -3.15625 C 4.78125 -2.875 4.546875 -2.65625 4.234375 -2.5 C 3.929688 -2.34375 3.566406 -2.265625 3.140625 -2.265625 L 1.984375 -2.265625 L 1.984375 0 L 0.78125 0 L 0.78125 -6.0625 Z M 2.96875 -3.21875 C 3.632812 -3.21875 3.96875 -3.53125 3.96875 -4.15625 C 3.96875 -4.800781 3.632812 -5.125 2.96875 -5.125 L 1.984375 -5.125 L 1.984375 -3.21875 Z M 2.96875 -3.21875 "
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <button
              class="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded text-lg font-bold my-3"
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
            <p class="text-sm text-center font-semibold text-purple-500">
              or drop files here
            </p>
            <p class="text-sm text-gray-500 mt-2"></p>
          </div>
        </div>
        } @if(loading()){
        <div
          class="flex justify-center items-center absolute top-0 left-0 w-full h-full flex-col"
        >
          <p class="mt-6 text-zinc-700 font-semibold">Converting...</p>
        </div>
        } @if(imageBlobUrls().length){
        <div>
          <div class="flex justify-center mb-4">
            <button
              class="text-purple-500 hover:text-purple-600 px-4 rounded z-20 font-semibold text-lg"
              (click)="downloadAll()"
            >
              Download All
            </button>
            <button
              class="text-purple-500 hover:text-purple-600 px-4 rounded z-20 font-semibold text-lg"
              (click)="cancel()"
            >
              Convert More
            </button>
          </div>
          <div class="flex flex-wrap gap-4 justify-center md:justify-normal">
            @for(urlInfo of imageBlobUrls(); track idx; let idx = $index){
            <div>
              <a [href]="urlInfo.url" [download]="urlInfo.name">
                <div
                  class="h-20 w-20 relative flex items-center justify-center group rounded overflow-hidden"
                >
                  <img [src]="urlInfo.url" class="w-full h-full object-cover" />
                  <div class="absolute bg-white rounded-full p-2">
                    <svg
                      class="w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,

  imports: [NgOptimizedImage],
})
export class WebpComponent {
  convertService = inject(ConvertService);
  selectedFiles = signal<File[]>([]);

  loading = signal(false);
  imageBlobUrls = signal<ImageBlobUrls[]>([]);

  onFilesChange(event: any) {
    this.selectedFiles.set(Array.from(event.target.files));
    this.convertHeicToWebp();
  }

  cancel() {
    this.selectedFiles.set([]);
    this.imageBlobUrls.set([]);
    this.loading.set(false);
  }

  ngOnDestroy() {
    this.cancel();
  }

  async convertHeicToWebp() {
    this.loading.set(true);
    try {
      const result = (await this.convertService.convertFiles(
        this.selectedFiles(),
        "image/webp"
      )) as ImageBlobUrls[];
      this.imageBlobUrls.set(result);
      this.loading.set(false);
    } catch (error) {
      this.cancel();
    }
  }

  async downloadAll() {
    try {
      await this.convertService.downloadZip(this.imageBlobUrls());
    } catch (error) {
      this.cancel();
    }
  }
}
