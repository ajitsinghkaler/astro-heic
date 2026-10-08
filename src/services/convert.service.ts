import { Injectable } from "@angular/core";
import type { ImageBlobUrls } from "./image-blob-urls";
import JSZip from "jszip";

@Injectable({
  providedIn: "root",
})
export class ConvertService {
  getFormatName(outputFormat: string): string {
    switch (outputFormat) {
      case "image/jpeg":
        return "JPG";
      case "image/webp":
        return "WEBP";
      case "image/png":
        return "PNG";
      default:
        return "image";
    }
  }

  async convertFiles(
    files: File[],
    outputFormat: "image/jpeg" | "image/png" | "image/webp"
  ): Promise<ImageBlobUrls[]> {
    const { heicTo } = await import("heic-to");
    const format = this.getFormatName(outputFormat).toLowerCase();
    const quality = outputFormat === "image/webp" ? 0.8 : 0.92;
    const imageBlobUrls: ImageBlobUrls[] = [];

    try {
      for (const [index, file] of files.entries()) {
        const blob = await heicTo({ blob: file, type: outputFormat, quality });
        imageBlobUrls.push({
          url: URL.createObjectURL(blob),
          name: `image_${index + 1}.${format}`,
        });
      }
    } catch (e) {
      console.error(e);
      imageBlobUrls.forEach(({ url }) => URL.revokeObjectURL(url));
      throw e;
    }
    return imageBlobUrls;
  }

  async downloadZip(imageBlobUrls: ImageBlobUrls[]) {
    const zip = new JSZip();
    const folderName = `images-${Date.now()}`;
    const imageFolder = zip.folder(folderName);

    for (const imageBlobUrl of imageBlobUrls) {
      const response = await fetch(imageBlobUrl.url);
      const blob = await response.blob();
      imageFolder?.file(imageBlobUrl.name, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${folderName}.zip`;
    a.click();
    URL.revokeObjectURL(url); // Revoke the URL for the zip file
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
