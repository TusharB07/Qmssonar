import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AccountService } from "../account/account.service";

@Injectable({
  providedIn: "root"
})
export class TestErrorService {
  baseUrl = `${environment.apiUrl}/buggy`;

  constructor(private http: HttpClient, private accountService: AccountService) {}

  get401Error() {
    this.http.get(this.baseUrl + "/notfound").subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  get404Error() {
    this.http
      .get(this.baseUrl + "/notfound", {
        headers: this.accountService.bearerTokenHeader()
      })
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }

  get500Error() {
    this.http
      .get(this.baseUrl + "/servererror", {
        headers: this.accountService.bearerTokenHeader()
      })
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }

  get400Error() {
    this.http
      .get(this.baseUrl + "/badrequest", {
        headers: this.accountService.bearerTokenHeader()
      })
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }
}
