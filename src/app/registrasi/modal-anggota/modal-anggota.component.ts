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
  @Input() detailAnggota: any;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  anggotaForm = this.fb.group({
    id: [''],
    nama: ['', Validators.required],
    jabatan: ['', Validators.required],
    organisasi_id: ['', Validators.required],
    tanggal_lahir: [''],
    jenis_kelamin: [''],
    pekerjaan: [''],
    alamat: [''],
    whatsapp: [''],
    telepon: [''],
  });

  jabatanList: any;
  errorList: any;

  constructor(
    public modalService: NgbModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.jabatanList = [
      'Ketua',
      'Wakil',
      'Penasehat',
      'Sekretaris',
      'Bendahara',
      'Anggota',
    ];

    if (this.detailAnggota) {
      this.anggotaForm.controls.id.setValue(this.detailAnggota.id);
      this.anggotaForm.controls.nama.setValue(this.detailAnggota.nama);
      this.anggotaForm.controls.jabatan.setValue(this.detailAnggota.jabatan);
      this.anggotaForm.controls.organisasi_id.setValue(
        this.detailAnggota.organisasi_id.toString()
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
        }
      );
    }
  }
}
