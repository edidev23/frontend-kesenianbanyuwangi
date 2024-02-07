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

  tanggal_cetak_kartu: string;
  tanggal_expired: string;
  tanggal_cetak_kartu_format: string;

  constructor(public modalService: NgbModal) {}

  ngOnInit(): void {
    if (this.detail) {
      this.generateDate(this.detail.tanggal_cetak_kartu);
    }
  }

  generateDate(dateSpesific) {
    if (dateSpesific) {
      let currentDate = moment(dateSpesific);
      let futureDate = currentDate.add(2, 'years');

      const isCurrentDateAfterSpecificDate = moment().isAfter(futureDate);

      if (isCurrentDateAfterSpecificDate) {
        // tanggal sekarang lebih besar tanggal expired
        this.generateDate(futureDate);
      } else {
        // tanggal expired lebih besar dari sekarang
        let date = {
          tanggal_cetak_kartu: moment(dateSpesific).format('DD-MM-YYYY'),
          tanggal_expired: moment(futureDate).format('DD-MM-YYYY'),
        };
        this.tanggal_cetak_kartu = date.tanggal_cetak_kartu;
        this.tanggal_expired = date.tanggal_expired;

        this.tanggal_cetak_kartu_format =
          moment(dateSpesific).format('YYYY-MM-DD');
      }
    } else {
      let currentDate = moment();
      let futureDate = currentDate.add(2, 'years');

      let date = {
        tanggal_cetak_kartu: moment(currentDate).format('DD-MM-YYYY'),
        tanggal_expired: moment(futureDate).format('DD-MM-YYYY'),
      };

      this.tanggal_cetak_kartu = date.tanggal_cetak_kartu;
      this.tanggal_expired = date.tanggal_expired;

      this.tanggal_cetak_kartu_format =
        moment(dateSpesific).format('YYYY-MM-DD');
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  save() {
    let data = {
      tanggal_cetak_kartu: this.tanggal_cetak_kartu_format,
    };
    this.emitModal.emit(data);
    this.close();
  }

  formatDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }
}
