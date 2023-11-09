import { Component, OnInit } from '@angular/core';
import { ModalAnggotaComponent } from './modal-anggota/modal-anggota.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.component.html',
  styleUrls: ['./registrasi.component.scss'],
})
export class RegistrasiComponent implements OnInit {
  tabActive: string = 'general';
  files: any[] = [];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  addAnggota() {
    const modalRef = this.modalService.open(ModalAnggotaComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.type = 'ADD';
    // modalRef.componentInstance.tenantID = this.tenantID;

    modalRef.componentInstance.emitModal.subscribe((res: any) => {
      if (res) {
        console.log(res);
      }
    });
  }

  next(tab: string) {
    if (tab == 'general') {
      this.tabActive = 'data_organisasi';
    } else if (tab == 'data_organisasi') {
      this.tabActive = 'data_anggota';
    } else if (tab == 'data_anggota') {
      this.tabActive = 'interior';
    } else if (tab == 'interior') {
      this.tabActive = 'exterior';
    } else if (tab == 'exterior') {
      this.tabActive = 'photo';
    } else if (tab == 'photo') {
      this.tabActive = 'publish';
    }
  }

  prev(tab: string) {
    if (tab == 'data_organisasi') {
      this.tabActive = 'general';
    } else if (tab == 'data_anggota') {
      this.tabActive = 'data_organisasi';
    } else if (tab == 'interior') {
      this.tabActive = 'data_anggota';
    } else if (tab == 'exterior') {
      this.tabActive = 'interior';
    } else if (tab == 'photo') {
      this.tabActive = 'exterior';
    } else if (tab == 'publish') {
      this.tabActive = 'photo';
    }
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files: any) {
    // if(files) {
    //   this.prepareFilesList(files);
    // }
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
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
}
