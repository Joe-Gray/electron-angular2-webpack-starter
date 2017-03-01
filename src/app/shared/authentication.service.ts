import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginTokens } from './login-tokens';
import { UserCredentials } from './user-credentials';
import { AccountService } from './account.service';

@Injectable()
export class AuthenticationService {

  private webApiUrl = 'https://localhost:44372/api/accounts';

  constructor(private httpService: HttpService, private accountService: AccountService) {
  }

  register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post(this.webApiUrl + '/register', userCredentials)
      .then(response => {
        let loginTokens = response.json();
        this.accountService.register(loginTokens);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  login(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post(this.webApiUrl + '/login', userCredentials)
      .then(response => {
        let loginTokens = response.json();
        this.accountService.login(loginTokens);
        return loginTokens;
      })
      .catch(this.handleError);
  }

  logout(): void {
    this.httpService.get(this.webApiUrl + '/logout')
      .then(response => {
        this.accountService.logout(response.text());
      })
      .catch(this.handleError);
  }

  getAccessToken(): Promise<LoginTokens> {
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
