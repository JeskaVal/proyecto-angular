import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/denuncias/crear',
    pathMatch: 'full'
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
        loadComponent: () => import('./modules/denuncias/components/dashboard-admin/dashboard-admin.component')
          .then(m => m.DashboardAdminComponent)
      }
    ]
  }
];
