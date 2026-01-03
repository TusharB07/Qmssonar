import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { environment } from 'src/environments/environment';
import { IPaymentDetails } from './payment-details-model';
import { CrudService } from '../../service/crud.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailsService extends CrudService<IPaymentDetails> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/paymentDetails`, http, accountService, { populate: ["quoteId"] });
  }
}
