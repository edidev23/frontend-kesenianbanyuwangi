import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public btnsignin = 'MASUK';
  public btnsignup = 'DAFTAR';
  btnverify: string = 'CONFIRM';

  public signstatus = 'signin';
  public errorMsg = '';
  public successMsg = '';

  public email: string = '';
  public password: string = '';

  public isLoading: boolean;

  @ViewChild('code1') code1!: ElementRef;
  @ViewChild('code2') code2!: ElementRef;
  @ViewChild('code3') code3!: ElementRef;
  @ViewChild('code4') code4!: ElementRef;
  @ViewChild('code5') code5!: ElementRef;
  @ViewChild('code6') code6!: ElementRef;

  value_code1 = '';
  value_code2 = '';
  value_code3 = '';
  value_code4 = '';
  value_code5 = '';
  value_code6 = '';

  public codeverify: string = '';

  addForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    whatsapp: ['', Validators.required],
    role: ['user-kik', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    let resp = await this.authService.getToken();

    if (resp) {
      this.router.navigateByUrl('/homepage');
    } else {
      this.activeRoute.queryParamMap.subscribe((params: any) => {
        if (params.params.code) {
          this.codeverify = params.params.code;
        }
        if (params.params.email) {
          this.email = params.params.email;
        }

        if (this.codeverify && this.email) {
          this.verifycode();
        } else {
          this.signstatus = 'signin';
        }
      });
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
            this.router.navigateByUrl('/homepage');
          } else if (resp.role == 'admin') {
            this.router.navigateByUrl('/admin/homepage');
          } else {
            localStorage.removeItem('expired');
            localStorage.removeItem('token');
            localStorage.removeItem('users');
            this.successMsg = '';
            this.errorMsg = 'Sistem Masih dalam pengembangan!';
          }
        }
      },
      (error: any) => {
        console.log(error);
        this.errorMsg = error.error.message;
        this.successMsg = '';
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
            this.signstatus = 'verify';
            this.email = this.addForm.controls.email.value;
            this.resetForm();

            this.errorMsg = '';
            this.successMsg =
              'Pendaftaran Berhasil, Silahkan cek email anda untuk verifikasi akun!';
          }
        },
        (error: any) => {
          this.isLoading = false;
          this.errorMsg = error.error.message[0];
          this.successMsg = '';
          console.log(error);
        }
      );
    }
  }

  verifycode() {
    let verifycode =
      this.value_code1 +
      this.value_code2 +
      this.value_code3 +
      this.value_code4 +
      this.value_code5 +
      this.value_code6;

    if (this.email) {
      let data = {
        email: this.email,
        code: this.codeverify ? this.codeverify : verifycode,
      };
      this.isLoading = true;

      this.authService.verifyCode(data).subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
          this.signstatus = 'signin';
          this.successMsg =
            'Verifikasi email Berhasil. Login dengan email dan password anda.';
        },
        (err) => {
          this.isLoading = false;
          this.errorMsg = err.error.message;
          this.email = '';
        }
      );
    }
  }

  selectAll(inputField: HTMLInputElement) {
    inputField.select();
  }

  onContextMenu(event: MouseEvent) {
    // console.log(event);
    event.preventDefault();
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const clipboardData: any = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const charArray = pastedText.split('');

    if (!isNaN(Number(pastedText)) && parseInt(pastedText) >= 0) {
      if (charArray) {
        if (index == 1) {
          this.value_code1 = charArray[0];
          this.value_code2 = charArray[1];
          this.value_code3 = charArray[2];
          this.value_code4 = charArray[3];
          this.value_code5 = charArray[4];
          this.value_code6 = charArray[5];
        } else if (index == 2) {
          this.value_code2 = charArray[0];
          this.value_code3 = charArray[1];
          this.value_code4 = charArray[2];
          this.value_code5 = charArray[3];
          this.value_code6 = charArray[4];
        } else if (index == 3) {
          this.value_code3 = charArray[0];
          this.value_code4 = charArray[1];
          this.value_code5 = charArray[2];
          this.value_code6 = charArray[3];
        } else if (index == 4) {
          this.value_code4 = charArray[0];
          this.value_code5 = charArray[1];
          this.value_code6 = charArray[2];
        } else if (index == 5) {
          this.value_code5 = charArray[0];
          this.value_code6 = charArray[1];
        } else if (index == 6) {
          this.value_code6 = charArray[0];
        }
      }
    }
  }

  onInputKeydown(params: KeyboardEvent, index: number) {
    if (params.key === 'v' && (params.ctrlKey || params.metaKey)) {
      params.preventDefault();
      // console.log('Pasted from keyboard');
    } else if (params.key === 'Backspace' || params.key === 'Delete') {
      if (index == 2) {
        this.code1.nativeElement.focus();
      } else if (index == 3) {
        this.code2.nativeElement.focus();
      } else if (index == 4) {
        this.code3.nativeElement.focus();
      } else if (index == 5) {
        this.code4.nativeElement.focus();
      } else if (index == 6) {
        this.code5.nativeElement.focus();
      }
    } else {
      params.preventDefault();

      if (
        !params.ctrlKey &&
        !params.metaKey &&
        params.key != 'Control' &&
        params.key != 'Meta'
      ) {
        const inputValue = (params.target as HTMLInputElement).value;

        if (!isNaN(Number(inputValue)) && parseInt(inputValue) >= 0) {
          let singleNumb = inputValue.split('');
          if (index == 1) {
            this.code2.nativeElement.focus();
            this.value_code1 = singleNumb[0];
            this.value_code2 = '';
          } else if (index == 2) {
            this.code3.nativeElement.focus();
            this.value_code2 = singleNumb[0];
            this.value_code3 = '';
          } else if (index == 3) {
            this.code4.nativeElement.focus();
            this.value_code3 = singleNumb[0];
            this.value_code4 = '';
          } else if (index == 4) {
            this.code5.nativeElement.focus();
            this.value_code4 = singleNumb[0];
            this.value_code5 = '';
          } else if (index == 5) {
            this.code6.nativeElement.focus();
            this.value_code5 = singleNumb[0];
            this.value_code6 = '';
          } else if (index == 6) {
            this.value_code6 = singleNumb[0];
            this.code6.nativeElement.blur();
          }
        } else {
          return false;
        }
      } else {
        this.code1.nativeElement.blur();
        this.code2.nativeElement.blur();
        this.code3.nativeElement.blur();
        this.code4.nativeElement.blur();
        this.code5.nativeElement.blur();
        this.code6.nativeElement.blur();
        return false;
      }
    }
  }
}
