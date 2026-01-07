import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ImageService } from './image.service';
import { ImageFocusOverlayComponent } from './image-focus-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ImageFocusOverlayComponent],
  template: `
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </head>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top shadow">
      <div class="container-fluid" id="navbar-content">  
        <ul class="navbar-nav flex-row flex-nowrap mx-auto gap-3">
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/']">Cats</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/favorites']">Favorites</a>
          </li>
        </ul>
      </div>
    </nav>

    <main class="container-fluid" style="margin-top:80px">
      <router-outlet></router-outlet>
    </main>

    <!-- global overlay for focusing images -->
    <app-image-focus-overlay></app-image-focus-overlay>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  readonly imageService = inject(ImageService);

  constructor() {
    // keep fetching at app start so HomeComponent can display images immediately
    this.imageService.fetchImages();
  }
}
