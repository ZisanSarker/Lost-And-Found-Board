import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UnAuthGuard } from './core/guards/unauth.guard';

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
        path: 'terms',
        loadComponent: () =>
          import('./pages/terms/terms.component').then((m) => m.TermsComponent),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./pages/contact-us/contact-us.component').then((m) => m.ContactUsComponent),
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
        path: 'items',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/home/components/all-posts/all-posts.component').then(
            (m) => m.AllPostsComponent
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
        path: 'help-support',
        loadComponent: () =>
          import('./pages/help-support/help-support.component').then(
            (m) => m.HelpSupportComponent
          ),
      },
      {
        path: 'contact/:id',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
      {
        path: 'repost/:type',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/report/report.component').then(
            (m) => m.ReportPageComponent
          ),
      },
      {
        path: 'edit-item/:id',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/edit-item/edit-item.component').then(
            (m) => m.EditItemComponent
          ),
      },
      {
        path: 'item-detail/:id',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/item-datail/item-datail.component').then(
            (m) => m.ItemDetailsComponent
          ),
      }
    ],
  },
  // catch all - redirect unauthenticated users to sign-in
  {
    path: '**',
    redirectTo: 'auth/sign-in',
  },
];