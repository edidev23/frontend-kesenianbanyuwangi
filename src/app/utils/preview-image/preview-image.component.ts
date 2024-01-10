import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})
export class PreviewImageComponent implements OnInit {

  @Input() public dataOrganisasi;
  @Input() public dataDocuments;
  
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    console.log(this.dataOrganisasi)
  }

  close() {
    this.modalService.dismissAll();
  }

  getFotoKetua() {
    if (this.dataDocuments) {
      let pasfoto = this.dataDocuments.find((d) => d.tipe == 'PAS-FOTO');

      if (pasfoto) {
        return `${environment.url}uploads/organisasi/${pasfoto.organisasi_id}/${pasfoto.image}`;
      } else {
        return '';
      }
    }
  }

  getTanggalBefore(date) {
    const currentDate = moment(date);
    const dateAfterTwoYears = currentDate.subtract(2, 'years');
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

  checkExpired(date) {
    const tanggalSekarang = moment();
    const tanggalInput = moment(date);

    if (tanggalSekarang.isBefore(tanggalInput)) {
      return false;
    } else {
      // console.log(
      //   'Tanggal sekarang lebih besar atau sama dengan tanggal yang dimasukkan.'
      // );
      const selisihHari = tanggalInput.diff(tanggalSekarang, 'days');
      // console.log(`Selisih dalam hari: ${selisihHari} hari`);

      return Math.abs(selisihHari);
    }
  }

}
