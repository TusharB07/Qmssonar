import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IOccupancyRate } from "./occupancy-rate.model";

@Injectable({
    providedIn: "root"
})
export class OccupancyRateService extends CrudService<IOccupancyRate> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/occupancy`, http, accountService, { populate: ["hazardCategoryId productId", "partnerId"] });
    }

    getMatching(payload): Observable<IManyResponseDto<IOccupancyRate>> {
        // const payload = { ...event };
        // payload["populate"] = this.options?.populate;

        return this.http.post<IManyResponseDto<IOccupancyRate>>(`${this.baseUrl}/match`, payload, {
            headers: this.accountService.bearerTokenHeader()
        });
    }
// Bulk Import -----------------------------------------------------------------------------------------
bulkImportGenerateSample(payload :any) {
    return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, payload ,{
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
    
}
