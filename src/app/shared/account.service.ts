import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginTokens } from './login-tokens';
import { UserCredentials } from './user-credentials';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class AccountService {

  private webApiUrl = 'https://localhost:44372/api/accounts';
  private loginAnnouncedSource = new Subject<string>();
  private logoutAnnouncedSource = new Subject<string>();

  loginAnnounced$ = this.loginAnnouncedSource.asObservable();
  logoutAnnounced$ = this.logoutAnnouncedSource.asObservable();

  constructor(private httpService: HttpService) { }

  register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/register', userCredentials)
      .then(response => response)
      .catch(this.handleError);
  }

  isUserLoggedIn(): boolean {
    let refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      return true;
    } else {
      return false;
    }
  }

  announceLogin(message: string) {
    this.loginAnnouncedSource.next(message);
  }

  announceLogout(message: string) {
    this.logoutAnnouncedSource.next(message);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
