import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { Observable, ReplaySubject } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption } from './quote.model';
import { AllowedProductBscCover, OPTIONS_PRODUCT_BSC_COVERS } from '../product/product.model';

export interface IQuoteQueryParams {
  allCovers: boolean,
  brokerQuotes: boolean
  selectedBrokerQuotes: string
  qcr: boolean
  quoteLocationOccupancyId: string
}

@Injectable({
  providedIn: 'root'
})
export class QuoteOptionService extends CrudService<IQuoteOption> {

  private currentPropertyQuoteOption = new ReplaySubject<IQuoteOption>(null);
  currentPropertyQuoteOption$ = this.currentPropertyQuoteOption.asObservable();

  private quoteOption: IQuoteOption

  setQuoteOptionForProperty(quoteOptions: IQuoteOption) {
    this.quoteOption = quoteOptions
    this.currentPropertyQuoteOption.next(quoteOptions);
  };


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/quoteOption`, http, accountService, { populate: ["quoteId productId partnerId"] as any });
  }

  getAllOptionsByQuoteId(quoteId: string, queryParams?: any): Observable<IOneResponseDto<IQuoteOption[]>> {
    return this.http.get<IOneResponseDto<IQuoteOption[]>>(`${this.baseUrl}/getAllOptionsByQuoteId/${quoteId}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  //expiry policy upload
  expiryCopyDownload(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/expiry-policy-copy`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }

  expiryCopyUploadUrl(id: string) {
    return `${this.baseUrl}/${id}/expiry-policy-copy`;
  };

  expiryCopyDelete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}/expiry-policy-copy`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  dropdownClause(id, quoteOptionId, payload): Observable<IOneResponseDto<IQuoteOption>> {
    return this.http.post<IOneResponseDto<IQuoteOption>>(`${this.baseUrl}/${id}/declaration-clause`, { quoteOptionId: quoteOptionId, payload: payload }, { headers: this.accountService.bearerTokenHeader() });
  }

  descriptionDropdown(id, quoteOptionId, payload): Observable<IOneResponseDto<IQuoteOption>> {
    return this.http.post<IOneResponseDto<IQuoteOption>>(`${this.baseUrl}/${id}/declaration-dropdown`, { quoteOptionId: quoteOptionId, payload: payload }, { headers: this.accountService.bearerTokenHeader() });
  }

  copyAndCreateQuoteOptions(quoteOptionId): Observable<IOneResponseDto<any>> {
    return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/copyAndCreateQuoteOptions`, { quoteOptionId: quoteOptionId }, { headers: this.accountService.bearerTokenHeader() });
  }

  generateQuoteOptionNumber(id): Observable<IOneResponseDto<IQuoteOption>> {
    return this.http.patch<IOneResponseDto<IQuoteOption>>(`${this.baseUrl}/${id}/generate-quoteOption-number`, {}, { headers: this.accountService.bearerTokenHeader() });
  }

  getBscAllowedCoversOptions(quoteOption: IQuoteOption) {
    let covers = []

    if (quoteOption?.bscProductPartnerConfiguration?.bscFireLossOfProfitCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscBurglaryHousebreakingCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscPortableEquipmentsCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscElectronicEquipmentsCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscMoneyTransitCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscMoneySafeTillCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscFidelityGuaranteeCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscFixedPlateGlassCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscSignageCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_SIGNAGE_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.personalAccidentCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.PERSONAL_ACCIDENT_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscWorkmenCompensationCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscLiabilitySectionCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscPedalCycleCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscAccompaniedBaggageCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.bscAllRiskCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_ALL_RISK_COVER
      ))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.floaterCoverAddOn) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.FLOATER_COVER_ADD_ON))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.declarationPolicy) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.DECLARATION_POLICY))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.loseOfRent) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.LOSE_OF_RENT))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.rentForAlternativeAccomodation) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.valuableContentsOnAgreedValueBasis) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.AccidentalDamage) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.ACCIDENTAL_DAMAGE))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.ClaimPreparationCost) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.CLAIM_PREPARATION_COST))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.CoverofValuableContents) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.KeysandLocks) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.KEYS_AND_LOCKS))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.Landscapingincludinglawnsplantshrubsortrees) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.ProtectionandPreservationofProperty) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.RemovalOfDebris) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.REMOVAL_OF_DEBRIS))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.TenantslegalLiability) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.TENANTS_LEGAL_LIABILITY))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.ThirdPartyLiability) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.THIRD_PARTY_LIABILITY))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.AdditionalCustomDuty) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY))
    }

    if (quoteOption?.bscProductPartnerConfiguration?.DeteriorationofStocksinB) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B))
    }
    if (quoteOption?.bscProductPartnerConfiguration?.DeteriorationofStocksinA) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A))
    }
    if (quoteOption?.bscProductPartnerConfiguration?.Escalation) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.ESCALATION))
    }
    if (quoteOption?.bscProductPartnerConfiguration?.EMIProtectionCover) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.EMI_PROTECTION_COVER))
    }
    if (quoteOption?.bscProductPartnerConfiguration?.Insuranceofadditionalexpense) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE))
    }
    if (quoteOption?.bscProductPartnerConfiguration?.Involuntarybetterment) {
      covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.INVOLUNTARY_BETTERMENT))
    }


    return covers

  }

  getSelectedBscAllowedCovers(quoteOption: IQuoteOption) {

    let covers = []
    if(quoteOption){
      for (let cover of quoteOption?.selectedAllowedProductBscCover) {
        covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item?.value == cover))
      }
    }
    return covers
  }

  viewLocationWiseBreakup(body): Observable<IManyResponseDto<any>> {
    return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/view-location-wise-breakup`, body, { headers: this.accountService.bearerTokenHeader() });
  }

  refreshQuoteOption(callback?: (quoteOption: IQuoteOption) => void) {
    const params: Partial<IQuoteQueryParams> = {}

    if (this.quoteOption?.allCoversArray) {
      params['allCovers'] = true
    }

    if (this.quoteOption?.locationBasedCovers?.quoteLocationOccupancy?._id) {
      params['quoteLocationOccupancyId'] = this.quoteOption?.locationBasedCovers?.quoteLocationOccupancy?._id;
    }

    // if (this.quote?.insurerProcessedQuotes) {
    //   params['qcr'] = true

    // }

    // if (this.quote?.brokerWiseQuotes) {
    //   params['brokerQuotes'] = true
    // }

    // TODO: TOBE Handeled
    // params['selectedBrokerQuotes']

    this.get(this.quoteOption?._id, params).subscribe({
      next: (dto) => {
        const quoteOption = dto.data.entity
        this.setQuoteOptionForProperty(quoteOption)
        if (callback) callback(quoteOption)
        console.log('Quote Option Refreshed')
      }
    });
  }

  toggleAllowedProductBscCovers(id, payload): Observable<IOneResponseDto<any>> {
    return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${id}/toggle-allowed-product-bsc-covers`, payload, { headers: this.accountService.bearerTokenHeader() });
  }

  sendQuoteOptionForComparisonReview(id, body): Observable<IOneResponseDto<IQuoteOption>> {
    return this.http.patch<IOneResponseDto<IQuoteOption>>(`${this.baseUrl}/${id}/send-quoteOption-for-Comparison-review`, body, { headers: this.accountService.bearerTokenHeader() });
  }

  generateQuoteOptionPlacementSlip(id, selectedQuoteId): Observable<IOneResponseDto<IQuoteOption>> {
    return this.http.patch<IOneResponseDto<IQuoteOption>>(`${this.baseUrl}/${id}/generate-quoteOption-placementslip/${selectedQuoteId}`, {}, { headers: this.accountService.bearerTokenHeader() });
  }

  attachmentUploadUrl(id: string) {
    return `${this.baseUrl}/${id}/si-attachment-upload-quoteOption-wise`;
  };

  downloadAttachment(filePath: string) {
    return this.http.post(`${this.baseUrl}/si-attachment-download-quoteOption-wise?filePath=${filePath}`, {}, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }

  deleteAttachmentFile(quoteId, filePath) {
    return this.http.post(`${this.baseUrl}/${quoteId}/si-attachment-delete-quoteOption-wise?filePath=${filePath}`, {}, {
      headers: this.accountService.bearerTokenHeader(),
    });
  };

  downloadQCRExcel(quoteOptionId: string, quoteNo: string) {
    return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteOptionId}/excel-download?quoteNo=${quoteNo}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  downloadQCRExcelGmc(quoteOptionId: string, quoteNo: string) {
    return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteOptionId}/excel-download-gmc?quoteNo=${quoteNo}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }


  downloadQCRExcelGmcWithInsurer(quoteOptionId: string, quoteNo: string) {
    return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteOptionId}/excel-download-gmc-insurer?quoteNo=${quoteNo}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  createQuoteOptionQCRVersioning(insurerQuoteOptionId: string, brokerQuoteId: string) {
    return this.http.post<IOneResponseDto<IQuoteOption[]>>(`${this.baseUrl}/create-quoteOption-version`, { insurerQuoteOptionId, brokerQuoteId }, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  downloadDocumentForQuoteSlip(payload: object, productTemplate): Observable<Blob> {
    return this.http.post<Blob>(`${this.baseUrl}/download-document/${productTemplate}`, payload, {
      headers: this.accountService.bearerTokenHeader(),
      responseType: 'blob' as 'json',
    });
  }

  editQCR(quoteNo: string) {
    return this.http.post<IOneResponseDto<IQuoteOption[]>>(`${this.baseUrl}/qcr-edit`, { quoteNo }, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  mergeQuoteOptions(payload): Observable<IOneResponseDto<IQuoteOption>> {
    return this.http.post<IOneResponseDto<IQuoteOption>>(`${this.baseUrl}/merge-quoteOptions`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }
}
