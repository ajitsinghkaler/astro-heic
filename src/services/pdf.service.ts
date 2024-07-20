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
    const heic2any = (await import("heic2any")).default;
    const pdf = new jsPDF();
    const imagePromises = files.map((file, index) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const blob = await heic2any({ blob: file, toType: "image/jpeg" });
          const imgData = await this.blobToDataUrl(blob as Blob);
          const img = new Image();
          img.onload = () => {
            // Calculate dimensions from pixels to points
            const pageWidth = img.width * (72 / 96); // convert pixels to points
            const pageHeight = img.height * (72 / 96);

            let orientation: "portrait" | "landscape" = "portrait";

            if (pageWidth > pageHeight) {
              orientation = "landscape";
            }
            // Remove the auto-created empty page
            if (index === 0) {
              pdf.deletePage(1);
            }

            // Add a new page with the image dimensions
            pdf.addPage([pageWidth, pageHeight], orientation);

            // Add the image to the new page at its original size
            pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
            resolve();
          };
          img.onerror = () => {
            reject(new Error("Failed to load image"));
          };
          img.src = imgData;
        } catch (error) {
          reject(error);
        }
      });
    });

    // Wait for all images to be processed and added to the PDF
    await Promise.all(imagePromises);
    const pdfBlob = pdf.output("blob");
    return URL.createObjectURL(pdfBlob);
  }
}
