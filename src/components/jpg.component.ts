import { Component, inject, signal } from "@angular/core";
import { ConvertService } from "../services/convert.service";
import { NgOptimizedImage } from "@angular/common";
import type { ImageBlobUrls } from "../services/image-blob-urls";

@Component({
  selector: "app-jpg",
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
            <div class="text-yellow-500">
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
                <g clip-path="url(#1e5064b4d6)">
                  <path
                    fill="currentColor"
                    d="M 28.050781 12.816406 L 19.464844 4.246094 C 18.933594 3.722656 18.140625 3.390625 17.347656 3.390625 L 4.132812 3.390625 C 2.484375 3.390625 1.160156 4.710938 1.160156 6.355469 L 1.160156 38.644531 C 1.160156 40.292969 2.484375 41.609375 4.132812 41.609375 L 25.9375 41.609375 C 27.589844 41.609375 28.910156 40.292969 28.910156 38.644531 L 28.910156 14.855469 C 28.910156 14.066406 28.582031 13.339844 28.050781 12.816406 Z M 20.453125 13.011719 C 19.792969 13.011719 19.265625 12.484375 19.265625 11.824219 L 19.265625 5.761719 L 26.53125 13.011719 Z M 20.453125 13.011719 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  ></path>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(5.122316, 26.900001)">
                    <g>
                      <path
                        d="M 2.5 0.109375 C 1.894531 0.109375 1.390625 -0.00390625 0.984375 -0.234375 C 0.585938 -0.472656 0.300781 -0.785156 0.125 -1.171875 L 0.90625 -2.140625 L 1.03125 -2.140625 C 1.164062 -1.828125 1.351562 -1.578125 1.59375 -1.390625 C 1.832031 -1.210938 2.109375 -1.125 2.421875 -1.125 C 2.773438 -1.125 3.035156 -1.226562 3.203125 -1.4375 C 3.378906 -1.644531 3.46875 -1.976562 3.46875 -2.4375 L 3.46875 -7.140625 L 4.875 -7.140625 L 4.875 -2.421875 C 4.875 -1.554688 4.675781 -0.914062 4.28125 -0.5 C 3.894531 -0.09375 3.300781 0.109375 2.5 0.109375 Z M 2.5 0.109375 "
                      ></path>
                    </g>
                  </g>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(10.881783, 26.900001)">
                    <g>
                      <path
                        d="M 3.6875 -7.140625 C 4.195312 -7.140625 4.632812 -7.046875 5 -6.859375 C 5.363281 -6.671875 5.632812 -6.40625 5.8125 -6.0625 C 6 -5.726562 6.09375 -5.335938 6.09375 -4.890625 C 6.09375 -4.453125 6 -4.0625 5.8125 -3.71875 C 5.632812 -3.382812 5.363281 -3.125 5 -2.9375 C 4.632812 -2.75 4.195312 -2.65625 3.6875 -2.65625 L 2.34375 -2.65625 L 2.34375 0 L 0.921875 0 L 0.921875 -7.140625 Z M 3.5 -3.78125 C 4.28125 -3.78125 4.671875 -4.148438 4.671875 -4.890625 C 4.671875 -5.640625 4.28125 -6.015625 3.5 -6.015625 L 2.34375 -6.015625 L 2.34375 -3.78125 Z M 3.5 -3.78125 "
                      ></path>
                    </g>
                  </g>
                </g>
                <g fill="#ffffff" fill-opacity="1">
                  <g transform="translate(17.402672, 26.900001)">
                    <g>
                      <path
                        d="M 3.46875 0.109375 C 2.875 0.109375 2.359375 -0.0234375 1.921875 -0.296875 C 1.484375 -0.578125 1.144531 -0.988281 0.90625 -1.53125 C 0.675781 -2.082031 0.5625 -2.757812 0.5625 -3.5625 C 0.5625 -4.382812 0.703125 -5.066406 0.984375 -5.609375 C 1.265625 -6.160156 1.65625 -6.566406 2.15625 -6.828125 C 2.664062 -7.097656 3.253906 -7.234375 3.921875 -7.234375 C 4.597656 -7.234375 5.175781 -7.109375 5.65625 -6.859375 C 6.144531 -6.609375 6.488281 -6.234375 6.6875 -5.734375 L 5.65625 -5.109375 L 5.53125 -5.109375 C 5.382812 -5.429688 5.175781 -5.664062 4.90625 -5.8125 C 4.644531 -5.957031 4.316406 -6.03125 3.921875 -6.03125 C 3.304688 -6.03125 2.832031 -5.832031 2.5 -5.4375 C 2.175781 -5.050781 2.015625 -4.425781 2.015625 -3.5625 C 2.015625 -2.707031 2.164062 -2.082031 2.46875 -1.6875 C 2.78125 -1.300781 3.234375 -1.109375 3.828125 -1.109375 C 4.335938 -1.109375 4.710938 -1.222656 4.953125 -1.453125 C 5.203125 -1.679688 5.328125 -2.023438 5.328125 -2.484375 L 5.328125 -2.796875 L 3.640625 -2.796875 L 3.640625 -3.9375 L 6.734375 -3.9375 L 6.734375 0 L 5.375 0 L 5.375 -0.953125 L 5.28125 -0.96875 C 5.132812 -0.625 4.910156 -0.359375 4.609375 -0.171875 C 4.316406 0.015625 3.9375 0.109375 3.46875 0.109375 Z M 3.46875 0.109375 "
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <button
              id="conversion"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2 rounded text-lg font-bold my-3"
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
            <p class="text-sm text-center font-semibold text-yellow-500">
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
            class="w-10 h-10 border-4 border-yellow-400 border-t-yellow-500 rounded-full animate-spin"
          ></div>
          <p class="mt-6 text-zinc-700 font-semibold">Converting...</p>
        </div>
        } @if(imageBlobUrls().length){
        <div>
          <div class="flex justify-center mb-4">
            <button
              class="text-yellow-500 hover:text-yellow-600 px-4 rounded z-20 font-semibold text-lg"
              (click)="downloadAll()"
            >
              Download All
            </button>
            <button
              class="text-yellow-500 hover:text-yellow-600 px-4 rounded z-20 font-semibold text-lg"
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
    @if(error()){
    <div class="text-red-600 bg-red-100 border border-red-600 rounded-lg mt-6">
      <p class="text-sm font-semibold text-center p-2">{{ error() }}</p>
    </div>
    }
  `,
  imports: [NgOptimizedImage],
})
export class JpgComponent {
  static renderProviders = [ConvertService];
  convertService = inject(ConvertService);
  selectedFiles = signal<File[]>([]);
  loading = signal(false);
  imageBlobUrls = signal<ImageBlobUrls[]>([]);
  error = signal("");

  onFilesChange(event: any) {
    this.selectedFiles.set(Array.from(event.target.files));
    this.convertHeicToJpg();
  }

  cancel() {
    this.selectedFiles.set([]);
    this.imageBlobUrls.set([]);
    this.loading.set(false);
  }

  ngOnDestroy() {
    this.cancel();
  }

  async convertHeicToJpg() {
    this.loading.set(true);
    this.error.set("");
    try {
      const result = (await this.convertService
        .convertFiles(this.selectedFiles(), "image/jpeg")) as ImageBlobUrls[];
      this.imageBlobUrls.set(result);
      this.loading.set(false);
    } catch (error) {
      this.cancel();
      this.error.set(
        "An error occured while converting. Please try again or report on the contact us form."
      );
    }
  }

  async downloadAll() {
    try {
      await this.convertService.downloadZip(this.imageBlobUrls());
    } catch (error) {
      this.cancel();
      this.error.set(
        "An error occured while downloading. Please try again or report on the contact us form."
      );
    }
  }
}
