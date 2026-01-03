import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/features/account/account.service';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LandscapingCoverService extends CrudService<any> {

 
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bscLandscapingCover`, http, accountService,{ populate: ["quoteId"] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
  }

}
