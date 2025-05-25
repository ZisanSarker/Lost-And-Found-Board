import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './features/auth/auth.guard';
import { UnAuthGuard } from './features/auth/unauth.guard';

export const routes: Routes = [
  // Auth routes outside Layout (no AuthGuard needed here)
  {
    path: 'auth/sign-in',
    canActivate: [UnAuthGuard],
    loadComponent: () =>
      import('./features/auth/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'auth/sign-up',
    canActivate: [UnAuthGuard],
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  // Main app routes inside LayoutComponent
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
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'messages',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/messages/messages.component').then(
            (m) => m.MessagesComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/report/lost/lost.component').then(
            (m) => m.LostComponent
          ),
      },
      {
        path: 'report/found',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/report/found/found.component').then(
            (m) => m.FoundComponent
          ),
      },
    ],
  },
  // catch all - redirect unauthenticated users to sign-in
  {
    path: '**',
    redirectTo: 'auth/sign-in',
  },
];