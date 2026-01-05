import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { FavoritesComponent } from './favorites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];
