import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBullhorn,
  faCog,
  faEnvelope,
  faHeart,
  faListAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  faSetting = faCog;
  faList = faListAlt;
  faHeart = faHeart;
  faMail = faEnvelope;
  faNotice = faBullhorn;
  faLogout = faSignOutAlt;

  userID: string;
  role: string;

  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    let resp = await this.authService.getToken();

    if (!resp) {
      this.router.navigateByUrl('/login');
    } else {
      let dataStorage = JSON.parse(localStorage.getItem('users'));
      this.userID = dataStorage ? dataStorage.id : '';

      if (this.userID) {
        this.role = dataStorage.role;

        this.getData();
      }
    }
  }

  getData() {
    this.isLoading = true;
  }

  logout() {
    localStorage.removeItem('expired');
    localStorage.removeItem('token');
    localStorage.removeItem('users');

    this.router.navigateByUrl('login');
  }
}
