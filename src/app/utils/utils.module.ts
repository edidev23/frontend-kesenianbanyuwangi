import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { ModalMessageComponent } from './modal-message/modal-message.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { PreviewKartuComponent } from './preview-kartu/preview-kartu.component';

@NgModule({
  declarations: [ModalDeleteComponent, ModalMessageComponent, PreviewImageComponent, PreviewKartuComponent],
  imports: [CommonModule],
  exports: [ModalDeleteComponent, ModalMessageComponent],
})
export class UtilsModule {}
