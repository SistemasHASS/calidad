import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { LayoutComponent } from './modules/main/pages/layout/layout.component';
import { ParametrosComponent } from './modules/main/pages/parametros/parametros.component';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { BusquedaComponent } from './modules/main/pages/busqueda/busqueda.component';
import { PostulantesComponent } from './modules/main/pages/postulantes/postulantes.component';

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
      { path: 'busqueda', component: BusquedaComponent },
      { path: 'postulantes', component: PostulantesComponent },
      { path: '**', redirectTo: 'auth/login' },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '404',
  }
];
