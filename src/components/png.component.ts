import { Component } from "@angular/core";
import { ImageConverterComponent } from "./image-converter.component";
import { ConvertService } from "../services/convert.service";

@Component({ selector: "app-png", standalone: true, imports: [ImageConverterComponent], template: `<app-image-converter format="image/png" label="PNG" />` })
export class PngComponent { static renderProviders = [ConvertService]; }
