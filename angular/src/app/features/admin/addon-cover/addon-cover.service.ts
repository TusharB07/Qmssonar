import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IAddOnCover } from "./addon-cover.model";
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AddonCoverService extends CrudService<IAddOnCover> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/addon-covers`, http, accountService, { populate: ["productId partnerId sectorId occupancyId"] });
  }

  // Bulk Import ------------------------------------------------------------------------------------------
  bulkImportGenerateSample(payload: any) {
    return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  sendAddonsToMasterForApproval(payload: any) {
    return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/create-liability-cover`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  getBulkImportProps(onUpload: (dto: IOneResponseDto<IBulkImportResponseDto>) => void): PFileUploadGetterProps {
    return {
      name: 'bulk_import',
      url: `${this.baseUrl}/bulk-import`,
      mode: "basic",
      headers: this.accountService.bearerTokenHeader(),
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
      maxFileSize: 1000000,
      method: 'post',
      onUpload: onUpload,
      auto: true,
      // uploadLabel: "Bulk Import ",
      chooseLabel: "Bulk Import Excel Upload",
    }
  }
  // Bulk Import -----------------------------------------------------------------------------------------

  //D&O
  getAddOnCoversByProductId(id): Observable<IManyResponseDto<IAddOnCover>> {
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/${id}/getAddOnCoversByProductId`, { headers: this.accountService.bearerTokenHeader() });
  }

  //get addoncovers by product and sector id
  getAddonCovers(id: string): Observable<IManyResponseDto<IAddOnCover>> {
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/${id}/getAddOnCovers`, { headers: this.accountService.bearerTokenHeader() });
  }

  getAddOnCoversCoversFromAI(id): Observable<IManyResponseDto<IAddOnCover>> {
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/from-ai/${id}`, { headers: this.accountService.bearerTokenHeader() });
  }
}
