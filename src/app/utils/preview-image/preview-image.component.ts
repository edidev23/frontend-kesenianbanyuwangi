import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent implements OnInit {
  @Input() public dataOrganisasi;
  @Input() public qrcodeUrl;
  @Input() public imageUrl;

  @ViewChild('kikContainer') kikContainer!: ElementRef;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  cetak: boolean = false;
  imageUpload: any;

  constructor(private modalService: NgbModal, private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.dataOrganisasi.nama = this.dataOrganisasi.nama.length > 60
    ? this.dataOrganisasi.nama.substring(0, 60)
    : this.dataOrganisasi.nama;

    this.dataOrganisasi.alamat = this.dataOrganisasi.alamat.length > 100
    ? this.dataOrganisasi.alamat.substring(0, 100)
    : this.dataOrganisasi.alamat;
    // setTimeout(() => {
    //   this.generateKIKImage();
    // }, 1000);
  }

  generateKartuInduk() {
    const element = this.kikContainer.nativeElement;
    this.cetak = true;

    if (element) {
      html2canvas(element, {
        scale: 5,
        // foreignObjectRendering: true,
        allowTaint: true, // Set to true if your images are cross-origin
        useCORS: true, // Set to true if your images are cross-origin
      }).then(async (canvas: any) => {
        const image = canvas.toDataURL('image/png');
        // const link = document.createElement('a');
        // link.href = image;
        // link.download = 'kik_image.png';
        // link.click();

        let imageUpload = await this.base64ToFile(image, 'kartu.png');

        this.apiService
          .uploadDocument(this.dataOrganisasi.id, 'KARTU', imageUpload)
          .subscribe((res: any) => {
            if (res) {
              this.close();
              this.cetak = false;
            }
          });
      });
    }
  }

  async base64ToFile(base64String: string, filename: string): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const byteCharacters = atob(
        base64String.replace(/^data:image\/(png|jpeg);base64,/, '')
      );
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const file = new File([blob], filename, { type: 'image/png' });

      resolve(file);
    });
  }

  close() {
    this.emitModal.emit(true);
    this.modalService.dismissAll();
  }

  getTanggalBefore(date) {
    const currentDate = moment(date);
    const dateAfterTwoYears = currentDate.subtract(2, 'years');
    const formattedDate = dateAfterTwoYears.format('YYYY-MM-DD');

    return this.formatDate(formattedDate);
  }

  formatDate(date) {
    const currentDate = new Date(date);

    const formattedDate = moment(currentDate).format('MM/DD/YYYY');
    return formattedDate;
  }

  checkExpired(date) {
    const tanggalSekarang = moment();
    const tanggalInput = moment(date);

    if (tanggalSekarang.isBefore(tanggalInput)) {
      return false;
    } else {
      const selisihHari = tanggalInput.diff(tanggalSekarang, 'days');

      return Math.abs(selisihHari);
    }
  }
}
