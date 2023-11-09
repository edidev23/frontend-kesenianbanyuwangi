import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBullhorn,
  faCog,
  faEnvelope,
  faHeart,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}
}
