import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss'],
})
export class ModalDeleteComponent implements OnInit {
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(public modalService: NgbModal) {}

  ngOnInit(): void {}

  close() {
    this.modalService.dismissAll();
  }

  delete() {
    this.emitModal.emit(true);
    this.close();
  }
}
