import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { MessageService } from "primeng/api";
import { IAppErrorEnvelope } from "../app.model";
import { AppService } from "../app.service";
import { AccountService } from "../features/account/account.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        // Very important to keep this public.
        public messageService: MessageService,
        private appService: AppService,
        private accountService: AccountService,
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError(error => {
                if (error) {
                    const errorEnvelope: IAppErrorEnvelope = error.error;
                    console.log(errorEnvelope);

                    if (errorEnvelope.error) {

                        // Set this in the corresponding behavior subject so we can pick it up while rendering the details dialog.
                        this.appService.setLastError(errorEnvelope);

                        if (errorEnvelope.error.statusCode === 400) {
                            const errorsLi = errorEnvelope.error?.errors?.map(error => `<li>${error}</li>`);
                            let errorsUl;
                            if (errorsLi) {
                                errorsUl = `<ul>${errorsLi.join("")}</ul>`;
                            }

                            this.messageService.clear("error");
                            this.messageService.add({
                                key: "error",
                                // sticky: true, // Removed as the toast used to stay sticked on the top
                                severity: "error",
                                summary: errorEnvelope.message,
                                detail: errorsUl
                            });
                            if (errorEnvelope.message === "Quote is already under process. ") {
                                this.router.navigateByUrl("/backend/quotes");
                            }
                        }
                        if (errorEnvelope.error.statusCode === 401 || errorEnvelope.error.statusCode === 403) {

                            // To Logout The user on seeder re-run
                            if (errorEnvelope.message === 'The user belonging to the token no longer exists') {
                                this.accountService.logout().subscribe();
                            }
                            if (errorEnvelope.message === "Your token has expired. Please login again.") {
                                // this.accountService.logout().subscribe();
                                this.accountService.removeAuthResponse();
                                this.router.navigateByUrl("/account/login");
                            }
                            if (errorEnvelope.message === "Someone else logged in.") {
                                // this.accountService.logout().subscribe();

                                this.accountService.removeAuthResponse();
                                this.router.navigateByUrl("/account/login");
                            }
                            

                            if (request.url.includes("users/login")) {
                                this.messageService.clear("error");
                                this.messageService.add({
                                    key: "error",
                                    sticky: true,
                                    severity: "error",
                                    summary: errorEnvelope.message
                                });
                            }
                            else if (errorEnvelope.message === "Your token has expired. Please login again.") {
                                this.messageService.add({
                                    key: "error",
                                    sticky: true,
                                    severity: "error",
                                    summary: errorEnvelope.message
                                });
                            }
                            else if (errorEnvelope.message === "Someone else logged in.") {
                                this.messageService.add({
                                    key: "error",
                                    sticky: true,
                                    severity: "error",
                                    summary: errorEnvelope.message
                                });
                          
                                
                            }else if (errorEnvelope.message === "Range Not Found") {
                                this.messageService.add({
                                    key: "error",
                                    // sticky: true,
                                    severity: "error",
                                    summary: errorEnvelope.message
                                });
                          
                                
                            }else {
                                this.messageService.add({
                                    key: "error",
                                    sticky: true,
                                    severity: "error",
                                    summary: 'Access Denied'
                                });
                                // this.router.navigateByUrl("/access-denied");
                            }
                        }
                        if (error.status === 404) {
                            this.messageService.add({
                                key: "error",
                                sticky: true,
                                severity: "warn",
                                //   summary: 'Access Denied',
                                summary: errorEnvelope.message,
                            });
                            // this.router.navigateByUrl("/not-found");
                        }

                        if (error.status === 500) {
                            this.messageService.add({
                                key: "error",
                                severity: "error",
                                summary: 'Server Error',
                                detail: "It's not you it's us. We are working on this ,we will make it Alwrite"                                
                            });
                            //   this.router.navigateByUrl("/server-error");
                        }
                        if (errorEnvelope.error.statusCode === 501 || error.status === 501) {
                            this.messageService.add({
                                key: "error",
                                sticky: true,
                                severity: "error",
                                summary: 'Invalid Configuration',
                                detail: errorEnvelope.message,
                            });
                            //   this.router.navigateByUrl("/server-error");
                        }
                    } else {

                        // if(errorEnvelope.status == 'fail') {
                        //     this.appService.setLastError(error);

                        //     this.messageService.clear("error");
                        //     this.messageService.add({
                        //         key: "error",
                        //         sticky: true,
                        //         severity: "error",
                        //         //   summary: errorEnvelope.message
                        //         summary: 'Failed',
                        //         detail: errorEnvelope.data.entity.errorMessage ?? 'Error',
                        //     });

                        // } else {

                        this.appService.setLastError(error);
                        // Re-direct to the server-error page.

                        // this.router.navigateByUrl(`/server-error?redirect=${window.location.href}`);
                        this.router.navigateByUrl(`/server-error`);
                        // }
                    }
                }

                return throwError(error.error.message);
            })
        );
    }
}
