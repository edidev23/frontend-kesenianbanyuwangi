import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public btnsignin = 'MASUK';
  public btnsignup = 'DAFTAR';

  public signstatus = 'signin';
  public errorMsg = '';
  public successMsg = '';

  public email: string = '';
  public password: string = '';

  public isLoading: boolean;

  addForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    role: ['user-kik', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    let resp = await this.authService.getToken();

    if (resp) {
      this.router.navigateByUrl('/registrasi');
    }
  }

  resetForm() {
    this.addForm.reset();
    this.addForm.controls.role.setValue('user-kik');
  }

  signin() {
    this.signstatus = 'signin';
    this.email = '';
    this.password = '';
    this.errorMsg = '';
    this.successMsg = '';
    this.resetForm();
  }

  login(email, password) {
    let data = {
      email: email,
      password: password,
    };
    this.isLoading = true;
    this.authService.login(data).subscribe(
      async (res: any) => {
        if (res) {
          console.log(res);
          this.isLoading = false;
          let resp = await this.authService.getToken(res.data);
          if (resp.role == 'user-kik') {
            this.router.navigateByUrl('/registrasi');
          } else {
            localStorage.removeItem('expired');
            localStorage.removeItem('token');
            localStorage.removeItem('users');
            this.errorMsg = 'Sistem Masih dalam pengembangan!';
          }
        }
      },
      (error: any) => {
        console.log(error);
        this.errorMsg = error.error.message;
        this.isLoading = false;
      }
    );
  }

  signup() {
    this.signstatus = 'signup';
    this.email = '';
    this.password = '';
    this.errorMsg = '';
    this.successMsg = '';
    this.resetForm();
  }

  signupProccess() {
    if (
      this.addForm.controls.password.value !=
      this.addForm.controls.confirmPassword.value
    ) {
      this.errorMsg = 'Password tidak sama';
    } else {
      this.isLoading = true;
      this.authService.signup(this.addForm.value).subscribe(
        (res) => {
          if (res) {
            console.log(res);
            this.isLoading = false;
            this.signstatus = 'signin';
            this.resetForm();

            this.successMsg =
              'Pendaftaran Berhasil, Silahkan Masuk dengan Email dan password!';
          }
        },
        (error: any) => {
          this.isLoading = false;
          this.errorMsg = error.error.message[0];
          console.log(error);
        }
      );
    }
  }
}
