import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { AccountService } from './account.service';

@Injectable()
export class HttpService {

    private urlToRefreshToken = 'https://localhost:44372/api/accounts/getAccessToken';
    
    constructor(private http: Http, private accountService: AccountService) { }  

    public getJson<T>(url: string): Promise<T> {
        return this.http.get(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response.json())
            .catch(error => {
                let errorJson = error.json();
                        
                if (errorJson && errorJson.errorCode === 'TokenExpired') {
                    return this._refreshAccessTokenAndRetryGetJson(url)
                        .then(innerResponse => innerResponse)
                        .catch(innerError => this.handleError(innerError));
                } else {
                    this.handleError(error);
                }
            });
    }

    public getText(url: string): Promise<string> {
        return this.http.get(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response.text())
            .catch(error => this.handleError(error));
    }

    public post<T>(url: string, data: any): Promise<T> {
        return this.http.post(url, data, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    public delete(url: string): Promise<string> {
        return this.http.delete(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response.text())
            .catch(error => this.handleError(error));
    }

    private getStandardHeaders(token: string): Headers {
        return new Headers(
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem(token)
            }
        );
    }

    private handleError(error: Response): Promise<Response> {
        console.error('An error occurred', error);

        let errorObj = error.json();

        if (errorObj.errorCode) {
            if (errorObj.errorCode === 'MissingClaim') {
                // show nice popup
                alert('You do not have sufficient permission.');
            }

            if (errorObj.errorCode === 'MissingToken' || errorObj.errorCode === 'InvalidToken' || errorObj.errorCode === 'TokenRevoked') {
                // run logout logic to wipe out tokens in localStorage
                // alert user that they need to login
                // navigate to login page
            }

        }

        console.error('error object', error.json());
        return Promise.reject(error);
    }

    private _retryGetJson<T>(url: string): Promise<T> {
        return this.http.get(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    private _refreshAccessTokenAndRetryGetJson(url: string): Promise<Response> {
        return this.http.get(this.urlToRefreshToken, { headers: this.getStandardHeaders('refreshToken') })
            .toPromise()
            .then(response => {
                let accessToken = response.json();
                this.accountService.updateAccessToken(accessToken.token);

                return this._retryGetJson(url)
                    .then(innerResponse => innerResponse)
                    .catch(innerError => this.handleError(innerError));                

            })
            .catch(error => this.handleError(error));
    }
}
