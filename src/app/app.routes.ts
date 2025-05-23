import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  // routes WITH layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/messages/messages.component').then(m => m.MessagesComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  },

  // routes WITHOUT layout (auth)
  {
    path: 'auth',
    children: authRoutes
  },

  // catch all
  {
    path: '**',
    redirectTo: '',
  }
];
