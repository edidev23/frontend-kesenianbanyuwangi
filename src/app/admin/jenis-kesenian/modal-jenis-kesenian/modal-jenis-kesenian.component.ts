import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-modal-jenis-kesenian',
  templateUrl: './modal-jenis-kesenian.component.html',
  styleUrls: ['./modal-jenis-kesenian.component.scss'],
})
export class ModalJenisKesenianComponent implements OnInit {
  isLoading: boolean;

  @Input() type: any;
  @Input() parentJenisKesenian: any;
  @Input() detailJenisKesenian: any;
  @Input() subJenisKesenian: any;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  jenisKesenianForm = this.fb.group({
    id: [''],
    nama: ['', Validators.required],
    parent: ['', Validators.required],
  });

  errorList: any;

  constructor(
    public modalService: NgbModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (this.detailJenisKesenian) {
      this.jenisKesenianForm.controls.id.setValue(this.detailJenisKesenian.id);
      this.jenisKesenianForm.controls.nama.setValue(
        this.detailJenisKesenian.nama
      );

      if (this.type == 'sub') {
        this.jenisKesenianForm.controls.id.setValue(this.subJenisKesenian.id);
        this.jenisKesenianForm.controls.nama.setValue(
          this.subJenisKesenian.nama
        );
        this.jenisKesenianForm.controls.parent.setValue(
          this.detailJenisKesenian.id
        );
      }
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  save() {
    this.isLoading = true;

    let dataForm = this.jenisKesenianForm.value;
    for (const key in dataForm) {
      if (dataForm[key] == '' || dataForm[key] == null) {
        delete dataForm[key];
      }
    }

    if (this.jenisKesenianForm.controls.id.value) {
      this.apiService
        .updateJenisKesenian(this.jenisKesenianForm.controls.id.value, dataForm)
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
      this.apiService.createJenisKesenian(dataForm).subscribe(
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
