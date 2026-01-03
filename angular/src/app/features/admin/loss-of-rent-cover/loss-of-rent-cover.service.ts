import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { ILossOfRent } from './loss-of-rent-cover.model';

@Injectable({
  providedIn: 'root'
})
export class LossOfRentCoverService extends CrudService<ILossOfRent> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/lossOfRent`, http, accountService, { populate: ['quoteId'] })


  }
}
