import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {

    private tokenExpiredAnnouncedSource = new Subject<string>();

    tokenExpiredAnnounced$ = this.tokenExpiredAnnouncedSource.asObservable();

    constructor(private http: Http) { }

    public getJson<T>(url: string): Promise<T> {
        return this.http.get(url, { headers: this.getStandardHeaders() })
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error, this));
    }

    public getText(url: string): Promise<string> {
        return this.http.get(url, { headers: this.getStandardHeaders() })
            .toPromise()
            .then(response => response.text())
            .catch(error => this.handleError(error, this));
    }

    public post<T>(url: string, data: any): Promise<T> {
        return this.http.post(url, data, { headers: this.getStandardHeaders() })
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error, this));
    }

    public delete(url: string): Promise<string> {
        return this.http.delete(url, { headers: this.getStandardHeaders() })
            .toPromise()
            .then(response => response.text())
            .catch(error => this.handleError(error, this));
    }

    private getStandardHeaders(): Headers {
        return new Headers(
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        );
    }

    private handleError(error: Response, service: HttpService): Promise<Response> {
        console.error('An error occurred', error);

        let errorObj = error.json();

        if (errorObj.errorCode) {
            if (errorObj.errorCode === 'MissingClaim') {
                // show nice popup
                alert('You do not have sufficient permission.');
            }

            if (errorObj.errorCode === 'TokenExpired') {
                console.log(service);
                //service.announceTokenExpired(errorObj.errorCode);
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

    private announceTokenExpired(message: string) {
        this.tokenExpiredAnnouncedSource.next(message);
    }
}
