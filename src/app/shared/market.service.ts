import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class MarketService {

  private webApiUrl = 'https://localhost:44372/api/markets';

  constructor(private httpService: HttpService) {
  }

  get(): Promise<any> {
    return this.httpService.getJson<any>(this.webApiUrl + '/view')
      .then(response => response)
      .catch(this.handleError);
  }

  add(market: any): void {
    this.httpService.post(this.webApiUrl + '/add', market)
      .then(response => response)
      .catch(this.handleError);
  }

  edit(market: any): void {
    this.httpService.post(this.webApiUrl + '/edit', market)
      .then(response => response)
      .catch(this.handleError);
  }

  delete(market: any): void {
    this.httpService.delete(this.webApiUrl + '/delete')
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
