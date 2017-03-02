import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from './account.service';
import { DialogComponent } from '../components/dialog.component';

@Injectable()
export class HttpService {
    private urlToRefreshToken = 'https://localhost:44372/api/accounts/getAccessToken';
    private refreshTokenExpiredAnnouncedSource = new Subject<string>();
    public refreshTokenExpiredAnnounced$ = this.refreshTokenExpiredAnnouncedSource.asObservable();

    constructor(
        private http: Http,
        private accountService: AccountService,
        private modalService: NgbModal) { }

    public get(url: string): Promise<Response> {
        let stack = new Error().stack;
        return this.http.get(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => {
                return response;
            })
            .catch(error => {
                let errorJson = error.json();

                if (errorJson && errorJson.errorCode === 'TokenExpired') {
                    return this.refreshAccessTokenAndRetryGet(url, stack)
                        .then(innerResponse => {
                            return innerResponse;
                        })
                        .catch(innerError => {
                            return this.handleError(innerError, stack);
                        });
                } else {
                    return this.handleError(error, stack);
                }
            });
    }

    public post(url: string, data: any): Promise<Response> {
        let stack = new Error().stack;
        return this.http.post(url, data, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response)
            .catch(error => {
                let errorJson = error.json();

                if (errorJson && errorJson.errorCode === 'TokenExpired') {
                    return this.refreshAccessTokenAndRetryPost(url, data, stack)
                        .then(innerResponse => innerResponse)
                        .catch(innerError => this.handleError(innerError, stack));
                } else {
                    return this.handleError(error, stack);
                }
            });
    }

    public delete(url: string): Promise<Response> {
        let stack = new Error().stack;
        return this.http.delete(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response)
            .catch(error => {
                let errorJson = error.json();

                if (errorJson && errorJson.errorCode === 'TokenExpired') {
                    return this.refreshAccessTokenAndRetryDelete(url, stack)
                        .then(innerResponse => innerResponse)
                        .catch(innerError => this.handleError(innerError, stack));
                } else {
                    return this.handleError(error, stack);
                }
            });
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

    private handleError(error: Response, stack: string): Promise<Response> {
        console.error('An error occurred', error, stack);

        let errorObj = error.json();

        if (errorObj.errorCode) {
            if (errorObj.errorCode === 'MissingClaim') {
                const modalRef = this.modalService.open(DialogComponent);
                modalRef.componentInstance.title = 'Not Authorized';
                modalRef.componentInstance.message = 'You do not have sufficient permission.';
            }

            if (errorObj.errorCode === 'MissingToken' || errorObj.errorCode === 'InvalidToken' || errorObj.errorCode === 'TokenRevoked') {
                // run logout logic to wipe out tokens in localStorage
                // alert user that they need to login
                // navigate to login page
            }

        }

        return Promise.reject(error);
    }

    private refreshAccessTokenAndRetryGet(url: string, stack: string): Promise<Response> {
        return this.http.get(this.urlToRefreshToken, { headers: this.getStandardHeaders('refreshToken') })
            .toPromise()
            .then(response => {
                let accessToken = response.json();
                this.accountService.updateAccessToken(accessToken.token);

                return this.retryGet(url, stack)
                    .then(innerResponse => {
                        return innerResponse;
                    })
                    .catch(innerError => {
                        return this.handleError(innerError, stack);
                    });

            })
            .catch(error => {
                let errorJson = error.json();

                if (errorJson && errorJson.errorCode === 'TokenExpired') {
                    this.announceRefreshTokenExpired('expired');
                }

                return this.handleError(error, stack);

            });
    }

    private retryGet(url: string, stack: string): Promise<Response> {
        return this.http.get(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => {
                return response;
            })
            .catch(error => {
                return this.handleError(error, stack);
            });
    }

    private refreshAccessTokenAndRetryPost(url: string, data: any, stack: string): Promise<Response> {
        return this.http.get(this.urlToRefreshToken, { headers: this.getStandardHeaders('refreshToken') })
            .toPromise()
            .then(response => {
                let accessToken = response.json();
                this.accountService.updateAccessToken(accessToken.token);

                return this.retryPost(url, data, stack)
                    .then(innerResponse => innerResponse)
                    .catch(innerError => this.handleError(innerError, stack));

            })
            .catch(error => this.handleError(error, stack));
    }

    private retryPost(url: string, data: any, stack: string): Promise<Response> {
        return this.http.post(url, data, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error, stack));
    }

    private refreshAccessTokenAndRetryDelete(url: string, stack: string): Promise<Response> {
        return this.http.get(this.urlToRefreshToken, { headers: this.getStandardHeaders('refreshToken') })
            .toPromise()
            .then(response => {
                let accessToken = response.json();
                this.accountService.updateAccessToken(accessToken.token);

                return this.retryDelete(url, stack)
                    .then(innerResponse => innerResponse)
                    .catch(innerError => this.handleError(innerError, stack));

            })
            .catch(error => this.handleError(error, stack));
    }

    private retryDelete(url: string, stack: string): Promise<Response> {
        return this.http.delete(url, { headers: this.getStandardHeaders('accessToken') })
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error, stack));
    }

    private announceRefreshTokenExpired(message: string) {
        this.refreshTokenExpiredAnnouncedSource.next(message);
    }
}
