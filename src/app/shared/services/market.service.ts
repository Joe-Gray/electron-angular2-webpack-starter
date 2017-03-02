import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from './http.service';

@Injectable()
export class MarketService {

  private webApiUrl = 'https://localhost:44372/api/markets';

  constructor(private httpService: HttpService) {
  }

  public get(): Promise<Response> {
    return this.httpService.get(this.webApiUrl + '/view')
      .then(response => {
        return response;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  public add(market: any): Promise<Response> {
    return this.httpService.post(this.webApiUrl + '/add', market)
      .then(response => response)
      .catch(this.handleError);
  }

  public edit(market: any): Promise<Response> {
    return this.httpService.post(this.webApiUrl + '/edit', market)
      .then(response => response)
      .catch(this.handleError);
  }

  public delete(market: any): Promise<Response> {
    return this.httpService.delete(this.webApiUrl + '/delete')
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
