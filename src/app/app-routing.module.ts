import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageKikComponent } from './homepage-kik/homepage-kik.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'homepage',
    component: HomepageKikComponent,
  },
  {
    path: 'registrasi',
    loadChildren: () =>
      import('./registrasi/registrasi.module').then((m) => m.RegistrasiModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
