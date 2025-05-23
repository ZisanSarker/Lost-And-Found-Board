// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full',
  },
];
