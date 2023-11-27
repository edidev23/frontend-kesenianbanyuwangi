import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss'],
})
export class ModalMessageComponent implements OnInit {
  @Input() public errorMsg;
  @Input() public errors;

  @Input() public successMsg;
  @Input() public success;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  close() {
    this.modalService.dismissAll();
  }
}
