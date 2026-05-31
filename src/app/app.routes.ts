import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/denuncias/crear',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'ping',
    loadComponent: () => import('./ping-test/ping-test.component')
      .then(m => m.PingTestComponent)
  },
  {
    path: 'denuncias',
    children: [
      {
        path: 'crear',
        loadComponent: () => import('./modules/denuncias/components/crear-denuncia/crear-denuncia.component')
          .then(m => m.CrearDenunciaComponent)
      },
      {
        path: 'consultar',
        loadComponent: () => import('./modules/denuncias/components/consultar-denuncia/consultar-denuncia.component')
          .then(m => m.ConsultarDenunciaComponent)
      },
      {
        path: 'acuse-recibo',
        loadComponent: () => import('./modules/denuncias/components/acuse-recibo/acuse-recibo.component')
          .then(m => m.AcuseReciboComponent)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/denuncias/components/dashboard-admin/dashboard-admin.component')
          .then(m => m.DashboardAdminComponent)
      }
    ]
  }
];
