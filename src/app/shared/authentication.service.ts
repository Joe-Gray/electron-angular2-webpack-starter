import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginTokens } from './login-tokens';
import { UserCredentials } from './user-credentials';
import { AccountService } from './account.service';

@Injectable()
export class AuthenticationService {

  private webApiUrl = 'https://localhost:44372/api/accounts';

  constructor(private httpService: HttpService, private accountService: AccountService) {

    this.httpService.tokenExpiredAnnounced$.subscribe(message => {
      this.getAccessToken();
    });
  }

  register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/register', userCredentials)
      .then(loginTokens => {
        this.accountService.register(loginTokens);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  login(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/login', userCredentials)
      .then(loginTokens => {
        this.accountService.login(loginTokens);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  logout(): void {
    this.httpService.getText(this.webApiUrl + '/logout')
      .then(response => {
        this.accountService.logout(response);
      })
      .catch(this.handleError);
  }

  getAccessToken(): Promise<LoginTokens> {
    return this.httpService.getJson<LoginTokens>(this.webApiUrl + '/getAccessToken')
      .then(loginTokens => {
        this.accountService.updateAccessToken(loginTokens.accessToken);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
