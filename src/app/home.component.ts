import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ImageService } from './image.service';
import { FavoritesService } from './favorites.service';
import { ImageData } from './ImageData';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="container-fluid" style="margin-top:80px">
      <div class="d-inline-block m-1 position-relative" *ngFor="let img of images">
        <img class="img-fluid d-inline-block img-thumbnail" [src]="img.url" [alt]="img.title || 'Image'" />
        <button class="btn btn-sm favorite-btn" [class.favorited]="isFav(img.id)" (click)="toggleFav(img)" title="Toggle favorite">
          <span aria-hidden="true">{{ isFav(img.id) ? '♥' : '♡' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .favorite-btn {
      position: absolute;
      right: 6px;
      bottom: 6px;
      border-radius: 50%;
      padding: 6px 8px;
      background: rgba(255,255,255,0.9);
      border: 1px solid #ddd;
      cursor: pointer;
      font-size: 14px;
    }
    .favorite-btn.favorited {
      color: #e25555;
      background: rgba(255,255,255,1);
    }
  `]
})
export class HomeComponent {
  private imageService = inject(ImageService);
  private favService = inject(FavoritesService);
  get images(): ImageData[] { return this.imageService.getImages(); }
  isFav(id: string) { return this.favService.isFavorite(id); }
  toggleFav(img: ImageData) { this.favService.toggle(img); }
}