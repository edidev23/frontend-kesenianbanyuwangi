import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ApiService } from 'src/app/api.service';
import { ModalMessageComponent } from 'src/app/utils/modal-message/modal-message.component';

@Component({
  selector: 'app-modal-check-kartu',
  templateUrl: './modal-check-kartu.component.html',
  styleUrls: ['./modal-check-kartu.component.scss'],
})
export class ModalCheckKartuComponent implements OnInit {
  errorMsg: string;
  isLoading: boolean = false;

  nomor_induk: string;
  nama_ketua: string;

  organisasi: any;
  userID: string = '';

  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public modalService: NgbModal,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let dataStorage = JSON.parse(localStorage.getItem('users'));
    this.userID = dataStorage ? dataStorage.id : '';

    if (!this.userID) {
      this.close();
    }
  }

  close() {
    this.modalService.dismissAll();
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

  save() {
    if (this.checkExpired(this.organisasi.tanggal_expired)) {
      this.isLoading = true;
      this.organisasi.user_id = this.userID;
      this.organisasi.status = null;

      this.apiService.saveOrganisasi(this.organisasi).subscribe(
        (res) => {
          if (res) {
            this.isLoading = false;
            this.close();

            this.router.navigateByUrl('/registrasi');
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = true;
      this.organisasi.user_id = this.userID;

      this.apiService.saveOrganisasi(this.organisasi).subscribe(
        (res) => {
          if (res) {
            this.isLoading = false;
            this.close();

            this.router.navigateByUrl('/pembaruan-kartu');
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
    }
  }

  check() {
    this.isLoading = true;
    let data = {
      nomor_induk: this.nomor_induk,
      nama_ketua: this.nama_ketua,
    };
    this.apiService.checkOrganisasi(data).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = false;
          this.organisasi = res.data;
        }
      },
      (err) => {
        this.isLoading = false;
        const modalRef = this.modalService.open(ModalMessageComponent, {
          centered: true,
          size: 'md',
        });
        modalRef.componentInstance.errorMsg = 'Data Tidak ditemukan';
      }
    );
  }
}
