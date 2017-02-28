import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/account.service';
import { UserCredentials } from '../shared/user-credentials';

@Component({
  selector: 'me-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userCredentials: UserCredentials;
  fieldWithFocus: any;

  constructor(private accountService: AccountService, private router: Router) {
    this.userCredentials = new UserCredentials();
  }

  ngOnInit() {
  }

  register(): void {
    this.accountService
      .register(this.userCredentials)
      .then(loginTokens => {
        this.router.navigate(['']);
    });
  }

  login(): void {
    this.accountService
      .login(this.userCredentials)
      .then(loginTokens => {
        this.router.navigate(['']);
    });
  }

  setFieldWithFocus(e): void {
    this.fieldWithFocus = e.target.name;
  }

}
