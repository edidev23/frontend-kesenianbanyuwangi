import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PembaruanKartuComponent } from './pembaruan-kartu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutsModule } from '../admin/layouts/layouts.module';
import { UtilsModule } from '../utils/utils.module';

const routes: Routes = [
  {
    path: '',
    component: PembaruanKartuComponent,
  },
];

@NgModule({
  declarations: [
    PembaruanKartuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    LayoutsModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule
  ]
})
export class PembaruanKartuModule { }
