import { Component } from "@angular/core";
import { ImageConverterComponent } from "./image-converter.component";
import { ConvertService } from "../services/convert.service";

@Component({ selector: "app-webp", standalone: true, imports: [ImageConverterComponent], template: `<app-image-converter format="image/webp" label="WebP" [initialQuality]="80" />` })
export class WebpComponent { static renderProviders = [ConvertService]; }
