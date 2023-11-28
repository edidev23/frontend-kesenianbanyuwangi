import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-homepage-kik',
  templateUrl: './homepage-kik.component.html',
  styleUrls: ['./homepage-kik.component.scss'],
})
export class HomepageKikComponent implements OnInit {
  userID: string;
  role: string;

  isLoading: boolean = false;
  organisasi: any;
  dataVerifikasi: any;

  constructor(
    private router: Router,
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
        this.role = dataStorage.role;

        if (this.role == 'user-kik') {
          this.getData();
        }
      }
    }
  }

  getData() {
    this.isLoading = true;

    this.apiService.getOrganisasiByUser(this.userID).subscribe(
      (res: any) => {
        this.isLoading = false;

        console.log(res);

        if (res && res.data) {
          this.organisasi = res.data;

          if (this.organisasi && !this.organisasi.status) {
            this.router.navigateByUrl('/registrasi');
          } else {
            this.apiService
              .getVerifikasi(this.organisasi.id)
              .subscribe((res: any) => {
                if (res) {
                  this.dataVerifikasi = res.data.filter(
                    (i) => i.status == 'tdk_valid'
                  );
                }
              });
          }
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  gotoRegistrasi() {
    this.router.navigateByUrl('/registrasi');
  }
}
