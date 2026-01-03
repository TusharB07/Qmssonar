import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountService } from "src/app/features/account/account.service";

@Injectable({
  providedIn: "root"
})
export class AuditTrailService {
  constructor(protected baseUrl: string, protected http: HttpClient, protected accountService: AccountService) {}
}
