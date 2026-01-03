import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, ReplaySubject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IAuthResponse } from "./account.model";
import { IUser } from "../admin/user/user.model";
import { MessageService } from "primeng/api";
import { ThemeService } from "./my-organization/theme.service";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new ReplaySubject<IUser>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,
    private router: Router,
    public messageService: MessageService,private themeService:ThemeService) { }

  saveAuthResponse(authResponse: IAuthResponse) {
    localStorage.setItem("authResponse", btoa(JSON.stringify(authResponse)));
  }

  removeAuthResponse() {
    localStorage.removeItem("authResponse");
    this.themeService.setTheme(false);
  }

  removeDaterangeSelected(){
    localStorage.removeItem("DaterangeSelected");

  }

  bearerTokenHeader(token: string = null, headers: HttpHeaders = null): HttpHeaders {
    if (!token) {
      token = this.token().token;
    }
    if (!headers) {
      headers = new HttpHeaders();
    }

    headers = headers.set("Authorization", `Bearer ${token}`);
    return headers;
  }

  // token() {
  //     const authResponseLs = localStorage.getItem("authResponse");
  //     if (!authResponseLs) {
  //         this.router.navigateByUrl("/account/login");
  //         return null;
  //     }

  //     // TODO: If the token is tampered then also we need to return and logout.
  //     const authResponse: IAuthResponse = JSON.parse(atob(authResponseLs));

  //     const token = authResponse.token;
  //     const expires = authResponse.expires;
  //     const nowPlus15Min = new Date(Date.now() + 15 * 60 * 1000).getTime();
  //     if (nowPlus15Min > expires) {
  //         let headers = this.bearerTokenHeader(token);

  //         return this.http
  //             .get<IAuthResponse>(this.baseUrl + "/users/me", {
  //                 headers,
  //             })
  //             .pipe(
  //                 map((user: IAuthResponse) => {
  //                     if (user) {
  //                         this.saveAuthResponse(user);
  //                         this.currentUserSource.next(user.data.entity);

  //                         return user;
  //                     }

  //                     return null;
  //                 })
  //             );
  //     } else {
  //         return of(authResponse);
  //     }
  // }

  // token(): IAuthResponse {
  //   const authResponseLs = localStorage.getItem("authResponse");

  //   if (!authResponseLs) {
  //     // TODO; Danish
  //     //   this.router.navigateByUrl("/account/login");
  //     return null;
  //   }

  //   const authResponse = JSON.parse(atob(authResponseLs));
  //   // console.log(authResponse.expires - new Date().getTime());
    

  //   if (authResponse.expires - new Date().getTime() <= 120000 && authResponse.expires - new Date().getTime() > 0) {
  //     this.refreshToken(authResponse.entity).subscribe({
  //       next: v => {},
  //       error: e => {
  //         console.log(e);
  //       }
  //     });
  //   }
  //   if (authResponse.expires - new Date().getTime() < 0) {
  //     this.removeAuthResponse();
  //     this.router.navigateByUrl("/account/login");
  //   }

  //   // TODO: If the token is tampered then also we need to return and logout.
  //   return JSON.parse(atob(authResponseLs));
  // }


  token(): IAuthResponse {
    const authResponseLs = localStorage.getItem("authResponse");
  
    if (!authResponseLs) {
      this.removeAuthResponse();
      // this.router.navigateByUrl("/account/login");
      return null;
    }
  
    const authResponse = JSON.parse(atob(authResponseLs));
    const expiresAt = new Date(authResponse.expires).getTime();
    const now = new Date().getTime();
    const timeUntilExpiration = expiresAt - now;
  
    // Check if token is expired or about to expire
    if (timeUntilExpiration <= 0) {
      this.removeAuthResponse();
      this.router.navigateByUrl("/account/login");
      return null;
    } else if (timeUntilExpiration <= 120000) { // Refresh token if within 2 minutes of expiry
      this.refreshToken(authResponse.entity).subscribe({
        next: (newAuthResponse: IAuthResponse) => {
          this.saveAuthResponse(newAuthResponse);
          this.currentUserSource.next(newAuthResponse.data.entity);
        },
        error: (error) => {
          console.error("Error refreshing token:", error);
          this.removeAuthResponse();
          this.router.navigateByUrl("/account/login");
        }
      });
    }
  
    return authResponse;
  }

  loadCurrentUser() {
    const authResponse = this.token();

    if (authResponse === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = this.bearerTokenHeader();

    return this.http.get(this.baseUrl + "/users/me", { headers }).pipe(
      map((user: IAuthResponse) => {
        if (user) {
          this.saveAuthResponse(user);
          this.currentUserSource.next(user.data.entity);
        }
      })
    );
  }

  logout() {
    let headers = this.bearerTokenHeader();
    // localStorage.removeItem("token");
    return this.http.post(this.baseUrl + "/users/logout", "",{headers}).pipe(
      map((userResponse: IAuthResponse) => {
        if (userResponse && userResponse.status === "success") {
          this.removeAuthResponse();
          this.currentUserSource.next(null);
          this.router.navigateByUrl("/account/login");
        }
      })
    );
   
  }

  register(values: any) {
    return this.http.post(this.baseUrl + "/users/signup", values).pipe(
      map((userResponse: IAuthResponse) => {
        if (userResponse && userResponse.status === "success") {
          this.saveAuthResponse(userResponse);
        }
      })
    );
  }

  
  login(values: any) {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/auth/login`, values).pipe(
      map((userResponse: IAuthResponse) => {
        if (userResponse && userResponse.status === "success") {
          this.saveAuthResponse(userResponse);
          if (values?.userType === "intermediary" && !values?.['IS_FETCH_TOKEN_ENABLED']) {
            this.removeAuthResponse();
          }
          this.removeDaterangeSelected();
          this.currentUserSource.next(userResponse.data.entity);
        } else if (userResponse && userResponse.status === "fail") {
          this.messageService.add({
            key: "error",
            severity: "error",
            summary: `Error: ${userResponse.data.entity['message']}`,
            detail: `Attempts remaining: ${userResponse.data.entity['remainingAttemptCount']}`
          });
          throw new Error(`Login failed: ${userResponse.data.entity['message']}`);
        }
        return userResponse;
      }),
      catchError(error => {
        console.error('Login error:', error);
        let errorMessage = 'An unexpected error occurred. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error;
        }
        return throwError(error); // re-throw the error to propagate it downstream
      })
    );
  }
  
  

  // login(values: any) {
  //   return this.http.post(this.baseUrl + "/users/login", values).pipe(
  //     map((userResponse: IAuthResponse) => {
  //       if (userResponse && userResponse.status === "success") {
  //         this.saveAuthResponse(userResponse);
  //         this.removeDaterangeSelected();
  //         this.currentUserSource.next(userResponse.data.entity);
  //       }
  //       if (userResponse['status'] == 'fail') {
  //         this.messageService.add({
  //           key: "error",
  //           severity: "error",
  //           summary: `Error: ${userResponse.data.entity['message']}`,
  //           detail: `Attempts remaining: ${userResponse.data.entity['remainingAttemptCount']}`
  //         });
  //       }
  //     })
  //   );
  // }

  // refreshToken(values: any) {
  //   return this.http
  //     .post(this.baseUrl + "/users/refreshToken", values, { headers: this.bearerTokenHeader(JSON.parse(atob(localStorage.getItem("authResponse"))).token) })
  //     .pipe(
  //       map((userResponse: IAuthResponse) => {
  //         if (userResponse && userResponse.status === "success") {
  //           console.log(new Date(userResponse.expires));

  //           this.saveAuthResponse(userResponse);
  //           this.currentUserSource.next(userResponse.data.entity);
  //         }
  //       })
  //     );
  // }

  refreshToken(values: any): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/users/refreshToken`, values, {
      headers: this.bearerTokenHeader()
    }).pipe(
      tap((userResponse: IAuthResponse) => {
        if (userResponse && userResponse.status === "success") {
          this.saveAuthResponse(userResponse);
          this.currentUserSource.next(userResponse.data.entity);
        }
      }),
      catchError(error => {
        console.error('Error refreshing token:', error);
        // Handle error as needed, possibly logout the user or show an error message
        return throwError(error);
      })
    );
  }

  update(values: any) {
    let headers = this.bearerTokenHeader();

    return this.http
      .patch(this.baseUrl + "/users/update-me", values, {
        headers
      })
      .pipe(
        map((userResponse: IAuthResponse) => {
          if (userResponse && userResponse.status === "success") {
            this.saveAuthResponse(userResponse);
            this.currentUserSource.next(userResponse.data.entity);
            // this.loadCurrentUser();
            console.log(userResponse);
            
          }
        })
      );
  }

  resetPassword(values: any) {
    console.log(values);
    let headers = this.bearerTokenHeader();
    return this.http
      .patch(`${this.baseUrl}/users/update-my-password`, values, {
        headers
      })
      .pipe(
        map((userResponse: IAuthResponse) => {
          if (userResponse && userResponse.status === "success") {
            this.saveAuthResponse(userResponse);
            this.currentUserSource.next(userResponse.data.entity);
          }
        })
      );
  }
  sendOtp(value: any) {
    return this.http.post(`${this.baseUrl}/users/sendOtp`, value);
  }
  verifyOtp(value: any) {
    return this.http.post(`${this.baseUrl}/users/verifyOtp`, value);
  }
  changePassword(value: any) {
    return this.http.post(`${this.baseUrl}/users/updateUserPassword`, value);
  }
}
