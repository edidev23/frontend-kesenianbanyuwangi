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
  {
    path: 'admin/homepage',
    loadChildren: () =>
      import('./admin/homepage/homepage.module').then((m) => m.HomepageModule),
  },
  {
    path: 'admin/jenis-kesenian',
    loadChildren: () =>
      import('./admin/jenis-kesenian/jenis-kesenian.module').then(
        (m) => m.JenisKesenianModule
      ),
  },
  {
    path: 'admin/users',
    loadChildren: () =>
      import('./admin/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'admin/verifikasi/:organisasi_id',
    loadChildren: () =>
      import('./admin/verifikasi/verifikasi.module').then(
        (m) => m.VerifikasiModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
