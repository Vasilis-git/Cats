import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FavoritesService } from './favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="container-fluid" style="margin-top:80px">
      <h4>Favorites</h4>
      <div *ngIf="favorites.length === 0" class="text-muted">No favorites yet.</div>

      <div class="d-inline-block m-1 position-relative" *ngFor="let img of favorites">
        <img class="img-fluid d-inline-block img-thumbnail" [src]="img.url" [alt]="img.title || 'Image'" />
        <button
          class="btn btn-sm favorite-btn favorited"
          (click)="remove(img.id)"
          title="Remove from favorites"
          aria-label="Remove from favorites"
        >
          ♥
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
      line-height: 1;
    }
    .favorite-btn.favorited {
      color: #e25555;
      background: rgba(255,255,255,1);
    }
  `]
})
export class FavoritesComponent {
  constructor(private fav: FavoritesService) {}
  get favorites() { return this.fav.getFavorites(); }
  remove(id: string) { this.fav.remove(id); }
}