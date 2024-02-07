import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public reqHeader: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentHeader.subscribe((header) => {
      this.reqHeader = header;
      // console.log(this.reqHeader);
    });
  }

  getOrganisasiList() {
    return this.http
      .get(environment.apiUrl + `get-organisasi-users`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getUsers() {
    return this.http
      .get(environment.apiUrl + `users`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getImage(data) {
    return this.http
      .post(environment.apiUrl + `get-image`, data, {
        headers: this.reqHeader,
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  createUser(data) {
    return this.http
      .post(environment.apiUrl + `users`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  updateUser(userID, data) {
    return this.http
      .put(environment.apiUrl + `users/${userID}`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userID) {
    return this.http
      .delete(environment.apiUrl + `users/${userID}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getJenisKesenianAll() {
    return this.http
      .get(environment.apiUrl + `jenis-kesenian-all`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getJenisKesenian() {
    return this.http
      .get(environment.apiUrl + `jenis-kesenian`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  createJenisKesenian(data) {
    return this.http
      .post(environment.apiUrl + `jenis-kesenian`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  updateJenisKesenian(jenisKesenianID, data) {
    return this.http
      .put(environment.apiUrl + `jenis-kesenian/${jenisKesenianID}`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  deleteJenisKesenian(jenisKesenianID) {
    return this.http
      .delete(environment.apiUrl + `jenis-kesenian/${jenisKesenianID}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getOrganisasiByUser(userid) {
    return this.http
      .get(environment.apiUrl + `get-organisasi-user/${userid}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getOrganisasiDetail(id) {
    return this.http
      .get(environment.apiUrl + `get-organisasi-detail/${id}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  saveOrganisasi(data) {
    return this.http
      .post(environment.apiUrl + `save-organisasi-user`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  checkOrganisasi(data) {
    return this.http
      .post(environment.apiUrl + `check-organisasi`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  importData(data) {
    return this.http
      .post(environment.apiUrl + `import-data`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  deleteOrganisasi(id) {
    return this.http
      .delete(environment.apiUrl + `delete-organisasi-user/${id}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getAnggotaByUser(userid) {
    return this.http
      .get(environment.apiUrl + `anggota/${userid}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  createAnggota(data) {
    return this.http
      .post(environment.apiUrl + `anggota`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  createAnggotaLain(data) {
    return this.http
      .post(environment.apiUrl + `anggota-lain`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  updateAnggota(anggotaid, data) {
    return this.http
      .put(environment.apiUrl + `anggota/${anggotaid}`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  deleteAnggota(anggotaid) {
    return this.http
      .delete(environment.apiUrl + `anggota/${anggotaid}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getInventarisByUser(userid) {
    return this.http
      .get(environment.apiUrl + `inventaris/${userid}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  createInventaris(data) {
    return this.http
      .post(environment.apiUrl + `inventaris`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  updateInventaris(inventarisid, data) {
    return this.http
      .put(environment.apiUrl + `inventaris/${inventarisid}`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  deleteInventaris(inventarisid) {
    return this.http
      .delete(environment.apiUrl + `inventaris/${inventarisid}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getDocument(organisasi_id) {
    return this.http
      .get(environment.apiUrl + `get-documents/${organisasi_id}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  uploadDocument(organisasi_id, type, image) {
    const formData = new FormData();

    formData.append('organisasi_id', organisasi_id);
    formData.append('tipe', type);
    if (image) {
      formData.append('image', image);
    }

    return this.http
      .post(environment.apiUrl + `upload-document`, formData, {
        // headers: this.reqHeader, multipart/form-data
      })
      .pipe(catchError(this.handleError));
  }

  deleteDocument(id) {
    return this.http
      .delete(environment.apiUrl + `delete-document/${id}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getVerifikasi(organisasi_id) {
    return this.http
      .get(environment.apiUrl + `verifikasi/${organisasi_id}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  updateStatusPendaftaran(data) {
    return this.http
      .post(environment.apiUrl + `final-verifikasi`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  createVerifikasi(data) {
    return this.http
      .post(environment.apiUrl + `verifikasi`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  updateVerifikasi(id, data) {
    return this.http
      .put(environment.apiUrl + `verifikasi/${id}`, data, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getWilayah(id = null) {
    return this.http
      .get(environment.apiUrl + `wilayah?id=${id}`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  getWilayahALl() {
    return this.http
      .get(environment.apiUrl + `wilayah-all`, {
        headers: this.reqHeader,
      })
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
