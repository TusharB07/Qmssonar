import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IQuoteWCRatesFileUploadData } from '../../admin/quote/quote.model';
import { CrudService } from '../../service/crud.service';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  export class WCRatesFileUploadService extends CrudService<IQuoteWCRatesFileUploadData>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/wcRatesfileUploads`, http, accountService, { populate: ['quoteId'] });
  }

  viewWCRatesSummary(body): Observable<IManyResponseDto<any>> {
    return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/view-wcrates-summary`, body, { headers: this.accountService.bearerTokenHeader() });
}

getBulkImportProps(quoteId: string, onUpload): PFileUploadGetterProps {
  return {
      name: 'excel_upload',
      url: `${this.baseUrl}/${quoteId}/excel-upload-v2`,
      mode: "basic",
      headers: this.accountService.bearerTokenHeader(),
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
      maxFileSize: 100000,
      method: 'post',
      onUpload: onUpload,
      auto: true,
      uploadLabel: "Click to Upload ",
      chooseLabel: "Upload Excel Sheet",
  }
}
downloadWcRatesFileUploadDataExcel(id: string) {
  // return this.http.get(`${this.baseUrl}/exceldownload/${id}`, {
  //     headers: this.accountService.bearerTokenHeader(),
  //     observe: 'response',
  //     responseType: 'arraybuffer'
  // });
    return this.http.get(`${this.baseUrl}/exceldownload/${id}`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
  });
}

}