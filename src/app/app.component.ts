import { Component } from '@angular/core';

import { ApiService } from './shared';
import { AccountService } from './shared/account.service';

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
  userIsLoggedIn: boolean;

  constructor(private api: ApiService, private accountService: AccountService) {
    this.accountService.loginAnnounced$.subscribe(message => {
      console.log(message);
      this.userIsLoggedIn = true;
    });

    this.accountService.logoutAnnounced$.subscribe(message => {
      console.log(message);
      this.userIsLoggedIn = false;
    });

    this.userIsLoggedIn = accountService.isUserLoggedIn();
    this.title = this.api.title;
    this.nodeVersion = this .api.nodeVersion;
    this.chromeVersion = this.api.chromeVersion;
    this.electronVersion = this.api.electronVersion;
  }

  logout(): void {
    console.log('clicked logout link');
  }

}
