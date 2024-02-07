import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  faIdCard,
  faPen,
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
import { PreviewKartuComponent } from 'src/app/utils/preview-kartu/preview-kartu.component';
import { ImportModalComponent } from './import-modal/import-modal.component';
import * as QRCode from 'qrcode';
import { PreviewImageComponent } from 'src/app/utils/preview-image/preview-image.component';

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

  faCard = faIdCard;
  faPencil = faPen;
  faUpdate = faSyncAlt;
  faDelete = faTrash;

  @ViewChild('qrcode', { static: true }) qrcodeCanvas: ElementRef;
  qrcodeUrl: any;
  imageUrl: any;

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
              d.status == 'DataLama' ||
              d.status == 'Request' ||
              d.status == 'Allow' ||
              d.status == 'Denny'
          )
          .sort((a, b) => b.status.localeCompare(a.status));
      }
    });
  }

  importData() {
    const modalRef = this.modalService.open(ImportModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';

    modalRef.componentInstance.emitModal.subscribe(async (res: any) => {});
  }

  modalUpdate(item) {
    /// perlu perbaikan
    const modalRef = this.modalService.open(ModalStatusComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.detail = item;
    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        this.isLoading = true;

        try {
          let data = {
            organisasi_id: item.id,
            status: 'Update',
            tanggal_cetak_kartu: res.tanggal_cetak_kartu,
          };
          this.apiService.updateStatusPendaftaran(data).subscribe(
            async (orgUpdate: any) => {
              if (orgUpdate) {
                // update kartu
                let qrcodeUrl: any = await this.generateQRCode(
                  orgUpdate.data.kode_kartu
                );
                let imageUrl;

                console.log(orgUpdate);

                this.apiService
                  .getDocument(orgUpdate.data.id)
                  .subscribe((res: any) => {
                    if (res && res.data && res.data) {
                      let listDocuments = res.data;

                      listDocuments.map(async (item) => {
                        if (item.tipe == 'PAS-FOTO') {
                          this.apiService
                            .getImage({
                              url: `uploads/organisasi/${item.organisasi_id}/${item.image}`,
                            })
                            .subscribe(async (res) => {
                              const blob = new Blob([res], {
                                type: 'image/jpg',
                              });

                              // this.imageUrl = await this.blobToImage(blob);
                              let image = await this.blobToBase64(blob);
                              imageUrl = await this.cropImage(image, 613, 700);

                              if (qrcodeUrl && imageUrl) {
                                this.isLoading = false;

                                const modalRef = this.modalService.open(
                                  PreviewImageComponent,
                                  {
                                    centered: true,
                                    size: 'lg',
                                    backdrop: 'static',
                                  }
                                );
                                modalRef.componentInstance.imageUrl = imageUrl;
                                modalRef.componentInstance.qrcodeUrl =
                                  qrcodeUrl;
                                modalRef.componentInstance.dataOrganisasi =
                                  orgUpdate.data;

                                modalRef.componentInstance.emitModal.subscribe(
                                  (res: any) => {
                                    if (res) {
                                      this.getData();
                                      this.isLoading = false;
                                    }
                                  }
                                );
                              }
                            });
                        }
                      });
                    }
                  });
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
        } catch (error) {
          console.error('Error formatting date:', error);

          this.isLoading = false;
          const modalRef = this.modalService.open(ModalMessageComponent, {
            centered: true,
            size: 'md',
          });
          modalRef.componentInstance.errorMsg = 'Perpanjang kartu Error';
          modalRef.componentInstance.errors = error;
        }
      }
    });
  }

  previewKartu(data) {
    const modalRef = this.modalService.open(PreviewKartuComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.dataOrganisasi = data;
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

  async generateQRCode(data): Promise<void> {
    const canvas = this.qrcodeCanvas.nativeElement;
    const context = canvas.getContext('2d');

    const qrCodeData = data;

    // Set the canvas dimensions without displaying it
    canvas.width = 300; // Set your desired width
    canvas.height = 300; // Set your desired height

    // Generate QR code using qrcode library
    await QRCode.toCanvas(canvas, qrCodeData);

    // Customize styling
    context.fillStyle = 'red'; // Set your desired fill color
    context.strokeStyle = 'blue'; // Set your desired stroke color

    // Add any other styling customizations

    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL('image/png');
    console.log(dataURL);

    return dataURL;
  }

  getImageBase64(url) {
    this.isLoading = true;
    this.apiService
      .getImage({
        url: url,
      })
      .subscribe(async (res) => {
        const blob = new Blob([res], { type: 'image/jpg' });

        // this.imageUrl = await this.blobToImage(blob);
        let image = await this.blobToBase64(blob);
        this.imageUrl = await this.cropImage(image, 613, 700);

        if (this.imageUrl) {
          this.isLoading = false;
        }
      });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  cropImage(
    base64String: string,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = base64String;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to target dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calculate the scaling factor for "object-fit: cover"
        const scaleFactor = Math.max(
          targetWidth / image.width,
          targetHeight / image.height
        );

        // Calculate the cropped dimensions
        const croppedWidth = image.width * scaleFactor;
        const croppedHeight = image.height * scaleFactor;

        // Calculate the crop position to center the image
        const cropX = (croppedWidth - targetWidth) / 2;
        const cropY = (croppedHeight - targetHeight) / 2;

        // Draw the cropped image onto the canvas
        ctx.drawImage(image, -cropX, -cropY, croppedWidth, croppedHeight);

        // Convert the canvas to a Base64 string
        const croppedBase64String = canvas.toDataURL('image/png');

        resolve(croppedBase64String);
      };

      image.onerror = reject;
    });
  }
}
