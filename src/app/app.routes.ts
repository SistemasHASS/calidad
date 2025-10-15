import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { LayoutComponent } from './modules/main/pages/layout/layout.component';
import { ParametrosComponent } from './modules/main/pages/parametros/parametros.component';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { CalidadCampoComponent } from './modules/main/pages/calidad-campo/calidad-campo.component';
import { CalidadPlantaComponent } from './modules/main/pages/calidad-planta/calidad-planta.component';
import { CalidadAseguramientoComponent } from './modules/main/pages/calidad-aseguramiento/calidad-aseguramiento.component';
import { ReporteSemanalComponent } from './modules/main/pages/reporte-semanal/reporte-semanal.component';
import { CalidadAdministradorComponent } from './modules/main/pages/calidad-administrador/calidad-administrador.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: LayoutComponent,
    children: [
      { path: 'parametros', component: ParametrosComponent },
      { path: 'calidad-campo', component: CalidadCampoComponent },
      { path: 'calidad-planta', component: CalidadPlantaComponent },
      { path: 'calidad-aseguramiento', component: CalidadAseguramientoComponent },
      { path: 'reporte-calidad', component: ReporteSemanalComponent },
      { path: 'calidad-administrador', component: CalidadAdministradorComponent },
      { path: '**', redirectTo: 'auth/login' },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '404',
  }
];
