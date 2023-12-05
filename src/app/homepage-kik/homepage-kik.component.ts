import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewImageComponent } from '../utils/preview-image/preview-image.component';

@Component({
  selector: 'app-homepage-kik',
  templateUrl: './homepage-kik.component.html',
  styleUrls: ['./homepage-kik.component.scss'],
})
export class HomepageKikComponent implements OnInit {
  userID: string;
  role: string;

  isLoading: boolean = false;
  organisasi: any;
  dataVerifikasi: any;

  dataDocuments: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private modalService: NgbModal
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
          this.getData();
        } else if (this.role == 'admin') {
          this.router.navigateByUrl('admin/homepage');
        }
      }
    }
  }

  getData() {
    this.isLoading = true;

    this.apiService.getOrganisasiByUser(this.userID).subscribe(
      (res: any) => {
        this.isLoading = false;

        console.log(res);

        if (res && res.data) {
          this.organisasi = res.data;

          // get image photo
          this.isLoading = true;
          this.apiService.getDocument(this.organisasi.id).subscribe(
            (res: any) => {
              if (res) {
                this.isLoading = false;
                this.dataDocuments = res.data;
              }
            },
            (error) => {
              this.isLoading = false;
            }
          );

          if (this.organisasi && !this.organisasi.status) {
            this.router.navigateByUrl('/registrasi');
          } else {
            this.apiService
              .getVerifikasi(this.organisasi.id)
              .subscribe((res: any) => {
                if (res) {
                  this.dataVerifikasi = res.data.filter(
                    (i) => i.status == 'tdk_valid'
                  );
                }
              });
          }
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
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

  gotoRegistrasi() {
    this.router.navigateByUrl('/registrasi');
  }

  previewKartu() {
    const modalRef = this.modalService.open(PreviewImageComponent, {
      centered: true,
      size: 'md',
    });
    // modalRef.componentInstance.errorMsg = 'Error Upload';
    // modalRef.componentInstance.errors = ['Upload Photo Max 16'];
  }
}
