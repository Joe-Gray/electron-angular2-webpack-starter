import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './shared/services/api.service';
import { AccountService } from './shared/services/account.service';
import { AuthenticationService } from './shared/services/authentication.service';
import '../style/app.scss';

@Component({
  selector: 'me-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title: string;
  public nodeVersion: string;
  public chromeVersion: string;
  public electronVersion: string;
  public userIsLoggedIn = false;
  public userEmail: string;
  public hasAdminClaim = false;
  public hasAnyMarketClaim = false;

  constructor(
    private api: ApiService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private router: Router) {

    this.title = this.api.title;
    this.subscribeToAnnouncements();
    this.initializeCurrentAccount();
    this.setFooterInfo();
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  private subscribeToAnnouncements(): void {
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
  }

  private initializeCurrentAccount(): void {
    if (this.accountService.isRefreshTokenExpired()) {
      this.logout();
    }

    this.userIsLoggedIn = this.accountService.isUserLoggedIn;

    if (this.userIsLoggedIn) {
      this.setupLoggedInUser();
    }
  }

  private setupLoggedInUser(): void {
      this.userEmail = this.accountService.accessTokenPayload.userEmail;
      this.hasAdminClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('Admin');
      this.hasAnyMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.some((ele) => {
        return this.accountService.marketClaims.includes(ele);
      });
  }

  private setFooterInfo(): void {
    this.nodeVersion = this .api.nodeVersion;
    this.chromeVersion = this.api.chromeVersion;
    this.electronVersion = this.api.electronVersion;
  }
}
