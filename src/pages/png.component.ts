import { Component, inject, signal } from '@angular/core';
import { PngCardComponent } from '../components/png-card.component';
import { ImageBlobUrls } from '../interface/image-blob-urls';
import { ConvertService } from '../services/convert.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Meta } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-png',
  standalone: true,
  template: `
    <p-toast />
    <h1 class="text-center font-bold text-4xl mt-12 mb-8">
      Convert HEIC to PNG
    </h1>
    <div
      class="relative rounded-lg overflow-hidden bg-zinc-50 p-4 border border-zinc-300"
      [class.hover:bg-zinc-100]="!selectedFiles().length"
    >
      <div class="relative w-full min-h-60 flex flex-col justify-between">
        @if(!selectedFiles().length){
        <div class="flex justify-center absolute top-0 left-0 w-full h-full">
          <div class="flex flex-col items-center justify-center h-full">
            <div class="text-blue-500">
              <app-png-card></app-png-card>
            </div>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded text-lg font-bold my-3"
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
            <p class="text-sm text-center font-semibold text-blue-500">
              or drop files here
            </p>
            <p class="text-sm text-gray-500 mt-2"></p>
          </div>
        </div>
        }
        @if(loading()){
        <div
          class="flex justify-center items-center absolute top-0 left-0 w-full h-full flex-col"
        >
          <p-progressSpinner aria-label="Loading"></p-progressSpinner>
          <p class="mt-6 text-zinc-700 font-semibold">Converting...</p>
        </div>
        } @if(imageBlobUrls().length){
        <div>
          <div class="flex justify-center mb-4">
            <button
              class="text-blue-500 hover:text-blue-600 px-4 rounded z-20 font-semibold text-lg"
              (click)="downloadAll()"
            >
              Download All
            </button>
            <button
              class="text-blue-500 hover:text-blue-600 px-4 rounded z-20 font-semibold text-lg"
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
    <div class="mt-20">
      <h2 class="text-2xl font-bold mb-8 text-center">HEIC to PNG Features</h2>
      <ul class="space-y-4">
        <li>
          <strong>HEIC to PNG Converter:</strong> Convert your HEIC images to
          PNG for transparency support.
        </li>
        <li>
          <strong>Convert HEIC to PNG on iPhone:</strong> Convert HEIC files to
          PNG directly on your iPhone.
        </li>
        <li>
          <strong>Multiple HEIC to PNG:</strong> Transform multiple HEIC images
          into PNG format at once.
        </li>
        <li>
          <strong>Merge HEIC to PNG:</strong> Merge several HEIC files into one
          PNG image.
        </li>
        <li>
          <strong>HEIC to PNG Converter Free:</strong> Use our converter to
          switch HEIC to PNG for free.
        </li>
        <li>
          <strong>Convert HEIC File to PNG Free Online:</strong> Access our free
          online HEIC to PNG converter anytime.
        </li>
      </ul>
    </div>

    <div class="my-20">
      <h2 class="text-2xl font-bold mb-8 text-center text-pretty">
        Why Convert HEIC to PNG
      </h2>
      <p class="text-pretty">
        Converting HEIC files to PNG can be very beneficial, especially if you
        need to maintain high quality and transparency in your images. PNG is a
        widely used format that supports lossless compression, making it ideal
        for images that require sharp details and transparency, such as logos
        and graphics. Our HEIC to PNG converter makes the process simple and
        efficient, whether you're using an iPhone, Mac, or Windows device. You
        can convert multiple HEIC files to PNG at once, saving time and effort.
        Plus, our service is completely free and processes everything on your
        device, ensuring your data remains private and secure. Whether you're a
        designer needing high-quality images or just want to share your photos
        without losing quality, converting HEIC to PNG is the way to go.
      </p>
    </div>
  `,
  providers: [MessageService],

  imports: [
    PngCardComponent,
    ProgressSpinnerModule,
    ToastModule,
    NgOptimizedImage,
  ],
})
export class PngComponent {
  messageService = inject(MessageService);
  convertService = inject(ConvertService);
  selectedFiles = signal<File[]>([]);
  loading = signal(false);
  imageBlobUrls = signal<ImageBlobUrls[]>([]);
  seoService = inject(SeoService).updateCanonicalUrl("/heic-to-png/")


  constructor() {
    inject(Meta).addTags([
      {
        name: 'description',
        content:
          'HEIC to PNG: Convert HEIC to PNG for high-quality design and web use, with crossplatform compatability and ensuring maximum privacy with local processing',
      },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' },
      {
        property: 'og:title',
        content: 'HEIC to PNG: Convert HEIC to high-quality PNGs for free.',
      },
      {
        property: 'og:description',
        content:
          'HEIC to PNG: Convert HEIC to PNG for high-quality design and web use, with crossplatform compatability and ensuring maximum privacy with local processing',
      },
      {
        property: 'og:image',
        content:
          'https://onlineheicconvert.com/assets/og-image/heic-to-png.png',
      },
      {
        property: 'og:url',
        content: 'https://onlineheicconvert.com/heic-to-png/',
      },
      // <meta name="twitter:image:alt" content="The best language learning chatbot - powered by AI." />
      {
        property: 'twitter:image:alt',
        content: "HEIC to PNG: HEIC Conversion to high quality PNG's for free ",
      },
    ]);
  }

  onFilesChange(event: any) {
    this.selectedFiles.set(Array.from(event.target.files));
    this.convertHeicToPng();
  }

  cancel() {
    this.selectedFiles.set([]);
    this.imageBlobUrls.set([]);
    this.loading.set(false);
  }

  ngOnDestroy() {
    this.cancel();
  }

  async convertHeicToPng() {
    this.loading.set(true);
    try {
      const result = (await this.convertService.convertFiles(
        this.selectedFiles(),
        'image/png'
      )) as ImageBlobUrls[];
      this.imageBlobUrls.set(result);
      this.loading.set(false);
    } catch (error) {
      this.cancel();
      this.messageService.add({
        severity: 'error',
        summary: 'Download Error',
        detail:
          'An error occured while converting. Please try again or report on the contact us form.',
      });
    }
  }

  async downloadAll() {
    try {
      await this.convertService.downloadZip(this.imageBlobUrls());
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Download Error',
        detail: 'An error occured while downloading. Please try again.',
      });
      this.cancel();
    }
  }
}
