import { Component, inject, signal } from '@angular/core';
import { PdfCardComponent } from '../components/pdf-card.component';
import { ConvertService } from '../services/convert.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Meta } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-pdf',
  standalone: true,
  template: `
    <p-toast />
    <h1 class="text-center font-bold text-4xl mt-12 mb-8">
      Convert HEIC to PDF
    </h1>
    
    <div class="mt-20">
      <h2 class="text-2xl font-bold mb-8 text-center">HEIC to PDF Features</h2>
      <ul class="space-y-4">
        <li>
          <strong>HEIC to PDF Converter:</strong> Easily convert your HEIC files
          directly to PDF.
        </li>
        <li>
          <strong>Convert HEIC File to PDF:</strong> Transform any HEIC file
          into a PDF document with a simple click.
        </li>
        <li>
          <strong>Multiple HEIC to PDF:</strong> Convert multiple HEIC images
          into a single PDF files.
        </li>
        <li>
          <strong>Free:</strong> Use our service for free without any cost.
        </li>
        <li>
          <strong>Compatability:</strong> Directly convert HEIC files to PDF
          right from your iPhone, android, mac etc.
        </li>
        <li>
          <strong>Secure:</strong>To ensure your data stays private with all
          conversions processed on your device—no uploads to external servers.
        </li>
      </ul>
    </div>
    <div class="my-20">
      <h2 class="text-2xl font-bold mb-8 text-center text-pretty">
        Why Convert HEIC to PDF
      </h2>
      <p class="text-pretty">
        Converting HEIC files to PDF is beneficial for several reasons. PDF is a
        widely accepted format that ensures your images can be viewed and shared
        across all devices and platforms. Using our converter, you can
        effortlessly change HEIC files to PDF with just a few clicks. This
        process helps you maintain the quality of your images while making them
        more accessible. Our tool also supports batch conversions and merging
        multiple HEIC files into a single PDF, which can save you a lot of time.
        Best of all, our service is completely free and operates securely on
        your device, ensuring your data remains private. Whether you are using
        an iPhone or a Mac, converting your HEIC files to PDF has never been
        easier or more secure.
      </p>
    </div>
  `,
  providers: [MessageService],

  imports: [
    PdfCardComponent,
    ProgressSpinnerModule,
    ToastModule,
    NgOptimizedImage,
  ],
})
export class PdfComponent {
  messageService = inject(MessageService);
  convertService = inject(ConvertService);
  selectedFiles = signal<File[]>([]);
  loading = signal(false);
  pdfBlobUrl = signal<string>('');
  seoService = inject(SeoService).updateCanonicalUrl("/heic-to-pdf/")


  constructor() {
    inject(Meta).addTags([
      {
        name: 'description',
        content:
          'HEIC to PDF: Convert your HEIC images into PDF documents directly on your device, for sharing with max people and perfect compatibility across all platforms.',
      },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' },
      {
        property: 'og:title',
        content: 'HEIC to PDF: Convert HEIC to high-quality PDFs for free.',
      },
      {
        property: 'og:description',
        content:
          'HEIC to PDF: Convert your HEIC images into PDF documents directly on your device, for sharing with max people and perfect compatibility across all platforms.',
      },
      {
        property: 'og:image',
        content:
          'https://onlineheicconvert.com/assets/og-image/heic-to-pdf.png',
      },
      {
        property: 'og:url',
        content: 'https://onlineheicconvert.com/heic-to-pdf/',
      },
      // <meta name="twitter:image:alt" content="The best language learning chatbot - powered by AI." />
      {
        property: 'twitter:image:alt',
        content: "HEIC to PDF: HEIC Conversion to high quality PDF's for free ",
      },
    ]);
  }

  onFilesChange(event: any) {
    this.selectedFiles.set(Array.from(event.target.files));
    this.convertHeicToPdf();
  }

  cancel() {
    this.selectedFiles.set([]);
    this.pdfBlobUrl.set('');
    this.loading.set(false);
  }


  ngOnDestroy() {
    this.cancel();
  }

  async convertHeicToPdf() {
    this.loading.set(true);
    try {
      const result = (await this.convertService.convertFiles(
        this.selectedFiles(),
        'doc/pdf'
      )) as string;
      this.pdfBlobUrl.set(result);
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
}
