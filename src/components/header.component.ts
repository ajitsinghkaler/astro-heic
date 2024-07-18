import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    
  `,
  imports: [NgOptimizedImage, MenuModule],
})
export class HeaderComponent {
  items = [
    { label: 'HEIC to PDF', routerLink: '/heic-to-pdf' },
    { label: 'HEIC to JPG', routerLink: '/heic-to-jpg' },
    { label: 'HEIC to PNG', routerLink: '/heic-to-png' },
    { label: 'HEIC to WEBP', routerLink: '/heic-to-webp' },
  ];
}
