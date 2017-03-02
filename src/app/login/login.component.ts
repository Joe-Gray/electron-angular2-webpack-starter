import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UserCredentials } from '../shared/models/user-credentials';

@Component({
  selector: 'me-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userCredentials: UserCredentials;
  public fieldWithFocus: any;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.userCredentials = new UserCredentials();
  }

  ngOnInit() {
  }

  public register(): void {
    this.authenticationService
      .register(this.userCredentials)
      .then(loginTokens => {
        this.router.navigate(['']);
    });
  }

  public login(): void {
    this.authenticationService
      .login(this.userCredentials)
      .then(loginTokens => {
        this.router.navigate(['']);
    });
  }

  public setFieldWithFocus(e): void {
    this.fieldWithFocus = e.target.name;
  }

}
