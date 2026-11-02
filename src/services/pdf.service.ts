import { Injectable } from "@angular/core";
import { jsPDF } from "jspdf";

export type PdfPageSize = "photo" | "a4" | "letter";
export interface PdfOptions {
  pageSize?: PdfPageSize;
  onProgress?: (completed: number, total: number) => void;
}

@Injectable({
  providedIn: "root",
})
export class PdfService {
  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  async convertToPdf(files: File[], options: PdfOptions = {}): Promise<string> {
    if (!files.length) {
      throw new Error("Select at least one HEIC photo");
    }
    const pageSize = options.pageSize ?? "photo";
    if (!["photo", "a4", "letter"].includes(pageSize)) throw new Error("Choose a supported PDF page size");
    const { heicTo } = await import("heic-to");
    const pdf = new jsPDF({ unit: "pt" });
    // Decode and append sequentially so completion timing cannot reorder pages.
    for (const [index, file] of files.entries()) {
      const blob = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
      const imgData = await this.blobToDataUrl(blob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imgData;
      });
      const photoWidth = img.width * (72 / 96);
      const photoHeight = img.height * (72 / 96);
      const pageWidth = pageSize === "a4" ? 595.28 : pageSize === "letter" ? 612 : photoWidth;
      const pageHeight = pageSize === "a4" ? 841.89 : pageSize === "letter" ? 792 : photoHeight;
      const orientation = pageWidth > pageHeight ? "landscape" : "portrait";
      if (index === 0) pdf.deletePage(1);
      pdf.addPage([pageWidth, pageHeight], orientation);
      const margin = pageSize === "photo" ? 0 : 24;
      const scale = Math.min((pageWidth - 2 * margin) / photoWidth, (pageHeight - 2 * margin) / photoHeight);
      const imageWidth = photoWidth * scale;
      const imageHeight = photoHeight * scale;
      pdf.addImage(imgData, "JPEG", (pageWidth - imageWidth) / 2, (pageHeight - imageHeight) / 2, imageWidth, imageHeight);
      options.onProgress?.(index + 1, files.length);
    }
    const pdfBlob = pdf.output("blob");
    return URL.createObjectURL(pdfBlob);
  }
}
