import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginTokens } from './login-tokens';
import { UserCredentials } from './user-credentials';
import { Subject }    from 'rxjs/Subject';
import { JwtPayload } from './jwt-payload';
import * as jwt_decode from 'jwt-decode';
import * as angular_jwt from 'angular2-jwt';

@Injectable()
export class AccountService {

  private webApiUrl = 'https://localhost:44372/api/accounts';
  private loginAnnouncedSource = new Subject<string>();
  private logoutAnnouncedSource = new Subject<string>();

  loginAnnounced$ = this.loginAnnouncedSource.asObservable();
  logoutAnnounced$ = this.logoutAnnouncedSource.asObservable();

  accessTokenPayload: JwtPayload;
  refreshTokenPayload: JwtPayload;

  constructor(private httpService: HttpService) { }

  register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/register', userCredentials)
      .then(loginTokens => {
        localStorage.setItem('accessToken', loginTokens.accessToken);
        localStorage.setItem('refreshToken', loginTokens.refreshToken);
        this.setJwtPayload(loginTokens.accessToken);
        this.setJwtPayload(loginTokens.refreshToken);
        this.announceLogin('loggedIn');
        return loginTokens;
      })
      .catch(this.handleError);
  }

  logout(): void {
    this.httpService.getText(this.webApiUrl + '/logout')
      .then(response => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.announceLogout(response);
      })
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

  private setJwtPayload(payload: string) {
    let jwtPayload = jwt_decode(payload);
    console.log(jwtPayload);
    let jwtHelper = new angular_jwt.JwtHelper();
    let pay = jwtHelper.decodeToken(payload);
    console.log(pay);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
