import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { AccountService } from 'src/app/features/account/account.service';
import { environment } from 'src/environments/environment';
import { IBscPortableEquipments } from './bsc-portable-equipment.model';
import { Observable } from 'rxjs';
import { IManyResponseDto } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class BscPortableEquipmentsService extends CrudService<any>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-portable-equipments-cover`, http, accountService, { populate: ["quoteId equipmentTypeId"] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
  };

  batchCreate(body): Observable<IManyResponseDto<any>> {
    return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/batch-create`, body, { headers: this.accountService.bearerTokenHeader() });
}


}
