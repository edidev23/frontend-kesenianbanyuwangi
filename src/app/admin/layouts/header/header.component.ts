import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {
  faBullhorn,
  faCog,
  faEnvelope,
  faHeart,
  faIdCard,
  faList,
  faListAlt,
  faRunning,
  faSignOutAlt,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userID: any;
  role: any;

  faIdCard = faIdCard;
  faLogout = faSignOutAlt;
  faRunning = faRunning;
  faUsers = faUserFriends;

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
      }
    }
  }

  logout() {
    localStorage.removeItem('expired');
    localStorage.removeItem('token');
    localStorage.removeItem('users');

    this.router.navigateByUrl('login');
  }
}
