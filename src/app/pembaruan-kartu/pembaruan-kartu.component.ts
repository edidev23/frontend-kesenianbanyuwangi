import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import * as QRCode from 'qrcode';
import { PreviewImageComponent } from '../utils/preview-image/preview-image.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pembaruan-kartu',
  templateUrl: './pembaruan-kartu.component.html',
  styleUrls: ['./pembaruan-kartu.component.scss'],
})
export class PembaruanKartuComponent implements OnInit {
  jenisKesenian: any;
  subKesenian: any;
  kecamatanList: any = [];
  desaList: any = [];
  userID: string;

  listDocuments: any;

  @ViewChild('qrcode', { static: true }) qrcodeCanvas: ElementRef;

  organisasi: any;
  organisasiForm = this.fb.group({
    id: [''],
    user_id: ['', Validators.required],
    nama_ketua: ['', Validators.required],
    no_telp_ketua: ['', Validators.required],
    nomor_induk: [''],
    status: [''],
    logo: [''],
    nama: ['', Validators.required],
    tanggal_berdiri: ['', Validators.required],
    tanggal_daftar: [''],
    alamat: ['', Validators.required],
    jumlah_anggota: ['', Validators.required],
    jenis_kesenian: ['', Validators.required],
    sub_kesenian: ['', Validators.required],
    kabupaten: ['Banyuwangi', Validators.required],
    kecamatan: ['', Validators.required],
    desa: ['', Validators.required],
    keterangan: [''],
  });

  isLoading: boolean = false;

  @ViewChild('fotoKTP') fotoKTP!: ElementRef<HTMLInputElement>;
  selectedFotoKTP: File | null | undefined;
  fotoKTPPreview: string | null | undefined;

  @ViewChild('pasFoto') pasFoto!: ElementRef<HTMLInputElement>;
  selectedPasFoto: File | null | undefined;
  pasFotoPreview: string | null | undefined;

  faTimes = faTimes;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
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
        this.getData();
      }
    }
  }

  getData() {
    this.apiService.getJenisKesenian().subscribe((res) => {
      if (res) {
        this.jenisKesenian = res;
      }
    });

    // banyuwangi
    let id_wilayah = '35.10';
    this.apiService.getWilayah(id_wilayah).subscribe((res: any) => {
      if (res) {
        this.kecamatanList = res.data;
      }
    });

    this.getOrganisasi();
  }

  saveStatusPendaftaran() {
    this.isLoading = true;
    let data = {
      organisasi_id: this.organisasi.id,
      status: 'Allow',
    };
    this.apiService.updateStatusPendaftaran(data).subscribe(
      (res: any) => {
        if (res) {
          this.organisasi = res.data;
          this.isLoading = false;
          this.updateStatus();
        }
      },
      (error) => console.log('error')
    );
  }

  async updateStatus() {
    if (this.organisasi.status == 'Allow') {
      let qrcodeUrl: any = await this.generateQRCode(
        this.organisasi.kode_kartu
      );

      if (qrcodeUrl) {
        const modalRef = this.modalService.open(PreviewImageComponent, {
          centered: true,
          size: 'lg',
          backdrop: 'static',
        });
        modalRef.componentInstance.imageUrl = this.pasFotoPreview;
        modalRef.componentInstance.qrcodeUrl = qrcodeUrl;
        modalRef.componentInstance.dataOrganisasi = this.organisasi;

        modalRef.componentInstance.emitModal.subscribe((res: any) => {
          if (res) {
            this.router.navigateByUrl('/admin/homepage');
          }
        });
      }
    } else {
      this.router.navigateByUrl('/admin/homepage');
    }
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
        this.pasFotoPreview = await this.cropImage(image, 613, 700);

        if (this.pasFotoPreview) {
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

  getOrganisasi() {
    this.isLoading = true;

    this.apiService.getOrganisasiByUser(this.userID).subscribe(
      (res: any) => {
        this.organisasi = res.data;

        this.isLoading = false;
        this.getDocument();

        this.organisasiForm.controls.id.setValue(this.organisasi.id);
        this.organisasiForm.controls.user_id.setValue(this.organisasi.user_id);
        this.organisasiForm.controls.nama_ketua.setValue(
          this.organisasi.nama_ketua
        );
        this.organisasiForm.controls.no_telp_ketua.setValue(
          this.organisasi.no_telp_ketua
        );

        this.organisasiForm.controls.nomor_induk.setValue(
          this.organisasi.nomor_induk
        );
        this.organisasiForm.controls.status.setValue(this.organisasi.status);
        this.organisasiForm.controls.logo.setValue(this.organisasi.logo);
        this.organisasiForm.controls.nama.setValue(this.organisasi.nama);
        this.organisasiForm.controls.tanggal_berdiri.setValue(
          this.organisasi.tanggal_berdiri
        );
        this.organisasiForm.controls.tanggal_daftar.setValue(
          this.organisasi.tanggal_daftar
            ? this.organisasi.tanggal_daftar
            : moment().format('YYYY-MM-DD')
        );
        this.organisasiForm.controls.jumlah_anggota.setValue(
          this.organisasi.jumlah_anggota
        );
        this.organisasiForm.controls.kabupaten.setValue(
          this.organisasi.kabupaten
        );

        this.organisasiForm.controls.kecamatan.setValue(
          this.organisasi.kecamatan
        );
        this.organisasiForm.controls.desa.setValue(this.organisasi.desa);
        this.organisasiForm.controls.alamat.setValue(this.organisasi.alamat);

        this.organisasiForm.controls.jenis_kesenian.setValue(
          this.organisasi.jenis_kesenian
        );
        this.organisasiForm.controls.sub_kesenian.setValue(
          this.organisasi.sub_kesenian
        );
        if (this.organisasi.kecamatan) {
          this.getDesa();
        }
        if (this.organisasi.jenis_kesenian) {
          this.selectJenisKesenian();
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getDesa() {
    if (this.kecamatanList) {
      let check = this.kecamatanList.find(
        (item) => item.kode == this.organisasiForm.controls.kecamatan.value
      );

      if (check) {
        this.apiService.getWilayah(check.kode).subscribe((res: any) => {
          if (res) {
            this.desaList = res.data;
          }
        });
      }
    }
  }

  selectJenisKesenian() {
    if (this.jenisKesenian) {
      let check = this.jenisKesenian.find(
        (j) => j.id == this.organisasiForm.controls.jenis_kesenian.value
      );

      if (check) {
        this.subKesenian = check.sub;
      }
    }
  }

  onFileSelectedFotoKTP(event: any) {
    this.selectedFotoKTP = event.target.files[0];
    this.previewLogo();
  }

  previewLogo() {
    if (this.selectedFotoKTP) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoKTPPreview = reader.result as string;
        // console.log(this.imageBanner);

        this.apiService
          .uploadDocument(this.organisasi.id, 'KTP', this.selectedFotoKTP)
          .subscribe((res: any) => {
            if (res) {
              console.log(res);
              this.getDocument();
              // this.getUserDetail();
            }
          });
      };
      reader.readAsDataURL(this.selectedFotoKTP);
    }
  }

  onFileSelectedPasFoto(event: any) {
    this.selectedPasFoto = event.target.files[0];
    this.previewPasFoto();
  }

  previewPasFoto() {
    if (this.selectedPasFoto) {
      const reader = new FileReader();
      reader.onload = () => {
        this.pasFotoPreview = reader.result as string;
        // console.log(this.imageBanner);

        this.apiService
          .uploadDocument(this.organisasi.id, 'PAS-FOTO', this.selectedPasFoto)
          .subscribe((res: any) => {
            if (res) {
              console.log(res);
              this.getDocument();
              // this.getUserDetail();
            }
          });
      };
      reader.readAsDataURL(this.selectedPasFoto);
    }
  }

  getDocument() {
    this.isLoading = true;
    this.apiService.getDocument(this.organisasi.id).subscribe(
      (res: any) => {
        if (res && res.data && res.data) {
          this.isLoading = false;
          this.listDocuments = res.data;

          this.listDocuments.map(async (item) => {
            let linkImage = `${environment.url}uploads/organisasi/${item.organisasi_id}`;
            if (item.tipe == 'KTP') {
              this.fotoKTPPreview = `${linkImage}/${item.image}`;
            } else if (item.tipe == 'PAS-FOTO') {
              await this.getImageBase64(
                `uploads/organisasi/${item.organisasi_id}/${item.image}`
              );
            }
          });
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  deleteImage(tipe, index = null) {
    if (tipe == 'KTP') {
      let dataDocument = this.listDocuments.find((item) => item.tipe == tipe);

      if (dataDocument) {
        this.apiService.deleteDocument(dataDocument.id).subscribe((res) => {
          this.fotoKTPPreview = null;
        });
      }
    } else if (tipe == 'PAS-FOTO') {
      let dataDocument = this.listDocuments.find((item) => item.tipe == tipe);

      if (dataDocument) {
        this.apiService.deleteDocument(dataDocument.id).subscribe((res) => {
          this.pasFotoPreview = null;
        });
      }
    }
  }
}
