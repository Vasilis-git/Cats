import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ImageData } from './ImageData';

@Injectable({ providedIn: 'root' })
export class ImageService {
  readonly images = signal<ImageData[]>([]);

  constructor(private http: HttpClient) {}

  fetchImages() {
    this.http.get<ImageData[]>('https://api.thecatapi.com/v1/images/search?limit=100')
      .subscribe(data => this.images.set(data));
  }

  // Typed accessor so templates get a properly typed ImageData[]
  getImages(): ImageData[] {
    return this.images();
  }
}
