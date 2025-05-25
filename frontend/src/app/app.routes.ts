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
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/messages/messages.component').then(
            (m) => m.MessagesComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'terms',
        loadComponent: () =>
          import('./pages/terms/terms.component').then((m) => m.TermsComponent),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/privacy/privacy.component').then(
            (m) => m.PrivacyComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
      {
        path: 'report/lost',
        loadComponent: () =>
          import('./features/report/lost/lost.component').then(
            (m) => m.LostComponent
          ),
      },
      {
        path: 'report/found',
        loadComponent: () =>
          import('./features/report/found/found.component').then(
            (m) => m.FoundComponent
          ),
      },
    ],
  },

  // routes WITHOUT layout (auth)
  {
    path: 'auth',
    children: authRoutes,
  },

  // catch all
  {
    path: '**',
    redirectTo: '',
  },
];
