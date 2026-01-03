import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IProductWiseAge } from './product-wise-age.model';

@Injectable({
  providedIn: 'root'
})
export class ProductWiseAgeService extends CrudService<IProductWiseAge> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/productWiseAgeMaster`, http, accountService,{ populate: [ 'productId'] })
  }
}
