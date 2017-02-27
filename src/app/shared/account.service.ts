import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginTokens } from './login-tokens';
import { UserCredentials } from './user-credentials';

@Injectable()
export class AccountService {

  private webApiUrl = 'https://localhost:44372/api/accounts';

  constructor(private httpService: HttpService) { }

  register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/register', userCredentials)
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
