import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preview-kartu',
  templateUrl: './preview-kartu.component.html',
  styleUrls: ['./preview-kartu.component.scss'],
})
export class PreviewKartuComponent implements OnInit {
  @Input() public dataOrganisasi;
  imageUrl;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.imageUrl = `${environment.url}uploads/organisasi/${this.dataOrganisasi.id}/${this.dataOrganisasi.kartu}`;
    console.log(this.imageUrl);
  }
  close() {
    this.modalService.dismissAll();
  }
}
