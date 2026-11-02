import { Injectable } from "@angular/core";
import { jsPDF } from "jspdf";

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
  async convertToPdf(files: File[]): Promise<string> {
    if (!files.length) {
      throw new Error("Select at least one HEIC photo");
    }
    const { heicTo } = await import("heic-to");
    const pdf = new jsPDF();
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
      const pageWidth = img.width * (72 / 96);
      const pageHeight = img.height * (72 / 96);
      const orientation = pageWidth > pageHeight ? "landscape" : "portrait";
      if (index === 0) pdf.deletePage(1);
      pdf.addPage([pageWidth, pageHeight], orientation);
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    }
    const pdfBlob = pdf.output("blob");
    return URL.createObjectURL(pdfBlob);
  }
}
