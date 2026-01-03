import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IRentForAlternativeAccomodation } from './rent-for-alternative-accomodation-cover.model';

@Injectable({
  providedIn: 'root'
})
export class RentForAlternativeAccomodationCoverService extends CrudService<IRentForAlternativeAccomodation> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/rentForAlternativeAccomodation`, http, accountService, { populate: ['quoteId'] })


  }
}
