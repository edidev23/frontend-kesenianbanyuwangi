import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { ModalMessageComponent } from './modal-message/modal-message.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';

@NgModule({
  declarations: [ModalDeleteComponent, ModalMessageComponent, PreviewImageComponent],
  imports: [CommonModule],
  exports: [ModalDeleteComponent, ModalMessageComponent],
})
export class UtilsModule {}
