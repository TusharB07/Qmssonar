import { Injectable } from '@angular/core';
import { Iinstallment } from './installment.model';
import { CrudService } from '../../service/crud.service';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstallmentService extends CrudService<Iinstallment> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/installmentsMaster`, http, accountService, { populate: ["quoteId", "quoteOptionId"] });
}
}
