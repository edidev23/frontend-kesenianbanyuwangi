import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrasiComponent } from './registrasi.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutsModule } from '../admin/layouts/layouts.module';
import { ModalAnggotaComponent } from './modal-anggota/modal-anggota.component';
import { ModalInventarisComponent } from './modal-inventaris/modal-inventaris.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrasiComponent,
  },
];


@NgModule({
  declarations: [
    RegistrasiComponent,
    ModalAnggotaComponent,
    ModalInventarisComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    LayoutsModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class RegistrasiModule { }
