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
  private _accessTokenPayload: JwtPayload;
  private _refreshTokenPayload: JwtPayload;
  private _marketClaims = ['Admin', 'AddMarket', 'DeleteMarket', 'EditMarket', 'ViewMarket'];
  private _isUserLoggedIn = false;

  private registerAnnouncedSource = new Subject<string>();
  private loginAnnouncedSource = new Subject<string>();
  private logoutAnnouncedSource = new Subject<string>();
  private refreshTokenChangeAnnouncedSource = new Subject<string>();
  private accessTokenChangeAnnouncedSource = new Subject<string>();

  registerAnnounced$ = this.registerAnnouncedSource.asObservable();
  loginAnnounced$ = this.loginAnnouncedSource.asObservable();
  logoutAnnounced$ = this.logoutAnnouncedSource.asObservable();
  refreshTokenChangeAnnounced$ = this.refreshTokenChangeAnnouncedSource.asObservable();
  accessTokenChangeAnnounced$ = this.accessTokenChangeAnnouncedSource.asObservable();

  constructor(private httpService: HttpService) {
    let loginTokens = new LoginTokens();
    loginTokens.refreshToken = localStorage.getItem('refreshToken');
    loginTokens.accessToken = localStorage.getItem('accessToken');

    if (loginTokens.refreshToken && loginTokens.accessToken) {
      this.setJwTokens(loginTokens);
    }
  }

  get marketClaims(): string[] {
    return this._marketClaims;
  }

  get accessTokenPayload(): JwtPayload {
    return this._accessTokenPayload;
  }

  get refreshTokenPayload(): JwtPayload {
    return this._refreshTokenPayload;
  }

  get isUserLoggedIn(): boolean {
    return this._isUserLoggedIn;
  }

  register(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/register', userCredentials)
      .then(loginTokens => {
        this.setJwTokens(loginTokens);
        this.announceRegister('registered');
        this.announceLogin('loggedIn');
        return loginTokens;
      })
      .catch(this.handleError);
  }

  login(userCredentials: UserCredentials): Promise<LoginTokens> {
    return this.httpService.post<LoginTokens>(this.webApiUrl + '/login', userCredentials)
      .then(loginTokens => {
        this.setJwTokens(loginTokens);
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

  private announceRegister(message: string) {
    this.registerAnnouncedSource.next(message);
  }

  private announceLogin(message: string) {
    this.loginAnnouncedSource.next(message);
  }

  private announceLogout(message: string) {
    this.logoutAnnouncedSource.next(message);
  }

  private announceRefreshTokenChange(message: string) {
    this.refreshTokenChangeAnnouncedSource.next(message);
  }

  private announceAccessTokenChange(message: string) {
    this.accessTokenChangeAnnouncedSource.next(message);
  }

  private setJwTokens(loginTokens: LoginTokens) {
      localStorage.setItem('accessToken', loginTokens.accessToken);
      this._accessTokenPayload = jwt_decode(loginTokens.accessToken);
      this.announceAccessTokenChange('updated');
      localStorage.setItem('refreshToken', loginTokens.refreshToken);
      this._refreshTokenPayload = jwt_decode(loginTokens.refreshToken);
      this.announceRefreshTokenChange('updated');
      this._isUserLoggedIn = true;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
