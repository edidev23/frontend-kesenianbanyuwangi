import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtToken = new BehaviorSubject<string>('');
  private reqHeader = new BehaviorSubject<any>([]);

  currentHeader = this.reqHeader.asObservable();
  currentjwtToken = this.jwtToken.asObservable();

  constructor(private http: HttpClient, private route: Router) {
    // this.setHeader();
  }

  async getToken(dataResp = null) {
    try {
      let token = localStorage.getItem('token');
      let expired = localStorage.getItem('expired');
      let dataUser = localStorage.getItem('users')
        ? JSON.parse(localStorage.getItem('users'))
        : null;
      let datenow = Date.now();

      if (token && datenow < parseInt(expired)) {
        let gh = new HttpHeaders();
        gh = gh.set('Authorization', 'Bearer ' + token);
        gh = gh.set('Content-Type', 'application/json');
        this.fillGetHeader(gh);

        return dataUser;
      } else if (token) {
        // get refresh token
        let gh = new HttpHeaders();
        gh = gh.set('Authorization', 'Bearer ' + token);
        gh = gh.set('Content-Type', 'application/json');
        const response: any = await this.http
          .post(environment.apiUrl + 'refresh-token', '', {
            headers: gh,
          })
          .toPromise();

        if (response) {
          let time = Date.now() + parseInt(response.data.expires_in) * 1000;
          localStorage.setItem('expired', time.toString());
          localStorage.setItem('token', response.data.token);

          let gh = new HttpHeaders();
          gh = gh.set('Authorization', 'Bearer ' + response.data.token);
          gh = gh.set('Content-Type', 'application/json');
          this.fillGetHeader(gh);

          return dataUser;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('expired');
          localStorage.removeItem('users');
          this.route.navigateByUrl('/login');

          return null;
        }
      } else {
        // data exist after login
        if (dataResp) {
          console.log(dataResp);
          let time = Date.now() + parseInt(dataResp.expires_in) * 1000;

          localStorage.setItem('expired', time.toString());
          localStorage.setItem('token', dataResp.token);
          localStorage.setItem('users', JSON.stringify(dataResp));

          let gh = new HttpHeaders();
          gh = gh.set('Authorization', 'Bearer ' + dataResp.token);
          gh = gh.set('Content-Type', 'application/json');
          this.fillGetHeader(gh);

          return dataResp;
        } else {
          return null;
        }
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('expired');
      localStorage.removeItem('users');
      this.route.navigateByUrl('/login');
      console.error(error);

      return null;
    }
  }

  filljwtToken(token: string) {
    this.jwtToken.next(token);
  }

  fillGetHeader(header) {
    this.reqHeader.next(header);
  }

  login(data) {
    return this.http
      .post(environment.apiUrl + `login`, data)
      .pipe(catchError(this.handleError));
  }

  signup(data) {
    return this.http
      .post(environment.apiUrl + `register`, data)
      .pipe(catchError(this.handleError));
  }

  verifyCode(data) {
    return this.http
      .post(environment.apiUrl + `verify-code`, data)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
