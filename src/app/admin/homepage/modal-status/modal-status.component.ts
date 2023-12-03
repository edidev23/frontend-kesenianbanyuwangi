import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrls: ['./modal-status.component.scss'],
})
export class ModalStatusComponent implements OnInit {
  isLoading: boolean;

  @Input() detail: any;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(public modalService: NgbModal) {}

  ngOnInit(): void {
    console.log(this.detail);
  }

  close() {
    this.modalService.dismissAll();
  }

  save() {
    this.emitModal.emit(true);
    this.close();
  }

  updateTanggal(date) {
    const currentDate = moment(date);
    const dateAfterTwoYears = currentDate.add(2, 'years');
    const formattedDate = dateAfterTwoYears.format('YYYY-MM-DD');

    return this.formatDate(formattedDate);
  }

  formatDate(date) {
    const currentDate = new Date(date);

    const options: any = {
      // weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      // hour12: false, // Use 24-hour format
      timeZone: 'Asia/Jakarta', // Set the time zone to Indonesia (Jakarta)
    };

    const formattedDate = currentDate.toLocaleString('id-ID', options);
    return formattedDate;
  }
}
