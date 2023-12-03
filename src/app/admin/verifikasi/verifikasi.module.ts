import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifikasiComponent } from './verifikasi.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutsModule } from '../layouts/layouts.module';

const routes: Routes = [
  {
    path: '',
    component: VerifikasiComponent,
  },
];

@NgModule({
  declarations: [VerifikasiComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
  ],
})
export class VerifikasiModule {}
