import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalUsersComponent } from './modal-users/modal-users.component';
import { ModalDeleteComponent } from 'src/app/utils/modal-delete/modal-delete.component';
import { ModalMessageComponent } from 'src/app/utils/modal-message/modal-message.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  isLoading: boolean;

  userID: string;
  role: string;

  dataUsers: any;

  faPencil = faPen;
  faDelete = faTrash;

  dataOrganisasi: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
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
    this.isLoading = true;
    this.apiService.getUsers().subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.dataUsers = res.sort((a, b) => a.role.localeCompare(b.role) && a.name.localeCompare(b.name));
        console.log(this.dataUsers);
      }
    });

    this.apiService.getOrganisasiList().subscribe((res: any) => {
      if (res) {
        this.dataOrganisasi = res.data;
      }
    });
  }

  checkOrganisasi(userid) {
    if (this.dataOrganisasi) {
      let check = this.dataOrganisasi.find((d) => d.user_id == userid);

      return check ? check.nama : '';
    }
  }

  createUser() {
    const modalRef = this.modalService.open(ModalUsersComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        this.getData();
      }
    });
  }

  editUser(i, data) {
    const modalRef = this.modalService.open(ModalUsersComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'EDIT';
    modalRef.componentInstance.detailUser = data;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        this.getData();
      }
    });
  }

  deleteUser(i, id) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      size: 'sm',
    });

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      this.isLoading = true;
      this.apiService.deleteUser(id).subscribe(
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
}
