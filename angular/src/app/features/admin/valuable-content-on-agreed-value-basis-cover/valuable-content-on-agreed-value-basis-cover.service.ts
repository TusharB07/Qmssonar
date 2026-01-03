import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IValuableContentsOnAgreedValue } from './valuable-content-on-agreed-value-basis-cover.model';

@Injectable({
  providedIn: 'root'
})
export class ValuableContentOnAgreedValueBasisCoverService extends CrudService<IValuableContentsOnAgreedValue> {

  constructor( 
    protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/valuableContentsOnAgreedValue`, http, accountService, { populate: ['quoteId'] })
  }

  uploadCertificate(id: string, file: any){
    return this.http.post(`${this.baseUrl}/${id}/valuation-certification-upload`, file, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  downloadCerificate(id :string, imagePath: string){
    return this.http.get(`${this.baseUrl}/${id}/valuation-certification-upload?imagePath=${imagePath}`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }
  
  deleteCerificate(id :string, imagePath: string){
    return this.http.delete(`${this.baseUrl}/${id}/valuation-certification-upload?imagePath=${imagePath}`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  updateCerificate(id: string, imagePath: string) {
    return this.http.patch(`${this.baseUrl}/${id}/valuation-certification-upload?imagePath=${imagePath}`, {
        headers: this.accountService.bearerTokenHeader(),
    });
}
}
