import { Component } from "@angular/core";
import { ImageConverterComponent } from "./image-converter.component";
import { ConvertService } from "../services/convert.service";

@Component({ selector: "app-jpg", standalone: true, imports: [ImageConverterComponent], template: `<app-image-converter format="image/jpeg" label="JPG" [initialQuality]="92" />` })
export class JpgComponent { static renderProviders = [ConvertService]; }
