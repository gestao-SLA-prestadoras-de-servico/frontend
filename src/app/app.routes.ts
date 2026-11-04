import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { ACCESS_ROUTES } from './features/access/access.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Landing },
  ...ACCESS_ROUTES,
];
