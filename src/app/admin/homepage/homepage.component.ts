import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  isLoading: boolean;

  userID: string;
  role: string;

  dataKesenian: any;

  faPencil = faPen

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
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
    this.apiService.getOrganisasiList().subscribe((res: any) => {
      if (res) {
        this.dataKesenian = res.data.filter(
          (d) =>
            d.status == 'Request' || d.status == 'Allow' || d.status == 'Denny'
        );
      }
    });
  }
}
