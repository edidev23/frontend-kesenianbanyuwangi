import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faPen,
  faSignInAlt,
  faSyncAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalStatusComponent } from './modal-status/modal-status.component';
import { ModalMessageComponent } from 'src/app/utils/modal-message/modal-message.component';
import * as moment from 'moment';
import { ModalDeleteComponent } from 'src/app/utils/modal-delete/modal-delete.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  isLoading: boolean;

  userID: string;
  role: string;

  dataKesenian: any;

  faPencil = faPen;
  faUpdate = faSyncAlt;
  faDelete = faTrash;

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    let resp = await this.authService.getToken();

    if (!resp) {
      this.router.navigateByUrl('/login');
    } else {
      let dataStorage = JSON.parse(localStorage.getItem('users'));
      this.userID = dataStorage ? dataStorage.id : '';

      if (this.userID) {
        this.role = dataStorage.role;

        if (this.role == 'user-kik') {
          this.router.navigateByUrl('/homepage');
        } else if (this.role == 'admin') {
          this.getData();
        }
      }
    }
  }

  getData() {
    this.apiService.getOrganisasiList().subscribe((res: any) => {
      if (res) {
        this.dataKesenian = res.data
          .filter(
            (d) =>
              d.status == 'Request' ||
              d.status == 'Allow' ||
              d.status == 'Denny'
          )
          .sort((a, b) => b.status.localeCompare(a.status));
      }
    });
  }

  modalUpdate(item) {
    const modalRef = this.modalService.open(ModalStatusComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.detail = item;
    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        this.isLoading = true;

        let data = {
          organisasi_id: item.id,
          status: 'Update',
        };
        this.apiService.updateStatusPendaftaran(data).subscribe(
          (res) => {
            if (res) {
              this.getData();
              this.isLoading = false;
            }
          },
          (err) => {
            console.log(err);
            this.isLoading = false;
            const modalRef = this.modalService.open(ModalMessageComponent, {
              centered: true,
              size: 'md',
            });
            modalRef.componentInstance.errorMsg = 'Perpanjang kartu Error';
            modalRef.componentInstance.errors = err.error.message;
          }
        );
      }
    });
  }

  formatDate(date) {
    const currentDate = new Date(date);

    const options: any = {
      // weekday: 'long',
      year: 'numeric',
      month: 'short',
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
      // const selisihHari = tanggalInput.diff(tanggalSekarang, 'days');
      // console.log(`Selisih dalam hari: ${selisihHari} hari`);

      return true;
    }
  }

  deleteOrganisasi(id) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      size: 'sm',
    });

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      this.isLoading = true;
      this.apiService.deleteOrganisasi(id).subscribe(
        (res) => {
          if (res) {
            this.getData();
            this.isLoading = false;
          }
        },
        (err) => {
          console.log(err);
          this.isLoading = false;
          const modalRef = this.modalService.open(ModalMessageComponent, {
            centered: true,
            size: 'md',
          });
          modalRef.componentInstance.errorMsg = 'Delete Error';
          modalRef.componentInstance.errors = err.error.message;
        }
      );
    });
  }
}
