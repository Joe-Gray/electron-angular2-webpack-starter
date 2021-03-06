import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginTokens } from '../models/login-tokens';
import { UserCredentials } from '../models/user-credentials';
import { AccountService } from './account.service';

@Injectable()
export class AuthenticationService {

  private webApiUrl = 'https://localhost:44372/api/accounts';

  constructor(private httpService: HttpService, private accountService: AccountService) {
    this.httpService.refreshTokenExpiredAnnounced$.subscribe(message => {
      this.logout();
    });

  }

  public register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post(this.webApiUrl + '/register', userCredentials)
      .then(response => {
        let loginTokens = response.json();
        this.accountService.register(loginTokens);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  public login(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post(this.webApiUrl + '/login', userCredentials)
      .then(response => {
        let loginTokens = response.json();
        this.accountService.login(loginTokens);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  public logout(): void {
    this.httpService.get(this.webApiUrl + '/logout')
      .then(response => {
        this.accountService.logout(response.text());
        return response;
      })
      .catch(error => {
        this.accountService.logout('');
        return this.handleError(error);
      });
  }

  public getAccessToken(): Promise<LoginTokens> {
    return this.httpService.get(this.webApiUrl + '/getAccessToken')
      .then(response => {
        let loginTokens = response.json();
        this.accountService.updateAccessToken(loginTokens.accessToken);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
