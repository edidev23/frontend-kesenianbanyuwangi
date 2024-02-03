import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-modal-anggota',
  templateUrl: './modal-anggota.component.html',
  styleUrls: ['./modal-anggota.component.scss'],
})
export class ModalAnggotaComponent implements OnInit {
  isLoading: boolean;

  @Input() organisasi_id: string;
  @Input() userList: any;
  @Input() detailAnggota: any;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  anggotaOrgLain: any;

  anggotaForm = this.fb.group({
    id: [''],
    nama: ['', Validators.required],
    nik: ['', Validators.required],
    jabatan: ['', Validators.required],
    organisasi_id: ['', Validators.required],
    tanggal_lahir: [''],
    jenis_kelamin: [''],
    pekerjaan: [''],
    alamat: [''],
    whatsapp: [''],
    telepon: [''],
  });

  jabatanList: any = [];
  errorList: any;

  constructor(
    public modalService: NgbModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    let jabatanSelected = [];
    if (this.userList) {
      this.userList.map((item) => {
        jabatanSelected.push(item.jabatan);
      });
    }

    let listJabatan = [
      'Ketua',
      'Wakil',
      'Penasehat',
      'Sekretaris',
      'Bendahara',
      'Anggota',
    ];

    console.log(jabatanSelected);

    listJabatan.map((item) => {
      if (jabatanSelected.indexOf(item) !== -1 && item != 'Anggota') {
        //console.log(`${searchString} is in the array.`);
      } else {
        this.jabatanList.push(item);
      }
    });

    if (this.detailAnggota) {
      if (
        this.detailAnggota.jabatan &&
        this.detailAnggota.jabatan != 'Anggota'
      ) {
        this.jabatanList.push(this.detailAnggota.jabatan);
      }

      this.anggotaForm.controls.id.setValue(this.detailAnggota.id);
      this.anggotaForm.controls.nama.setValue(this.detailAnggota.nama);
      this.anggotaForm.controls.nik.setValue(this.detailAnggota.nik);
      this.anggotaForm.controls.jabatan.setValue(this.detailAnggota.jabatan);
      this.anggotaForm.controls.organisasi_id.setValue(
        this.organisasi_id ? this.organisasi_id.toString() : ''
      );
      this.anggotaForm.controls.tanggal_lahir.setValue(
        this.detailAnggota.tanggal_lahir
      );
      this.anggotaForm.controls.jenis_kelamin.setValue(
        this.detailAnggota.jenis_kelamin
      );
      this.anggotaForm.controls.pekerjaan.setValue(
        this.detailAnggota.pekerjaan
      );
      this.anggotaForm.controls.alamat.setValue(this.detailAnggota.alamat);
      this.anggotaForm.controls.whatsapp.setValue(this.detailAnggota.whatsapp);
      this.anggotaForm.controls.telepon.setValue(this.detailAnggota.telepon);
    } else {
      this.anggotaForm.controls.organisasi_id.setValue(
        this.organisasi_id.toString()
      );
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  save() {
    this.isLoading = true;

    let anggotaList = this.anggotaForm.value;
    for (const key in anggotaList) {
      if (anggotaList[key] == '' || anggotaList[key] == null) {
        delete anggotaList[key];
      }
    }

    let noWhatsapp: string = this.anggotaForm.controls.whatsapp.value;

    if (noWhatsapp) {
      this.anggotaForm.controls.whatsapp.setValue(noWhatsapp);
    }

    if (this.anggotaForm.controls.id.value) {
      this.apiService
        .updateAnggota(this.anggotaForm.controls.id.value, anggotaList)
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            if (res && res.data) {
              this.emitModal.emit(res.data);
              this.close();
            }
          },
          (err) => {
            this.isLoading = false;

            this.errorList = err.error.message;
          }
        );
    } else {
      this.apiService.createAnggota(anggotaList).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res && res.data) {
            this.emitModal.emit(res.data);
            this.close();
          }
        },
        (err) => {
          this.isLoading = false;

          this.errorList = err.error.message;

          let check = this.errorList.find(
            (e) => e == 'Anggota Organisasi Lain.'
          );

          console.log(check, err.error);

          if (check) {
            this.anggotaOrgLain = err.error.data;
            console.log(this.anggotaOrgLain);
          }
        }
      );
    }
  }

  tambahAggotaOrgLain() {
    console.log(this.anggotaOrgLain.id, this.organisasi_id);

    this.isLoading = true;

    let data = {
      anggota_id: this.anggotaOrgLain.id,
      organisasi_id: this.organisasi_id,
    };

    this.apiService.createAnggotaLain(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          this.emitModal.emit(res.data);
          this.close();
        }
      },
      (err) => {
        this.isLoading = false;

        this.errorList = err.error.message;
      }
    );
  }
}
