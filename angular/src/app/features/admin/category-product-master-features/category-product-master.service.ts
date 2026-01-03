import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { ICategoryProductMaster } from './category-product-master.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryProductMasterService extends CrudService<ICategoryProductMaster> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/CategoryProductMaster`, http, accountService);
  }

  saveQuoteRMFeatures(record): Observable<IOneResponseDto<ICategoryProductMaster>> {
    return this.http.post<IOneResponseDto<ICategoryProductMaster>>(`${this.baseUrl}/CategoryProductMaster`, record, { headers: this.accountService.bearerTokenHeader() });
  }
}
