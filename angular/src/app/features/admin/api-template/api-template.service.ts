import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../service/crud.service';
import { IApiTemplate } from './api-template.model';

@Injectable({
  providedIn: 'root'
})
export class ApiTemplateService extends CrudService<IApiTemplate> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/apiTemplates`, http, accountService, { populate: ['productId partnerId'] });
  }
}
