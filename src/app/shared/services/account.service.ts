import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject }    from 'rxjs/Subject';
import * as jwt_decode from 'jwt-decode';
import * as angular_jwt from 'angular2-jwt';
import { HttpService } from './http.service';
import { LoginTokens } from '../models/login-tokens';
import { UserCredentials } from '../models/user-credentials';
import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class AccountService {

  private accessToken: string;
  private refreshToken: string;
  private _accessTokenPayload: JwtPayload;
  private _refreshTokenPayload: JwtPayload;
  private _marketClaims = ['Admin', 'AddMarket', 'DeleteMarket', 'EditMarket', 'ViewMarket'];
  private _isUserLoggedIn = false;

  private registerAnnouncedSource = new Subject<string>();
  private loginAnnouncedSource = new Subject<string>();
  private logoutAnnouncedSource = new Subject<string>();
  private refreshTokenChangeAnnouncedSource = new Subject<string>();
  private accessTokenChangeAnnouncedSource = new Subject<string>();

  public registerAnnounced$ = this.registerAnnouncedSource.asObservable();
  public loginAnnounced$ = this.loginAnnouncedSource.asObservable();
  public logoutAnnounced$ = this.logoutAnnouncedSource.asObservable();
  public refreshTokenChangeAnnounced$ = this.refreshTokenChangeAnnouncedSource.asObservable();
  public accessTokenChangeAnnounced$ = this.accessTokenChangeAnnouncedSource.asObservable();

  constructor(private router: Router) {
    this.setJwTokensFromLocalStorage();
  }

  public get marketClaims(): string[] {
    return this._marketClaims;
  }

  public get accessTokenPayload(): JwtPayload {
    return this._accessTokenPayload;
  }

  public get refreshTokenPayload(): JwtPayload {
    return this._refreshTokenPayload;
  }

  public get isUserLoggedIn(): boolean {
    return this._isUserLoggedIn;
  }

  public register(loginTokens: LoginTokens): void {
    this.login(loginTokens);
    this.announceRegister('registered');
  }

  public login(loginTokens: LoginTokens): void {
    this.setJwTokens(loginTokens);
    this.announceLogin('loggedIn');
  }

  public logout(message: string): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.announceLogout(message);
  }

  public updateAccessToken(accessToken: string) {
    localStorage.removeItem('accessToken');
    this.setAccessToken(accessToken);
  }

  public isRefreshTokenExpired() {
    if (!this.refreshToken) {
      return false;
    }

    let isTokenExpired = this.isTokenExpired(this.refreshToken);
    return isTokenExpired;
  }

  private isTokenExpired(token: string) {
    let jwtHelper = new angular_jwt.JwtHelper();
    let isTokenExpired = jwtHelper.isTokenExpired(token);
    return isTokenExpired;
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

  private setJwTokensFromLocalStorage() {
    this.refreshToken = localStorage.getItem('refreshToken');
    this.accessToken = localStorage.getItem('accessToken');

    if (this.accessToken && this.refreshToken) {
      this._refreshTokenPayload = jwt_decode(this.refreshToken);
      this.announceRefreshTokenChange('updated');
      this._accessTokenPayload = jwt_decode(this.accessToken);
      this.announceAccessTokenChange('updated');
      this._isUserLoggedIn = true;
    }
  }

  private setJwTokens(loginTokens: LoginTokens) {
    if (loginTokens.accessToken && loginTokens.refreshToken) {
      this.setAccessToken(loginTokens.accessToken);
      this.setRefreshToken(loginTokens.refreshToken);
      this._isUserLoggedIn = true;
    }
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
