import { Component, inject, signal } from '@angular/core';
import { JpgCardComponent } from '../components/jpg-card.component';
import { ConvertService } from '../services/convert.service';
import { ImageBlobUrls } from '../interface/image-blob-urls';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Meta } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-jpg',
  standalone: true,
  template: `
    
  `,
  imports: [
    JpgCardComponent,
    ProgressSpinnerModule,
    ToastModule,
    NgOptimizedImage,
  ],
  providers: [MessageService],
})
export class JpgComponent {
  messageService = inject(MessageService);
  convertService = inject(ConvertService);
  selectedFiles = signal<File[]>([]);
  loading = signal(false);
  imageBlobUrls = signal<ImageBlobUrls[]>([]);
  seoService = inject(SeoService).updateCanonicalUrl("/heic-to-jpg/")


  constructor() {
    inject(Meta).addTags([
      {
        name: 'description',
        content:
          'HEIC to JPEG: Quickly convert HEIC files to JPEG for broad compatibility with image editing tools and web usage, ensuring privacy with on-device processing.',
      },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' },
      {
        property: 'og:title',
        content: 'HEIC to JPG: Convert HEIC to high-quality JPGs for free.',
      },
      {
        property: 'og:description',
        content:
          'HEIC to JPEG: Quickly convert HEIC files to JPEG for broad compatibility with image editing tools and web usage, ensuring privacy with on-device processing.',
      },
      {
        property: 'og:image',
        content:
          'https://onlineheicconvert.com/assets/og-image/heic-to-jpg.png',
      },
      {
        property: 'og:url',
        content: 'https://onlineheicconvert.com/heic-to-jpg/',
      },
      // <meta name="twitter:image:alt" content="The best language learning chatbot - powered by AI." />
      {
        property: 'twitter:image:alt',
        content: "HEIC to JPG: HEIC Conversion to high quality JPG's for free ",
      },
    ]);
  }

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
    try {
      const result = (await this.convertService
        .convertFiles(this.selectedFiles(), 'image/jpeg')
        .catch(() => {})) as ImageBlobUrls[];
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
