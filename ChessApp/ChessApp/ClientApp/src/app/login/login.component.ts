import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { User } from '../user';
import { DataProviderService } from '../data-provider.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DataProviderService]
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    psw: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    lgn: ['', Validators.required],
    psw: ['', Validators.required],
    rptpsw: ['', Validators.required]
  });
  constructor(private formBuilder: FormBuilder,
    private _router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private dataService: DataProviderService) {

  }
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      console.warn('Message was sent', this.loginForm.value);

      var user = {} as userlogin;
      user.password = this.loginForm.get('psw').value;
      user.email = this.loginForm.get('email').value;
      this.http.post(this.baseUrl + 'api/Users/LogIn', user, { observe: 'response' }).subscribe((data: HttpResponse<User>) => {
        console.log(data);
        if (data.body != null) {
          this.dataService.saveUser(data.body);
          var u = this.dataService.getCurentUser();
          console.log("qwe :", u);
          this.loginForm.reset();
          window.location.reload();
        }
        else
          alert("Wrong username or password");
      });
    }
    else {
      alert("Validation is not passed");
    }
  }

  onSignUpSubmit(): void {
    if (!this.signupForm.valid) {
      alert("Validation is not passed");
    }
    else if (this.signupForm.get('psw').value != this.signupForm.get('rptpsw').value) {
      alert("Password and repeated password are not same!");
    }
    else
    {
      console.warn('Message was sent', this.signupForm.value);
      var user = {} as usernew;
      user.password = this.signupForm.get('psw').value;
      user.email = this.signupForm.get('email').value;
      user.login = this.signupForm.get('lgn').value;
      this.http.post(this.baseUrl + 'api/Users/CreateUser', user, { observe: 'response' }).subscribe((data: HttpResponse<User>) => {
        console.log(data);
        if (data.body != null) {

          this.dataService.saveUser(data.body);
          this.signupForm.reset();
          window.location.reload();
        }
        else
          alert("Account with this email already exists!");
      });
    }
  }

  ngOnInit() {
  }

}


export class usernew {
  constructor(
    public email?: string,
    public password?: string,
    public login?: string) { }
}

export class userlogin {
  constructor(
    public email?: string,
    public password?: string) { }
}
