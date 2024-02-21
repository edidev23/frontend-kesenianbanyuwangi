import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalAnggotaComponent } from './modal-anggota/modal-anggota.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
  faPen,
  faPlus,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ModalDeleteComponent } from '../utils/modal-delete/modal-delete.component';
import { ModalInventarisComponent } from './modal-inventaris/modal-inventaris.component';
import { environment } from 'src/environments/environment';
import { ModalMessageComponent } from '../utils/modal-message/modal-message.component';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.component.html',
  styleUrls: ['./registrasi.component.scss'],
})
export class RegistrasiComponent implements OnInit {
  tabActive: string = 'general';
  files: any[] = [];

  faEdit = faPen;
  faDelete = faTrash;
  faTimes = faTimes;
  faPlus = faPlus;

  isLoading: boolean = false;

  userID: string = '';
  kecamatanList: any;
  desaList: any;

  organisasi: any;
  userList: any = [];
  inventarisList: any = [];
  listDocuments: any = [];

  dataVerifikasi: any;

  public jenisKesenian: any;
  public subKesenian: any;

  @ViewChild('fotoKTP') fotoKTP!: ElementRef<HTMLInputElement>;
  selectedFotoKTP: File | null | undefined;
  fotoKTPPreview: string | null | undefined;

  @ViewChild('pasFoto') pasFoto!: ElementRef<HTMLInputElement>;
  selectedPasFoto: File | null | undefined;
  pasFotoPreview: string | null | undefined;

  @ViewChild('banner') banner!: ElementRef<HTMLInputElement>;
  selectedBanner: File | null | undefined;
  bannerPreview: string | null | undefined;

  selectedFotokegiatan: File | null | undefined;
  @ViewChild('fotoKegiatan') fotoKegiatan!: ElementRef<HTMLInputElement>;
  selectedFiles: any = [];

  organisasiForm = this.fb.group({
    id: [''],
    user_id: ['', Validators.required],
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

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.activeRoute.queryParamMap.subscribe((params: any) => {
      // this.type = params.get('type') ? params.get('type') : 'Regular';
      this.tabActive = params.get('tabActive')
        ? params.get('tabActive')
        : 'general';
    });

    let resp = await this.authService.getToken();

    if (!resp) {
      this.router.navigateByUrl('/login');
    } else {
      let dataStorage = JSON.parse(localStorage.getItem('users'));
      this.userID = dataStorage ? dataStorage.id : '';

      if (this.userID) {
        if (dataStorage.role == 'user-kik') {
          this.getData();
        } else if (dataStorage.role == 'admin') {
          this.router.navigateByUrl('admin/homepage');
        }
      }
    }
  }

  getData() {
    this.apiService.getJenisKesenian().subscribe((res) => {
      if (res) {
        this.jenisKesenian = res;

        if (this.kecamatanList) {
          this.getOrganisasi();
        }
      }
    });

    // banyuwangi
    let id_wilayah = '35.10';
    this.apiService.getWilayah(id_wilayah).subscribe((res: any) => {
      if (res) {
        this.kecamatanList = res.data;

        if (this.jenisKesenian) {
          this.getOrganisasi();
        }
      }
    });
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

  addAnggota() {
    const modalRef = this.modalService.open(ModalAnggotaComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';
    modalRef.componentInstance.organisasi_id = this.organisasi.id;
    modalRef.componentInstance.userList = this.userList;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.userList.push(res);
      }
    });
  }

  editAnggota(i, data) {
    const modalRef = this.modalService.open(ModalAnggotaComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';
    modalRef.componentInstance.detailAnggota = data;
    modalRef.componentInstance.userList = this.userList;
    modalRef.componentInstance.organisasi_id = this.organisasi.id;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.userList[i] = res;
      }
    });
  }

  deleteAnggota(i, id) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      size: 'sm',
    });

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      this.isLoading = true;
      this.apiService.deleteAnggota(id).subscribe(
        (res) => {
          if (res) {
            this.userList.splice(i, 1);
            this.isLoading = false;
          }
        },
        (err) => {
          this.isLoading = false;

          const modalRef = this.modalService.open(ModalMessageComponent, {
            centered: true,
            size: 'md',
          });
          modalRef.componentInstance.errorMsg = 'Error';
          modalRef.componentInstance.errors = ['Reload untuk mencoba lagi'];
        }
      );
    });
  }

  addInventaris() {
    const modalRef = this.modalService.open(ModalInventarisComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';
    modalRef.componentInstance.organisasi_id = this.organisasi.id;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.inventarisList.push(res);
      }
    });
  }

  editInventaris(i, data) {
    const modalRef = this.modalService.open(ModalInventarisComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';
    modalRef.componentInstance.detailInventaris = data;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.inventarisList[i] = res;
      }
    });
  }

  deleteInventaris(i, id) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      size: 'sm',
    });

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      this.isLoading = true;
      this.apiService.deleteInventaris(id).subscribe(
        (res) => {
          if (res) {
            this.inventarisList.splice(i, 1);
            this.isLoading = false;
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
    });
  }

  gotoLink(tab) {
    console.log(tab);
    this.router.navigateByUrl('registrasi?tabActive=' + tab);
  }

  gotoLinknav(tab) {
    if (this.organisasi && this.organisasi.status) {
      console.log(tab);
      this.router.navigateByUrl('registrasi?tabActive=' + tab);
    }
  }

  next(tab: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab == 'general') {
      this.tabActive = 'data_organisasi';
    } else if (tab == 'data_organisasi') {
      this.saveOrganisasi();

      this.tabActive = 'data_anggota';
    } else if (tab == 'data_anggota') {
      this.tabActive = 'data_inventaris';
    } else if (tab == 'data_inventaris') {
      this.tabActive = 'data_pendukung';
    } else if (tab == 'data_pendukung') {
      this.tabActive = 'publish';
    }

    this.gotoLink(this.tabActive);
  }

  prev(tab: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab == 'data_organisasi') {
      this.tabActive = 'general';
    } else if (tab == 'data_anggota') {
      this.tabActive = 'data_organisasi';
    } else if (tab == 'data_inventaris') {
      this.tabActive = 'data_anggota';
    } else if (tab == 'data_pendukung') {
      this.tabActive = 'data_inventaris';
    } else if (tab == 'publish') {
      this.tabActive = 'data_pendukung';
    }

    this.gotoLink(this.tabActive);
  }

  saveOrganisasi() {
    this.isLoading = true;

    this.apiService
      .saveOrganisasi(this.organisasiForm.value)
      .subscribe((res: any) => {
        console.log(res);
        this.organisasi = res.data;
        this.organisasiForm.controls.id.setValue(this.organisasi.id);
        this.isLoading = false;
      });
  }

  updateStatus() {
    this.isLoading = true;
    if (this.userList && this.userList.length) {
      this.organisasiForm.controls.jumlah_anggota.setValue(
        this.userList.length
      );
    }
    let data = this.organisasiForm.value;
    // data.status = 'Request';
    this.apiService.saveOrganisasi(data).subscribe((res) => {
      if (res) {
        console.log(res);

        let data = {
          organisasi_id: this.organisasi.id,
          status: 'Request',
        };
        this.apiService.updateStatusPendaftaran(data).subscribe(
          (res) => {
            if (res) {
              // send notification
            }
          },
          (error) => console.log('error')
        );

        this.router.navigateByUrl('/homepage');
      }
    });
  }

  getOrganisasi() {
    this.isLoading = true;

    this.apiService.getOrganisasiByUser(this.userID).subscribe(
      (res: any) => {
        this.isLoading = false;

        console.log(res);

        if (res && res.data) {
          this.organisasi = res.data;
          this.getAnggota(this.organisasi.id);

          let dataOrganisasi = res.data;

          this.organisasiForm.controls.id.setValue(dataOrganisasi.id);
          this.organisasiForm.controls.user_id.setValue(dataOrganisasi.user_id);

          this.organisasiForm.controls.nomor_induk.setValue(
            dataOrganisasi.nomor_induk
          );
          this.organisasiForm.controls.status.setValue(dataOrganisasi.status);
          this.organisasiForm.controls.logo.setValue(dataOrganisasi.logo);
          this.organisasiForm.controls.nama.setValue(dataOrganisasi.nama);
          this.organisasiForm.controls.tanggal_berdiri.setValue(
            dataOrganisasi.tanggal_berdiri
          );
          this.organisasiForm.controls.tanggal_daftar.setValue(
            dataOrganisasi.tanggal_daftar
              ? dataOrganisasi.tanggal_daftar
              : moment().format('YYYY-MM-DD')
          );
          this.organisasiForm.controls.jumlah_anggota.setValue(
            dataOrganisasi.jumlah_anggota
          );
          this.organisasiForm.controls.kabupaten.setValue(
            dataOrganisasi.kabupaten
          );

          this.organisasiForm.controls.kecamatan.setValue(
            dataOrganisasi.kecamatan
          );
          this.organisasiForm.controls.desa.setValue(dataOrganisasi.desa);
          this.organisasiForm.controls.alamat.setValue(dataOrganisasi.alamat);

          this.organisasiForm.controls.jenis_kesenian.setValue(
            dataOrganisasi.jenis_kesenian
          );
          this.organisasiForm.controls.sub_kesenian.setValue(
            dataOrganisasi.sub_kesenian
          );
          if (dataOrganisasi.kecamatan) {
            this.getDesa();
          }
          if (dataOrganisasi.jenis_kesenian) {
            this.selectJenisKesenian();
          }
        }

        if (res && res.data && !res.data.status) {
          // belum input mungkin
        } else if (res && res.data && res.data.status) {
          if (res.data.status == 'Allow') {
            alert(
              'pendaftaran berhasil, sistem akan menampilkan kartu induk kesenian'
            );

            this.router.navigateByUrl('homepage');
          } else if (res.data.status == 'Denny') {
            this.apiService
              .getVerifikasi(this.organisasi.id)
              .subscribe((res: any) => {
                if (res) {
                  this.dataVerifikasi = res.data.filter(
                    (i) => i.status == 'tdk_valid'
                  );
                }
              });

            // this.router.navigateByUrl('homepage');
          } else if (res.data.status == 'Request') {
            alert('pendaftaran masih dalam proses validasi');

            this.router.navigateByUrl('homepage');
          }
        }
      },
      (error) => {
        this.organisasiForm.controls.user_id.setValue(this.userID);
        this.organisasiForm.controls.tanggal_daftar.setValue(
          moment().format('YYYY-MM-DD')
        );
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getAnggota(organisasi_id) {
    this.isLoading = true;
    this.apiService.getAnggotaByUser(organisasi_id).subscribe((res: any) => {
      if (res && res.data && res.data) {
        this.userList = res.data;

        if (this.inventarisList && this.listDocuments) {
          this.isLoading = false;
        }
      }
    });

    this.apiService.getInventarisByUser(organisasi_id).subscribe((res: any) => {
      if (res && res.data && res.data) {
        this.inventarisList = res.data;

        if (this.userList && this.listDocuments) {
          this.isLoading = false;
        }
      }
    });
    this.getDocument();
  }

  getDocument() {
    this.isLoading = true;
    this.apiService.getDocument(this.organisasi.id).subscribe((res: any) => {
      if (res && res.data && res.data) {
        this.selectedFiles = [];
        this.listDocuments = res.data;

        if (this.inventarisList && this.userList) {
          this.isLoading = false;
        }

        const timestamp = new Date().getTime();

        this.listDocuments.map((item) => {
          let linkImage = `${environment.url}uploads/organisasi/${item.organisasi_id}`;
          if (item.tipe == 'KTP') {
            this.fotoKTPPreview = `${linkImage}/${item.image}?t=${timestamp}`;
          } else if (item.tipe == 'PAS-FOTO') {
            this.pasFotoPreview = `${linkImage}/${item.image}?t=${timestamp}`;
          } else if (item.tipe == 'BANNER') {
            this.bannerPreview = `${linkImage}/${item.image}?t=${timestamp}`;
          }
        });

        let fotoKegiatan = this.listDocuments.filter(
          (item) => item.tipe == 'FOTO-KEGIATAN'
        );

        if (fotoKegiatan) {
          fotoKegiatan.map((item) => {
            let linkImage = `${environment.url}uploads/organisasi/${item.organisasi_id}`;

            this.selectedFiles.push(`${linkImage}/${item.image}`);
          });
        }
      }
    });
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
    } else if (tipe == 'BANNER') {
      let dataDocument = this.listDocuments.find((item) => item.tipe == tipe);

      if (dataDocument) {
        this.apiService.deleteDocument(dataDocument.id).subscribe((res) => {
          this.bannerPreview = null;
        });
      }
    } else if (tipe == 'FOTO-KEGIATAN') {
      let fotoKegiatan = this.listDocuments.filter(
        (item) => item.tipe == 'FOTO-KEGIATAN'
      );

      let urlImage = this.selectedFiles[index]
        ? this.selectedFiles[index].split('/')
        : null;

      console.log(urlImage);

      if (urlImage) {
        let nameImage = urlImage[urlImage.length - 1];
        let checkImage = fotoKegiatan.find((i) => i.image == nameImage);

        console.log(nameImage, checkImage);

        if (checkImage) {
          this.apiService.deleteDocument(checkImage.id).subscribe((res) => {
            this.selectedFiles.splice(index, 1);
          });
        }
      }
    }
  }

  checkAnggota() {
    if (this.userList && this.userList.length) {
      let checkKetua = this.userList.find((i) => i.jabatan == 'Ketua');
      let checkSekretaris = this.userList.find(
        (i) => i.jabatan == 'Sekretaris'
      );

      if (checkKetua && checkSekretaris) {
        return this.userList.length >=
          this.organisasiForm.controls.jumlah_anggota.value
          ? false
          : true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  checkInventaris() {
    if (this.inventarisList && this.inventarisList.length) {
      let jumlah = 0;
      this.inventarisList.map((item) => {
        jumlah = jumlah + item.jumlah;
      });

      if (jumlah >= 10) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkDataPendukung() {
    if (this.listDocuments) {
      let checkKTP = this.listDocuments.find((i) => i.tipe == 'KTP');
      let checkFoto = this.listDocuments.find((i) => i.tipe == 'PAS-FOTO');
      let checkBanner = this.listDocuments.find((i) => i.tipe == 'BANNER');
      let checkFotoKegiatan = this.listDocuments.find(
        (i) => i.tipe == 'FOTO-KEGIATAN'
      );

      return checkKTP && checkFoto && checkBanner && checkFotoKegiatan
        ? true
        : false;
    } else {
      return false;
    }
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
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

  onFileSelectedBanner(event: any) {
    this.selectedBanner = event.target.files[0];
    this.previewBanner();
  }

  previewBanner() {
    if (this.selectedBanner) {
      const reader = new FileReader();
      reader.onload = () => {
        this.bannerPreview = reader.result as string;
        // console.log(this.imageBanner);

        this.apiService
          .uploadDocument(this.organisasi.id, 'BANNER', this.selectedBanner)
          .subscribe((res: any) => {
            if (res) {
              this.getDocument();
              console.log(res);
              // this.getUserDetail();
            }
          });
      };
      reader.readAsDataURL(this.selectedBanner);
    }
  }

  openFileFotokegiatan(): void {
    this.fotoKegiatan.nativeElement.click();
  }

  onFileSelectedFotokegiatan(event: any) {
    let selectedFile: any = [];
    for (const item of event.target.files) {
      if (
        this.selectedFiles &&
        this.selectedFiles.length + selectedFile.length < 16
      ) {
        selectedFile.push(item);
      }
    }

    for (const item of selectedFile) {
      this.files.push(item);

      const reader = new FileReader();
      reader.onload = () => {
        let imagePreview = reader.result as string;
        // this.selectedFiles.push(imagePreview);

        this.isLoading = true;
        this.apiService
          .uploadDocument(this.organisasi.id, 'FOTO-KEGIATAN', item)
          .subscribe((res: any) => {
            if (res) {
              console.log(res);

              this.listDocuments.push(res.data);

              let linkImage = `${environment.url}uploads/organisasi/${this.organisasi.id}`;

              this.selectedFiles.push(`${linkImage}/${res.data.image}`);
              this.isLoading = false;
              this.getDocument();
            }
          });
      };
      reader.readAsDataURL(item);
    }

    if (selectedFile.length != event.target.files.length) {
      const modalRef = this.modalService.open(ModalMessageComponent, {
        centered: true,
        size: 'md',
      });
      modalRef.componentInstance.errorMsg = 'Error Upload';
      modalRef.componentInstance.errors = ['Upload Photo Max 16'];
    }
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  calculateAge(birthdate) {
    if (birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age based on the month difference
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age + ' TH';
    } else {
      return '-';
    }
  }
}
