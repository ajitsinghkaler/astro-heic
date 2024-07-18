import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ImageBlobUrls } from '../interface/image-blob-urls';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root',
})
export class ConvertService {
  getFormatName(outputFormat: string): string {
    switch (outputFormat) {
      case 'image/jpeg':
        return 'JPG';
      case 'image/webp':
        return 'WEBP';
      case 'image/png':
        return 'PNG';
      default:
        return 'image';
    }
  }

  async convertFiles(
    files: File[],
    outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'doc/pdf'
  ): Promise<ImageBlobUrls[] | string | void> {
    try {
      const heic2any = (await import('heic2any')).default;
      if (outputFormat === 'doc/pdf') {
        return await this.convertToPdf(heic2any, files);
      } else if (outputFormat === 'image/webp') {
        return await this.convertToWebp(heic2any, files);
      } else {
        return await this.convertToImages(heic2any, outputFormat, files);
      }
    } catch (e) {
      console.error(e);
      alert(`Failed to convert HEIC to ${this.getFormatName(outputFormat)}.`);
      
    }
  }

  private async convertToPdf(heic2any: any, files: File[]): Promise<string> {
    const pdf = new jsPDF();
    const imagePromises = files.map((file, index) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const blob = await heic2any({ blob: file, toType: 'image/jpeg' });
          const imgData = await this.blobToDataUrl(blob as Blob);
          const img = new Image();
          img.onload = () => {
            // Calculate dimensions from pixels to points
            const pageWidth = img.width * (72 / 96); // convert pixels to points
            const pageHeight = img.height * (72 / 96);

            let orientation: 'portrait' | 'landscape' = 'portrait';

            if (pageWidth > pageHeight) {
              orientation = 'landscape';
            }
            // Remove the auto-created empty page
            if (index === 0) {
              pdf.deletePage(1);
            }

            // Add a new page with the image dimensions
            pdf.addPage([pageWidth, pageHeight], orientation);

            // Add the image to the new page at its original size
            pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
            resolve();
          };
          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };
          img.src = imgData;
        } catch (error) {
          reject(error);
        }
      });
    });

    // Wait for all images to be processed and added to the PDF
    await Promise.all(imagePromises);
    const pdfBlob = pdf.output('blob');
    return URL.createObjectURL(pdfBlob);
  }

  private async convertToImages(
    heic2any: any,
    outputFormat: 'image/jpeg' | 'image/png',
    files: File[]
  ): Promise<ImageBlobUrls[]> {
    const imageBlobUrls: ImageBlobUrls[] = [];

    for (const file of files) {
      const blob = await heic2any({ blob: file, toType: outputFormat });
      const imageBlobUrl = URL.createObjectURL(blob as Blob);
      const format = this.getFormatName(outputFormat).toLowerCase();
      const name = `image_${files.indexOf(file) + 1}.${format}`;
      imageBlobUrls.push({ url: imageBlobUrl, name });
    }
    return imageBlobUrls;
  }

  async downloadZip(imageBlobUrls: ImageBlobUrls[]) {
    const zip = new JSZip();
    const folderName  =`images-${Date.now()}`
    const imageFolder = zip.folder(folderName);
  
    for (const imageBlobUrl of imageBlobUrls) {
      const response = await fetch(imageBlobUrl.url);
      const blob = await response.blob();
      imageFolder?.file(imageBlobUrl.name, blob);
    }
  
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}.zip`;
    a.click();
    URL.revokeObjectURL(url); // Revoke the URL for the zip file
  }
  

  private async convertToWebp(
    heic2any: any,
    files: File[]
  ): Promise<ImageBlobUrls[]> {
    const imageBlobPromises = files.map((file) => {
      return new Promise<ImageBlobUrls>((resolve, reject) => {
        heic2any({ blob: file, toType: 'image/png' })
          .then((blob: Blob) => {
            const imageBlobUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0);
              canvas.toBlob(
                (blob: Blob | null) => {
                  if (blob) {
                    const webpUrl = URL.createObjectURL(blob);
                    resolve({
                      url: webpUrl,
                      name: `image_${files.indexOf(file) + 1}.webp`,
                    });
                  } else {
                    reject(new Error('Blob conversion failed'));
                  }
                },
                'image/webp',
                0.8
              );
            };
            img.onerror = reject;
            img.src = imageBlobUrl;
          })
          .catch(reject);
      });
    });

    const imageBlobUrls = await Promise.all(imageBlobPromises);
    return imageBlobUrls;
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
}
