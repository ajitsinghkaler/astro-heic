import { Component, inject, signal } from '@angular/core';
import { WebpCardComponent } from '../components/webp-card.component';
import { ConvertService } from '../services/convert.service';
import { ImageBlobUrls } from '../interface/image-blob-urls';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Meta } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-webp',
  standalone: true,
  template: `
    
  `,
  providers: [MessageService],

  imports: [
    WebpCardComponent,
    ProgressSpinnerModule,
    ToastModule,
    NgOptimizedImage,
  ],
})
export class WebpComponent {
  messageService = inject(MessageService);
  convertService = inject(ConvertService);
  selectedFiles = signal<File[]>([]);
  seoService = inject(SeoService).updateCanonicalUrl("/heic-to-webp/")

  loading = signal(false);
  imageBlobUrls = signal<ImageBlobUrls[]>([]);

  constructor() {
    inject(Meta).addTags([
      {
        name: 'description',
        content:
          'HEIC to WebP: Optimize your images by converting HEIC files to WebP format, ensuring faster loading times and reduced file sizes, directly on your device.',
      },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' },
      {
        property: 'og:title',
        content: 'HEIC to WEBP: Convert HEIC to high-quality WEBPs for free.',
      },
      {
        property: 'og:description',
        content:
          'HEIC to WebP: Optimize your images by converting HEIC files to WebP format, ensuring faster loading times and reduced file sizes, directly on your device.',
      },
      {
        property: 'og:image',
        content:
          'https://onlineheicconvert.com/assets/og-image/heic-to-webp.png',
      },
      {
        property: 'og:url',
        content: 'https://onlineheicconvert.com/heic-to-webp',
      },
      // <meta name="twitter:image:alt" content="The best language learning chatbot - powered by AI." />
      {
        property: 'twitter:image:alt',
        content:
          "HEIC to WEBP: HEIC Conversion to high quality WEBP's for free ",
      },
    ]);
  }

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
        'image/webp'
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
