import { Injectable } from "@angular/core";
import type { ImageBlobUrls } from "./image-blob-urls";
import JSZip from "jszip";
import { fittedDimensions, outputFilename, type ConversionOptions, type ImageFormat } from "./conversion-options";

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
    outputFormat: ImageFormat,
    options: ConversionOptions = {},
  ): Promise<ImageBlobUrls[]> {
    if (!files.length) throw new Error("Choose at least one HEIC photo");
    const quality = options.quality ?? (outputFormat === "image/webp" ? 0.8 : 0.92);
    const maxEdge = options.maxEdge ?? 0;
    if (!Number.isFinite(quality) || quality < 0.1 || quality > 1) throw new Error("Choose a quality setting between 10 and 100");
    if (!Number.isInteger(maxEdge) || maxEdge < 0 || maxEdge > 10000) throw new Error("Choose a longest edge between 1 and 10000 pixels, or original size");
    const { heicTo } = await import("heic-to");
    const format = this.getFormatName(outputFormat).toLowerCase();
    const imageBlobUrls: ImageBlobUrls[] = [];
    const usedNames = new Set<string>();
    let currentFile = "";

    try {
      for (const [index, file] of files.entries()) {
        currentFile = file.name;
        // Decode to PNG first so resizing does not introduce an extra lossy encode.
        const decoded = await heicTo({ blob: file, type: "image/png" });
        const image = await this.loadImage(decoded);
        const { width, height } = fittedDimensions(image.naturalWidth, image.naturalHeight, maxEdge);
        let blob = decoded;
        if (outputFormat !== "image/png" || width !== image.naturalWidth || height !== image.naturalHeight) {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Your browser could not prepare the image");
          context.drawImage(image, 0, 0, width, height);
          blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(result => result && result.type === outputFormat ? resolve(result) : reject(new Error("Your browser could not encode this image format")), outputFormat, quality);
          });
        }
        imageBlobUrls.push({
          url: URL.createObjectURL(blob),
          name: outputFilename(file.name, format, usedNames),
          sourceName: file.name,
          size: blob.size,
          width,
          height,
        });
        options.onProgress?.(index + 1, files.length);
      }
    } catch (e) {
      console.error(e);
      imageBlobUrls.forEach(({ url }) => URL.revokeObjectURL(url));
      throw new Error(`Could not convert “${currentFile}”. Try a complete HEIC photo or a smaller batch. This HEIC variant may not be supported.`);
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
      imageFolder?.file(imageBlobUrl.name, await blob.arrayBuffer());
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${folderName}.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private async loadImage(blob: Blob): Promise<HTMLImageElement> {
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not open the decoded photo")); };
      image.src = url;
    });
  }
}
