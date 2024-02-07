import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss'],
})
export class ImportModalComponent implements OnInit {
  spinnerEnabled = false;
  keys: string[];
  dataSheet: any;

  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;

  @Output() emitModal: EventEmitter<any> = new EventEmitter<any>();

  dataJenisKesenian: any;
  dataWilayahBwi: any;

  dataOrganisasi: any = [];

  constructor(public modalService: NgbModal, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getJenisKesenian();

    this.searchWilayah('BARUREJO');
  }

  getJenisKesenian() {
    this.apiService.getJenisKesenianAll().subscribe((res: any) => {
      if (res) {
        this.dataJenisKesenian = res.data;
      }
    });
  }

  searchWilayah(nama) {
    this.apiService.getWilayahALl().subscribe((res: any) => {
      if (res) {
        this.dataWilayahBwi = res.data;
      }
    });
  }

  capitalize(str) {
    return str.replaceAll(/^./u, (match) => match.toUpperCase());
  }

  close() {
    this.modalService.dismissAll();
  }

  onChange(evt) {
    console.log(evt);
    let data, header;
    const target: DataTransfer = <DataTransfer>evt.target;
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        console.log(data);
        this.dataSheet = data;
      };
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  excelSerialToDate(serial: number): Date {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const excelEpoch = new Date('1899-12-30').getTime();
    const date = new Date(excelEpoch + serial * millisecondsPerDay);
    let format: any = moment(date).format('YYYY-MM-DD');
    return !isNaN(date.getTime()) ? format : null;
  }

  save() {
    this.emitModal.emit(this.dataSheet);
    this.close();
  }

  generate() {
    console.log(this.dataSheet);

    let dataOrganisasi = [];

    this.dataSheet.map((item) => {
      item.TGL_BERDIRI = this.excelSerialToDate(item.TGL_BERDIRI);
      item.TGL_DAFTAR = this.excelSerialToDate(item.TGL_DAFTAR);
      item.TGL_IN = this.excelSerialToDate(item.TGL_IN);
      item.TGL_OUT = this.excelSerialToDate(item.TGL_OUT);

      let jns_kes = this.dataJenisKesenian.find(
        (j) => item.JNS_KES && j.jenis_kesenian_id_lama == item.JNS_KES
      );
      item.JNS_KES = jns_kes ? jns_kes.nama : '';
      let jns_kesenian_id = jns_kes ? jns_kes.id : '';

      let sub_kes = this.dataJenisKesenian.find(
        (j) => item.SUB_KES && j.sub_kesenian_id_lama == item.SUB_KES
      );
      item.SUB_KES = sub_kes ? sub_kes.nama : '';
      let sub_kesenian_id = sub_kes ? sub_kes.id : '';

      let kec = this.dataWilayahBwi.find(
        (w) =>
          item.NAMA_KEC && w.nama.toLowerCase() == item.NAMA_KEC.toLowerCase()
      );
      item.NAMA_KEC = kec ? kec.nama : '';
      let kec_id = kec ? kec.kode : '';

      let desa = this.dataWilayahBwi.find(
        (w) =>
          item.NAMA_KEL && w.nama.toLowerCase() == item.NAMA_KEL.toLowerCase()
      );
      item.NAMA_KEL = desa ? desa.nama : '';
      let kel_id = desa ? desa.kode : '';

      item.NO_TELP = this.formatTelepon(item.NO_TELP);

      this.dataOrganisasi.push({
        nomor_induk: item.NO_KELP.trim(),
        nama: item.NAM_KELOMPOK.trim(),
        nama_ketua: item.KETUA.trim(),
        no_telp_ketua: item.NO_TELP.trim(),
        tanggal_berdiri: item.TGL_BERDIRI,
        tanggal_daftar: item.TGL_DAFTAR,
        tanggal_cetak_kartu: item.TGL_IN,
        tanggal_expired: item.TGL_OUT,
        alamat: item.ALAMAT.trim(),
        desa: kel_id.trim(),
        kecamatan: kec_id.trim(),
        kabupaten: 'Banyuwangi',
        nama_desa: item.NAMA_KEL.trim(),
        nama_kecamatan: item.NAMA_KEC.trim(),
        jenis_kesenian: jns_kesenian_id,
        sub_kesenian: sub_kesenian_id,
        nama_jenis_kesenian: item.JNS_KES.trim(),
        nama_sub_kesenian: item.SUB_KES.trim(),
        jumlah_anggota: item.JML_ANGGOTA,
        status: 'DataLama',
        keterangan: 'Data Lama',
      });
    });
  }

  import() {
    this.apiService
      .importData({
        data: this.dataOrganisasi,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  formatTelepon(inputString) {
    return inputString
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace(/^\+62/, '08');
  }

  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = null;
  }
}
