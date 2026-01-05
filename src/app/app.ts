import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageService } from './image.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  template: `
      <main>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </head>
        <body>

          <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top shadow">
            <div class="container-fluid">
                <span class="navbar-text collapse navbar-collapse flex-grow-0 ms-0 me-auto">Cats</span>
                <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar-content" 
                 title="Toggle navigation">  <span class="navbar-toggler-icon"></span> </button>
                <form class="d-flex ms-2 me-1 flex-grow-1">
                    <input class="form-control me-2 flex-grow-1" type="text" placeholder="Search...">
                    <button type="button" class="btn btn-primary">Search</button>
                </form>
                <div class="collapse navbar-collapse flex-grow-0" id="navbar-content">
                    <ul class="navbar-nav">
                        <li class="nav-item"> <a class="nav-link" href="#">Favorites</a></li>
                    </ul>
                </div>
            </div>
          </nav>

          <div class="container-fluid" style="margin-top:80px">
            <img class="img-fluid m-1" *ngFor="let img of imageService.getImages()" [src]="img.url" [alt]="img.title || 'Image'" />
          </div>
        </body>
      </main>
  `,
  styleUrl: './app.css',
})
export class App {
  readonly imageService = inject(ImageService); 
  constructor() { 
    this.imageService.fetchImages();
  }
}
