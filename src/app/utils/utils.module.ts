import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { ModalMessageComponent } from './modal-message/modal-message.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { PreviewKartuComponent } from './preview-kartu/preview-kartu.component';
import { DateAgoPipe } from './date-ago.pipe';

@NgModule({
  declarations: [
    ModalDeleteComponent,
    ModalMessageComponent,
    PreviewImageComponent,
    PreviewKartuComponent,
    DateAgoPipe,
  ],
  imports: [CommonModule],
  exports: [ModalDeleteComponent, ModalMessageComponent, DateAgoPipe],
})
export class UtilsModule {}
