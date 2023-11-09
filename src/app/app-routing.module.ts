import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
