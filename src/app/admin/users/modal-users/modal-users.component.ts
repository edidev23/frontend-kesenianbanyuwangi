import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-modal-users',
  templateUrl: './modal-users.component.html',
  styleUrls: ['./modal-users.component.scss'],
})
export class ModalUsersComponent implements OnInit {
  isLoading: boolean;

  @Input() detailUser: any;
  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  userForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    email: ['', Validators.required],
    role: ['', Validators.required],
    password: [''],
  });

  jabatanList: any;
  errorList: any;

  constructor(
    public modalService: NgbModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (this.detailUser) {
      this.userForm.controls.id.setValue(this.detailUser.id);
      this.userForm.controls.name.setValue(this.detailUser.name);
      this.userForm.controls.email.setValue(this.detailUser.email);
      this.userForm.controls.role.setValue(this.detailUser.role);
    }
  }

  close() {
    this.modalService.dismissAll();
  }

  save() {
    this.isLoading = true;

    let dataUser = this.userForm.value;
    for (const key in dataUser) {
      if (dataUser[key] == '' || dataUser[key] == null) {
        delete dataUser[key];
      }
    }

    if (this.userForm.controls.id.value) {
      this.apiService
        .updateUser(this.userForm.controls.id.value, dataUser)
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
      this.apiService.createUser(dataUser).subscribe(
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
