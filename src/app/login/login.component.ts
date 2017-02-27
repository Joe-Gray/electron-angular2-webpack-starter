import { Component, OnInit } from '@angular/core';
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

  constructor(private accountService: AccountService) {
    this.userCredentials = new UserCredentials();
  }

  ngOnInit() {
  }

  submit(): void {
    this.accountService
      .register(this.userCredentials)
      .then(loginTokens => {
        localStorage.setItem('accessToken', loginTokens.accessToken);
        localStorage.setItem('refreshToken', loginTokens.refreshToken);
        this.accountService.announceLogin('loggedIn');
    });
  }

  setFieldWithFocus(e): void {
    this.fieldWithFocus = e.target.id;
  }

}
