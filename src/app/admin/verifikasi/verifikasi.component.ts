import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  faPen,
  faTrash,
  faTimes,
  faPlus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalAnggotaComponent } from 'src/app/registrasi/modal-anggota/modal-anggota.component';
import { ModalInventarisComponent } from 'src/app/registrasi/modal-inventaris/modal-inventaris.component';
import { ModalDeleteComponent } from 'src/app/utils/modal-delete/modal-delete.component';
import { ModalMessageComponent } from 'src/app/utils/modal-message/modal-message.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verifikasi',
  templateUrl: './verifikasi.component.html',
  styleUrls: ['./verifikasi.component.scss'],
})
export class VerifikasiComponent implements OnInit {
  tabActive: string = 'general';
  files: any[] = [];

  faEdit = faPen;
  faDelete = faTrash;
  faTimes = faTimes;
  faPlus = faPlus;
  faCheck = faCheck;

  isLoading: boolean = false;

  userID: string = '';
  kecamatanList: any;
  desaList: any;

  organisasi: any;
  userList: any;
  inventarisList: any;
  listDocuments: any;

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

  dataValidation: any;

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

  reviewForm = this.fb.group({
    id: [''],
    organisasi_id: [''],
    status: ['', Validators.required],
    tipe: [''],
    keterangan: ['', Validators.required],
    foto: [''],
    userid_review: [''],
    tanggal_review: [''],
  });

  organisasiID: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    let resp = await this.authService.getToken();

    if (!resp) {
      this.router.navigateByUrl('/login');
    } else {
      let dataStorage = JSON.parse(localStorage.getItem('users'));
      this.userID = dataStorage ? dataStorage.id : '';

      if (this.userID) {
        if (dataStorage.role == 'user-kik') {
          this.router.navigateByUrl('homepage');
        } else if (dataStorage.role == 'admin') {
          //

          this.activeRoute.paramMap.subscribe((params: any) => {
            this.organisasiID = params.params.organisasi_id;

            this.getData();
          });

          this.activeRoute.queryParamMap.subscribe((params: any) => {
            this.tabActive = params.get('tabActive')
              ? params.get('tabActive')
              : 'general';

            if (this.organisasiID) {
              console.log(this.tabActive);
            }
          });
        }
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
    this.getValidation();
  }

  getValidation() {
    this.isLoading = true;
    this.apiService.getVerifikasi(this.organisasiID).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = false;

          this.reviewForm.reset();

          this.dataValidation = res.data;

          let check = res.data.find((i) => i.tipe == this.tabActive);

          console.log(check, this.tabActive);
          console.log(this.dataValidation);

          if (check) {
            this.reviewForm.controls.id.setValue(check.id);
            this.reviewForm.controls.status.setValue(check.status);
            this.reviewForm.controls.keterangan.setValue(check.keterangan);
            this.reviewForm.controls.tipe.setValue(check.tipe);
            this.reviewForm.controls.id.setValue(check.id);
          }
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  checkValidasi() {
    let check = true;
    if (this.dataValidation) {
      this.dataValidation.map((item) => {
        if (item.status == 'tdk_valid') {
          check = false;
        }
      });
    }

    return check;
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
    this.router.navigateByUrl(
      `admin/verifikasi/${this.organisasiID}?tabActive=${tab}`
    );
  }

  next(tab: string) {
    if (tab == 'general') {
      this.tabActive = 'data_organisasi';
      let check = this.dataValidation
        ? this.dataValidation.find((i) => i.tipe == this.tabActive)
        : null;

      if (check) {
        this.reviewForm.controls.id.setValue(check.id);
        this.reviewForm.controls.status.setValue(check.status);
        this.reviewForm.controls.keterangan.setValue(check.keterangan);
        this.reviewForm.controls.tipe.setValue(check.tipe);
        this.reviewForm.controls.id.setValue(check.id);
      } else {
        this.reviewForm.reset();
      }

      this.gotoLink(this.tabActive);
    } else if (tab == 'data_organisasi') {
      let data = {
        organisasi_id: this.organisasiID,
        status: this.reviewForm.controls.status.value,
        keterangan: this.reviewForm.controls.keterangan.value,
        tipe: tab,
        tanggal_review: moment().format('YYYY-MM-DD'),
        userid_review: this.userID,
      };

      this.isLoading = true;
      if (this.reviewForm.controls.id.value) {
        this.apiService
          .updateVerifikasi(this.reviewForm.controls.id.value, data)
          .subscribe((res) => {
            if (res) {
              this.isLoading = false;
              this.tabActive = 'data_anggota';

              let check = this.dataValidation
                ? this.dataValidation.find((i) => i.tipe == this.tabActive)
                : null;

              if (check) {
                this.reviewForm.controls.id.setValue(check.id);
                this.reviewForm.controls.status.setValue(check.status);
                this.reviewForm.controls.keterangan.setValue(check.keterangan);
                this.reviewForm.controls.tipe.setValue(check.tipe);
                this.reviewForm.controls.id.setValue(check.id);
              } else {
                this.reviewForm.reset();
              }

              this.gotoLink(this.tabActive);
            }
          });
      } else {
        this.apiService.createVerifikasi(data).subscribe((res) => {
          if (res) {
            this.isLoading = false;
            this.tabActive = 'data_anggota';

            let check = this.dataValidation
              ? this.dataValidation.find((i) => i.tipe == this.tabActive)
              : null;

            if (check) {
              this.reviewForm.controls.id.setValue(check.id);
              this.reviewForm.controls.status.setValue(check.status);
              this.reviewForm.controls.keterangan.setValue(check.keterangan);
              this.reviewForm.controls.tipe.setValue(check.tipe);
              this.reviewForm.controls.id.setValue(check.id);
            } else {
              this.reviewForm.reset();
            }

            this.gotoLink(this.tabActive);
          }
        });
      }
    } else if (tab == 'data_anggota') {
      let data = {
        organisasi_id: this.organisasiID,
        status: this.reviewForm.controls.status.value,
        keterangan: this.reviewForm.controls.keterangan.value,
        tipe: tab,
        tanggal_review: moment().format('YYYY-MM-DD'),
        userid_review: this.userID,
      };

      this.isLoading = true;
      if (this.reviewForm.controls.id.value) {
        this.apiService
          .updateVerifikasi(this.reviewForm.controls.id.value, data)
          .subscribe((res) => {
            if (res) {
              this.tabActive = 'data_inventaris';
              this.isLoading = false;

              let check = this.dataValidation
                ? this.dataValidation.find((i) => i.tipe == this.tabActive)
                : null;

              if (check) {
                this.reviewForm.controls.id.setValue(check.id);
                this.reviewForm.controls.status.setValue(check.status);
                this.reviewForm.controls.keterangan.setValue(check.keterangan);
                this.reviewForm.controls.tipe.setValue(check.tipe);
                this.reviewForm.controls.id.setValue(check.id);
              } else {
                this.reviewForm.reset();
              }

              this.gotoLink(this.tabActive);
            }
          });
      } else {
        this.apiService.createVerifikasi(data).subscribe((res) => {
          if (res) {
            this.tabActive = 'data_inventaris';
            this.isLoading = false;

            let check = this.dataValidation
              ? this.dataValidation.find((i) => i.tipe == this.tabActive)
              : null;

            if (check) {
              this.reviewForm.controls.id.setValue(check.id);
              this.reviewForm.controls.status.setValue(check.status);
              this.reviewForm.controls.keterangan.setValue(check.keterangan);
              this.reviewForm.controls.tipe.setValue(check.tipe);
              this.reviewForm.controls.id.setValue(check.id);
            } else {
              this.reviewForm.reset();
            }

            this.gotoLink(this.tabActive);
          }
        });
      }
    } else if (tab == 'data_inventaris') {
      let data = {
        organisasi_id: this.organisasiID,
        status: this.reviewForm.controls.status.value,
        keterangan: this.reviewForm.controls.keterangan.value,
        tipe: tab,
        tanggal_review: moment().format('YYYY-MM-DD'),
        userid_review: this.userID,
      };

      this.isLoading = true;
      if (this.reviewForm.controls.id.value) {
        this.apiService
          .updateVerifikasi(this.reviewForm.controls.id.value, data)
          .subscribe((res) => {
            if (res) {
              this.tabActive = 'data_pendukung';
              this.isLoading = false;

              let check = this.dataValidation
                ? this.dataValidation.find((i) => i.tipe == this.tabActive)
                : null;

              if (check) {
                this.reviewForm.controls.id.setValue(check.id);
                this.reviewForm.controls.status.setValue(check.status);
                this.reviewForm.controls.keterangan.setValue(check.keterangan);
                this.reviewForm.controls.tipe.setValue(check.tipe);
                this.reviewForm.controls.id.setValue(check.id);
              } else {
                this.reviewForm.reset();
              }

              this.gotoLink(this.tabActive);
            }
          });
      } else {
        this.apiService.createVerifikasi(data).subscribe((res) => {
          if (res) {
            this.tabActive = 'data_pendukung';
            this.isLoading = false;

            let check = this.dataValidation
              ? this.dataValidation.find((i) => i.tipe == this.tabActive)
              : null;

            if (check) {
              this.reviewForm.controls.id.setValue(check.id);
              this.reviewForm.controls.status.setValue(check.status);
              this.reviewForm.controls.keterangan.setValue(check.keterangan);
              this.reviewForm.controls.tipe.setValue(check.tipe);
              this.reviewForm.controls.id.setValue(check.id);
            } else {
              this.reviewForm.reset();
            }

            this.gotoLink(this.tabActive);
          }
        });
      }
    } else if (tab == 'data_pendukung') {
      let data = {
        organisasi_id: this.organisasiID,
        status: this.reviewForm.controls.status.value,
        keterangan: this.reviewForm.controls.keterangan.value,
        tipe: tab,
        tanggal_review: moment().format('YYYY-MM-DD'),
        userid_review: this.userID,
      };

      this.isLoading = true;
      if (this.reviewForm.controls.id.value) {
        this.apiService
          .updateVerifikasi(this.reviewForm.controls.id.value, data)
          .subscribe((res) => {
            if (res) {
              this.tabActive = 'review';
              this.isLoading = false;

              this.getValidation();
              this.gotoLink(this.tabActive);
            }
          });
      } else {
        this.apiService.createVerifikasi(data).subscribe((res) => {
          if (res) {
            this.tabActive = 'review';
            this.isLoading = false;

            this.getValidation();
            this.gotoLink(this.tabActive);
          }
        });
      }
    }
  }

  prev(tab: string) {
    if (tab == 'data_organisasi') {
      this.tabActive = 'general';
    } else if (tab == 'data_anggota') {
      this.tabActive = 'data_organisasi';
      this.getValidation();
    } else if (tab == 'data_inventaris') {
      this.tabActive = 'data_anggota';
      this.getValidation();
    } else if (tab == 'data_pendukung') {
      this.tabActive = 'data_inventaris';
      this.getValidation();
    } else if (tab == 'review') {
      this.tabActive = 'data_pendukung';
      this.getValidation();
    }

    this.gotoLink(this.tabActive);
  }

  saveStatusPendaftaran() {
    this.isLoading = true;
    let data = {
      organisasi_id: this.organisasi.id,
      status: this.checkValidasi() ? 'Allow' : 'Denny',
    };
    this.apiService.updateStatusPendaftaran(data).subscribe(
      (res) => {
        if (res) {
          this.isLoading = false;
          this.updateStatus();
        }
      },
      (error) => console.log('error')
    );
  }

  saveOrganisasi() {
    this.isLoading = true;

    this.apiService
      .saveOrganisasi(this.organisasiForm.value)
      .subscribe((res) => {
        console.log(res);
        this.isLoading = false;
      });
  }

  updateStatus() {
    this.router.navigateByUrl('/admin/homepage');
  }

  getOrganisasi() {
    this.isLoading = true;

    this.apiService.getOrganisasiDetail(this.organisasiID).subscribe(
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

        this.listDocuments.map((item) => {
          let linkImage = `${environment.url}uploads/organisasi/${item.organisasi_id}`;
          if (item.tipe == 'KTP') {
            this.fotoKTPPreview = `${linkImage}/${item.image}`;
          } else if (item.tipe == 'PAS-FOTO') {
            this.pasFotoPreview = `${linkImage}/${item.image}`;
          } else if (item.tipe == 'BANNER') {
            this.bannerPreview = `${linkImage}/${item.image}`;
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

      return checkKetua && checkSekretaris ? false : true;
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

  replaceString(string) {
    if (string) {
      return string.replace('_', ' ');
    }
  }
}
