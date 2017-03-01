import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './shared';
import { AccountService } from './shared/account.service';
import { AuthenticationService } from './shared/authentication.service';
import '../style/app.scss';

@Component({
  selector: 'me-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  url = 'https://github.com/preboot/angular2-webpack';
  title: string;
  nodeVersion: string;
  chromeVersion: string;
  electronVersion: string;
  userIsLoggedIn = false;
  userEmail: string;
  hasAdminClaim = false;
  hasAnyMarketClaim = false;

  constructor(
    private api: ApiService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private router: Router) {

    this.accountService.loginAnnounced$.subscribe(message => {
      this.userIsLoggedIn = true;
      this.setupLoggedInUser();
    });

    this.accountService.logoutAnnounced$.subscribe(message => {
      this.userIsLoggedIn = false;
      this.userEmail = null;
      this.hasAdminClaim = false;
      this.hasAnyMarketClaim = false;
      this.router.navigate(['login']);
    });

    if (accountService.isRefreshTokenExpired()) {
      this.logout();
    }

    this.userIsLoggedIn = accountService.isUserLoggedIn;

    if (this.userIsLoggedIn) {
      this.setupLoggedInUser();
    }

    this.title = this.api.title;
    this.nodeVersion = this .api.nodeVersion;
    this.chromeVersion = this.api.chromeVersion;
    this.electronVersion = this.api.electronVersion;
  }

  setupLoggedInUser(): void {
      this.userEmail = this.accountService.accessTokenPayload.userEmail;
      this.hasAdminClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('Admin');
      this.hasAnyMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.some((ele) => {
        return this.accountService.marketClaims.includes(ele);
      });
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
