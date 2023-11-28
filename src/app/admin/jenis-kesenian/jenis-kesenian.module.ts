import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JenisKesenianComponent } from './jenis-kesenian.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutsModule } from '../layouts/layouts.module';
import { ModalJenisKesenianComponent } from './modal-jenis-kesenian/modal-jenis-kesenian.component';

const routes: Routes = [
  {
    path: '',
    component: JenisKesenianComponent,
  },
];

@NgModule({
  declarations: [JenisKesenianComponent, ModalJenisKesenianComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
  ],
})
export class JenisKesenianModule {}
