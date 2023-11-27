import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-modal-inventaris',
  templateUrl: './modal-inventaris.component.html',
  styleUrls: ['./modal-inventaris.component.scss']
})
export class ModalInventarisComponent implements OnInit {

  isLoading: boolean;

  @Input() organisasi_id: string;
  @Input() detailInventaris: any;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  inventarisForm = this.fb.group({
    id: [''],
    nama: ['', Validators.required],
    jumlah: ['', Validators.required],
    organisasi_id: ['', Validators.required],
    pembelian_th: [''],
    kondisi: [''],
    keterangan: [''],
  });

  jabatanList: any;
  errorList: any;

  constructor(
    public modalService: NgbModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    

    if (this.detailInventaris) {
      this.inventarisForm.controls.id.setValue(this.detailInventaris.id);
      this.inventarisForm.controls.nama.setValue(this.detailInventaris.nama);
      this.inventarisForm.controls.pembelian_th.setValue(this.detailInventaris.pembelian_th);
      this.inventarisForm.controls.organisasi_id.setValue(
        this.detailInventaris.organisasi_id.toString()
      );
      this.inventarisForm.controls.jumlah.setValue(
        this.detailInventaris.jumlah
      );
      this.inventarisForm.controls.kondisi.setValue(
        this.detailInventaris.kondisi
      );
      this.inventarisForm.controls.keterangan.setValue(
        this.detailInventaris.keterangan
      );
      
    } else {
      this.inventarisForm.controls.organisasi_id.setValue(
        this.organisasi_id.toString()
      );
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  save() {
    this.isLoading = true;

    let inventarisList = this.inventarisForm.value;
    for (const key in inventarisList) {
      if (inventarisList[key] == '' || inventarisList[key] == null) {
        delete inventarisList[key];
      }
    }

    if (this.inventarisForm.controls.id.value) {
      this.apiService
        .updateInventaris(this.inventarisForm.controls.id.value, inventarisList)
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
      this.apiService.createInventaris(inventarisList).subscribe(
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
