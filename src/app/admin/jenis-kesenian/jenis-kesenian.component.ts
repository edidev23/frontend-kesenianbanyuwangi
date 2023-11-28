import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalJenisKesenianComponent } from './modal-jenis-kesenian/modal-jenis-kesenian.component';
import { ModalDeleteComponent } from 'src/app/utils/modal-delete/modal-delete.component';

@Component({
  selector: 'app-jenis-kesenian',
  templateUrl: './jenis-kesenian.component.html',
  styleUrls: ['./jenis-kesenian.component.scss'],
})
export class JenisKesenianComponent implements OnInit {
  isLoading: boolean;

  userID: string;
  role: string;

  dataJenisKesenian: any;

  faPencil = faPen;
  faDelete = faTrash;

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
    this.apiService.getJenisKesenian().subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.dataJenisKesenian = res.sort((a, b) =>
          a.nama.localeCompare(b.nama)
        );
      }
    });
  }

  createJenisKesenian() {
    const modalRef = this.modalService.open(ModalJenisKesenianComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';
    modalRef.componentInstance.parentJenisKesenian = this.dataJenisKesenian;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        this.getData();
      }
    });
  }

  editJenisKesenian(i, data, subItem = null) {
    const modalRef = this.modalService.open(ModalJenisKesenianComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'EDIT';

    modalRef.componentInstance.type = subItem ? 'sub' : 'parent';
    modalRef.componentInstance.detailJenisKesenian = data;
    modalRef.componentInstance.subJenisKesenian = subItem;
    modalRef.componentInstance.parentJenisKesenian = this.dataJenisKesenian;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        this.getData();
      }
    });
  }

  deleteJenisKesenian(i, id) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      size: 'sm',
    });

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      this.isLoading = true;
      this.apiService.deleteJenisKesenian(id).subscribe(
        (res) => {
          if (res) {
            this.getData();
            this.isLoading = false;
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
    });
  }
}
