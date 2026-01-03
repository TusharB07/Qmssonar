import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IEmpRates } from './emprates.model';

@Injectable({
  providedIn: 'root'
})
export class EmpRatesService extends CrudService<IEmpRates> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/empRatesTemplate`, http, accountService, { populate: ['productId'] })
  }

  //Upload Employees Rates Excel Url

  getBulkImportProps(productId: string, onUpload): PFileUploadGetterProps {
    return {
      name: 'excel_upload',
      url: `${this.baseUrl}/${productId}/excel-upload-empRates`,
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

  downloadEmpRatesDataExcel(id: string) {
    return this.http.get(`${this.baseUrl}/empRatesExcelDownload/${id}`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }

  getAllRateTemplate(totalEMpCount: number) {
    return this.http.get<IManyResponseDto<IEmpRates>>(`${this.baseUrl}/getEmpRaterFromCount/` + totalEMpCount, {
      headers: this.accountService.bearerTokenHeader()
    });
  }
}
