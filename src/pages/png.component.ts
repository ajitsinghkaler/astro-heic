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
