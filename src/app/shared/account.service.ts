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

  constructor() {
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

  register(loginTokens: LoginTokens): void {
    this.login(loginTokens);
    this.announceRegister('registered');
  }

  login(loginTokens: LoginTokens): void {
    this.setJwTokens(loginTokens);
    this.announceLogin('loggedIn');
  }

  logout(message: string): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.announceLogout(message);
  }

  updateAccessToken(accessToken: string) {
    localStorage.removeItem('accessToken');
    this.setAccessToken(accessToken);
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
      this.setAccessToken(loginTokens.accessToken);
      this.setRefreshToken(loginTokens.refreshToken);
      this._isUserLoggedIn = true;
  }

  private setAccessToken(accessToken: string) {
      localStorage.setItem('accessToken', accessToken);
      this._accessTokenPayload = jwt_decode(accessToken);
      this.announceAccessTokenChange('updated');
  }

  private setRefreshToken(refreshToken: string) {
      localStorage.setItem('refreshToken', refreshToken);
      this._refreshTokenPayload = jwt_decode(refreshToken);
      this.announceRefreshTokenChange('updated');
  }
}
