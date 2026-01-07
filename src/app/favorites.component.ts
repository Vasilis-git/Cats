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
        <img
          class="img-fluid d-inline-block img-thumbnail focusable-img"
          [src]="img.url"
          [alt]="img.title || 'Image'"
        />
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

    /* make images feel interactive */
    .focusable-img {
      cursor: pointer;
      transition: transform 200ms ease, box-shadow 200ms ease;
    }
    .focusable-img:hover {
      transform: scale(1.04);
    }
    .focusable-img:active {
      transform: scale(0.98);
    }
    .focusable-img:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
    }
  `]
})
export class FavoritesComponent {
  constructor(private fav: FavoritesService) {}
  get favorites() { return this.fav.getFavorites(); }
  remove(id: string) { this.fav.remove(id); }
}