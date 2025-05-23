import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'auth', children: authRoutes },
      // other routes
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
