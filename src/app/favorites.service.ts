import { Injectable, signal } from '@angular/core';
import { ImageData } from './ImageData';

const STORAGE_KEY = 'cats:favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favorites = signal<ImageData[]>(this.load());

  private load(): ImageData[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(list: ImageData[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch { /* ignore */ }
  }

  getFavorites(): ImageData[] {
    return this.favorites();
  }

  isFavorite(id: string): boolean {
    return this.favorites().some(i => i.id === id);
  }

  add(img: ImageData) {
    if (!this.isFavorite(img.id)) {
      const next = [...this.favorites(), img];
      this.favorites.set(next);
      this.save(next);
    }
  }

  remove(id: string) {
    const next = this.favorites().filter(i => i.id !== id);
    this.favorites.set(next);
    this.save(next);
  }

  toggle(img: ImageData) {
    this.isFavorite(img.id) ? this.remove(img.id) : this.add(img);
  }
}