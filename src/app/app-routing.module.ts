import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  // {
  //   path: 'homepage',
  //   component: HomepageComponent,
  // },
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
