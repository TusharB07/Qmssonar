import { Quote } from '@angular/compiler';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'query-string';
import { Observable, ReplaySubject } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { BrokerDashboardRequest, BrokerDashboardResponse } from '../../quote/pages/dashboard/broker-dashboard/broker-dashboard.component';
import { InsurerDashboardResponse } from '../../quote/pages/dashboard/insurer-dashboard/insurer-dashboard.component';
import { IMappedRmEmailICName, IRmMappedIntermediate } from '../partner/partner.model';
import { AllowedProductBscCover, IProduct, OPTIONS_PRODUCT_BSC_COVERS } from '../product/product.model';
import { IQuoteLocationOccupancy } from '../quote-location-occupancy/quote-location-occupancy.model';
import { IDiffHistory } from '../user/user.model';
import { IAllBscArray, IEandOTemplate, IQuoteGmcTemplate, IQuoteSlip } from './quote.model';


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
export class QuoteService extends CrudService<IQuoteSlip> {

    private currentQuoteSource = new ReplaySubject<IQuoteSlip>(null);
    currentQuote$ = this.currentQuoteSource.asObservable();

    private quote: IQuoteSlip


    setQuote(quote: IQuoteSlip) {
        // Here we will plant the navigation if required
        // console.log('Quote Set', quote)

        console.log(quote);
        this.quote = quote;

        this.currentQuoteSource.next(quote);
    };


    private currentQuoteLocationOccupancyIdSource = new ReplaySubject<string>(null);
    currentQuoteLocationOccupancyId$ = this.currentQuoteLocationOccupancyIdSource.asObservable();

    setQuoteLocationOccupancyId(quoteLocationOccupancyId: string) {
        this.currentQuoteLocationOccupancyIdSource.next(quoteLocationOccupancyId);

        // console.log(quoteLocationOccupancyId)
        // console.log(this.currentQuoteLocationOccupancyIdSource)
    };
    //Intergation-EB [Start]
    //QUote GMC Option List
    private currentQuoteOptions = new ReplaySubject<any[]>(null);
    currentQuoteOptions$ = this.currentQuoteOptions.asObservable();

    setQuoteOptions(quoteOptionsList: any[]) {
        this.currentQuoteOptions.next(quoteOptionsList);
    };

    // setQuoteOptionsEnO(quoteOptionsList: IEandOTemplate[]) {
    //     this.currentQuoteOptions.next(quoteOptionsList);
    // };
    downloadQCRExcel(quoteId: string, quoteNo: string) {

        return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteId}/excel-download?quoteNo=${quoteNo}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }


    aiDocDownload(id: string) {
        return this.http.get(`${this.baseUrl}/${id}/download-upload-aidoc`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    //Selected Option
    private currentSelectedOptions = new ReplaySubject<any>(null);
    currentSelectedOptions$ = this.currentSelectedOptions.asObservable();

    setSelectedOptions(quoteOptionsList: any) {
        this.currentSelectedOptions.next(quoteOptionsList);
    };
    //Intergation-EB [End]


    refresh(callback?: (quote: IQuoteSlip) => void) {

        const params: Partial<IQuoteQueryParams> = {}

        if (this.quote?.allCoversArray) {
            params['allCovers'] = true
        }

        if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id) {
            params['quoteLocationOccupancyId'] = this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id;

        }

        if (this.quote?.insurerProcessedQuotes) {
            params['qcr'] = true

        }

        if (this.quote?.brokerWiseQuotes) {
            params['brokerQuotes'] = true
        }

        // TODO: TOBE Handeled
        params['selectedBrokerQuotes']

        this.get(this.quote?._id, params).subscribe({
            next: (dto) => {
                const quote = dto.data.entity
                this.setQuote(quote)
                if (callback) callback(quote)

                // this.currentQuote$.subscribe({
                //     next: (quote) => {
                //         if (callback) callback(quote)
                //     }
                // })


                console.log('Quote Refreshed')
                // this.currentQuote$.toPromise().then((quote) => {
                //     if (quote) {
                //         console.log('new quote', quote);
                //         if (callback) callback(quote)
                //     }

                // })
                // console.log(responseQuote)


            },
            complete: () => {
                // console.log(quote)
            },
        });
    }

    // private currentAllBscArraySource = new ReplaySubject<IAllBscArray>(null);
    // currentAllBscArray$ = this.currentAllBscArraySource.asObservable();

    // setAllBscArray(locationBasedCovers:any) {
    //     this.currentAllBscArraySource.next(allBscArray);
    // };

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/quotes`, http, accountService, { populate: ["sectorId", "clientId", "productId", "discountId", "employeeDataId", "gmcTemplateDataId", "marineDataId", "wcRatesDataId", "wcTemplateDataId", "liabilityTemplateDataId", "liabilityCGLTemplateDataId", "liabilityProductTemplateDataId", "liabilityEandOTemplateDataId", "policyTypeIdEandO", "insuredBusinessActivityId", "numberOfExperienceId retroactiveCoverId juridictionId territoryId", "salesApprovedById"] });
    }
    docforAIUploadUrl(id: string) {
        return `${this.baseUrl}/${id}/upload-aidoc`;
    };

    updateQuoteSlipFields(id: string, payload): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/quotes/${id}/underwriterMappingNewFlow`, payload,
            {
                headers: this.accountService.bearerTokenHeader()
            })
    }

    policyupload(id: string) {
        return `${this.baseUrl}/upload-policy-copy-psr/${id}`;
    };

    Riskcoverupload(id: string) {
        return `${this.baseUrl}/upload-risk-cover-letter/${id}`;
    };


    proceedquote(id: string, payload): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/quotes/${id}/generate-postplacement`, payload,
            {
                headers: this.accountService.bearerTokenHeader()
            })
    }
    getQuoteSlipById(id: string): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.get<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    // get(id) {
    //     return this.get(`${id}?quoteLocationOccupancyId=${quoteLocationOccupancyId}`)

    // }

    // ** Overrided so we can get the strict params
    public override get(id: string, queryParams?: Partial<IQuoteQueryParams>): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.get<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}?${stringify(queryParams)}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    getAllProductsForLoggedInBroker(): Observable<IManyResponseDto<IProduct>> {
        return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/products-for-logged-in-broker`, { headers: this.accountService.bearerTokenHeader() });
    }

    getEarthquakeHazardIndia(payload) {
        return this.http.post<any>(`${environment.apiUrl}/moodysReport/in_eq_hazard`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    getEarthquakeLossCostIndia(payload) {
        return this.http.post<any>(`${environment.apiUrl}/moodysReport/in_eq_loss_cost`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    getEarthquakeRiskScoreIndia(payload) {
        return this.http.post<any>(`${environment.apiUrl}/moodysReport/in_eq_risk_score`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    getFloodLossCostIndia(payload) {
        return this.http.post<any>(`${environment.apiUrl}/moodysReport/in_fl_loss_cost`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    getFloodRiskScoreIndia(payload) {
        return this.http.post<any>(`${environment.apiUrl}/moodysReport/in_fl_risk_score`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    attachmentUploadUrl(id: string) {
        return `${this.baseUrl}/${id}/si-attachment-upload`;
    };

    downloadAttachment(filePath: string) {
        return this.http.post(`${this.baseUrl}/si-attachment-download?filePath=${filePath}`, {}, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    deleteAttachmentFile(quoteId, filePath) {
        return this.http.post(`${this.baseUrl}/${quoteId}/si-attachment-delete?filePath=${filePath}`, {}, {
            headers: this.accountService.bearerTokenHeader(),
        });
    };

    // To Get/Read Single Records from the DB
    onchangeLocation(id, record): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.post<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/onchange-location`, record, { headers: this.accountService.bearerTokenHeader() });
    }

    recomputePremium(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.post<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/recompute-premium`, {}, { headers: this.accountService.bearerTokenHeader() });
    }

    // generateQuoteSlip(id): Observable<IManyResponseDto<any>> {
    //     return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/generate-Quote-Slip/${id}`, { headers: this.accountService.bearerTokenHeader() });
    // }

    copyToInsurer(body): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/copy-to-insurer`, body, { headers: this.accountService.bearerTokenHeader() });
    }

    getRate(body): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/getRate`, body, { headers: this.accountService.bearerTokenHeader() });
    }

    viewLocationWiseBreakup(body): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/view-location-wise-breakup`, body, { headers: this.accountService.bearerTokenHeader() });
    }
    compareQuoteBrokerWise(body): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/compareQuoteBrokerWise`, body, { headers: this.accountService.bearerTokenHeader() });
    }

    getComputeAddons(body): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/getcomputeaddons`, body, { headers: this.accountService.bearerTokenHeader() });
    }


    // QUOTE STATE MANAGEMENT ---------------------------------------------------------------------------- START
    generateQuoteNumber(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/generate-quote-number`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
    sendQuoteForApproval(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/send-quote-for-approval`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
    sendQuoteToInsuranceCompanyRm(id, payload): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/send-quote-to-insurance-company-rm`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    sendQuoteToInsuranceCompanyAutoAssign(id, payload): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/send-quote-to-insurance-company-autoassign`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    sendQuoteToUnderwritterApproval(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/send-quote-to-underwritter-approval`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
    sendQuoteForComparisonReview(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/send-quote-for-Comparison-review`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
    sendQuoteForPlacement(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/send-quote-for-placement`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
    generatePlacementSlip(id, selectedQuoteId): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.patch<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/${id}/generate-placementslip/${selectedQuoteId}`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
    // QUOTE STATE MANAGEMENT ---------------------------------------------------------------------------- END

    getInsuranceCompanyMapping(id): Observable<IManyResponseDto<IMappedRmEmailICName>> {
        return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/${id}/get-insurance-company-mapping`, { headers: this.accountService.bearerTokenHeader() });
    }

    getLocationWiseBreakUp(id): Observable<IOneResponseDto<any>> {
        return this.http.get<IOneResponseDto<any>>(`${this.baseUrl}/${id}/get-location-wise-breakup`, { headers: this.accountService.bearerTokenHeader() });
    }

    generateOtp(payload): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/generateOtp`, payload, { headers: this.accountService.bearerTokenHeader() });
    }
    verifyOtp(payload): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/verifyOtp`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    getNestedDiffHistory(id, payload = {}): Observable<IManyResponseDto<IDiffHistory>> {
        return this.http.post<IManyResponseDto<IDiffHistory>>(`${this.baseUrl}/nested-diff/${id}`, payload, { headers: this.accountService.bearerTokenHeader() });
    }
    toggleAllowedProductBscCovers(id, payload): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${id}/toggle-allowed-product-bsc-covers`, payload, { headers: this.accountService.bearerTokenHeader() });
    }
    deleteproductbsccovers(id, payload): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${id}/delete-product-bsc-covers`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    deleteProductBscCoversIC(id, payload): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${id}/delete-product-bsc-covers`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    listofbsccoverswithfile(quoteId) {
        return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/${quoteId}/list-of-bsc-covers-with-file`, { headers: this.accountService.bearerTokenHeader() });
    }

    quotePreviousPageRequistion(payload) {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/quote-previous-page-requistion`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    downloadBscCoversExcel(quoteId: string) {
        return this.http.get(`${this.baseUrl}/${quoteId}/
        `, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    uploadBscCoversExcel(quoteId: string) {
        return `${this.baseUrl}/${quoteId}/excel-upload`;
    };

    uploadProposalFormUrl(quoteId: string) {
        return `${this.baseUrl}/${quoteId}/proposal-form-upload`;
    };

    downloadFGIPolicy(payload) {
        return this.http.post(`${this.baseUrl}/downloadFgiPolicy`, payload, {
            headers: this.accountService.bearerTokenHeader()
        });
    }


    getBscAllowedCoversOptions(quote: IQuoteSlip) {
        console.log(quote)
        let covers = []
        // console.log(quote)

        if (quote.bscProductPartnerConfiguration?.bscFireLossOfProfitCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscBurglaryHousebreakingCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscPortableEquipmentsCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscElectronicEquipmentsCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscMoneyTransitCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscMoneySafeTillCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscFidelityGuaranteeCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscFixedPlateGlassCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscSignageCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_SIGNAGE_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.personalAccidentCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.PERSONAL_ACCIDENT_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscWorkmenCompensationCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscLiabilitySectionCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscPedalCycleCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscAccompaniedBaggageCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER))
        }

        if (quote.bscProductPartnerConfiguration?.bscAllRiskCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.BSC_ALL_RISK_COVER
            ))
        }

        if (quote.bscProductPartnerConfiguration?.floaterCoverAddOn) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.FLOATER_COVER_ADD_ON))
        }

        if (quote.bscProductPartnerConfiguration?.declarationPolicy) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.DECLARATION_POLICY))
        }

        if (quote.bscProductPartnerConfiguration?.loseOfRent) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.LOSE_OF_RENT))
        }

        if (quote.bscProductPartnerConfiguration?.rentForAlternativeAccomodation) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION))
        }

        if (quote.bscProductPartnerConfiguration?.valuableContentsOnAgreedValueBasis) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS))
        }

        if (quote.bscProductPartnerConfiguration?.AccidentalDamage) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.ACCIDENTAL_DAMAGE))
        }

        if (quote.bscProductPartnerConfiguration?.ClaimPreparationCost) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.CLAIM_PREPARATION_COST))
        }

        if (quote.bscProductPartnerConfiguration?.CoverofValuableContents) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.COVER_OF_VALUABLE_CONTENTS))
        }

        if (quote.bscProductPartnerConfiguration?.KeysandLocks) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.KEYS_AND_LOCKS))
        }

        if (quote.bscProductPartnerConfiguration?.Landscapingincludinglawnsplantshrubsortrees) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.LANDSCAPING_INCLUDING_LAWNS_PLANT_SHRUBS_OR_TREES))
        }

        if (quote.bscProductPartnerConfiguration?.ProtectionandPreservationofProperty) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.PROTECTION_AND_PRESERVATION_OF_PROPERTY))
        }

        if (quote.bscProductPartnerConfiguration?.RemovalOfDebris) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.REMOVAL_OF_DEBRIS))
        }

        if (quote.bscProductPartnerConfiguration?.TenantslegalLiability) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.TENANTS_LEGAL_LIABILITY))
        }

        if (quote.bscProductPartnerConfiguration?.ThirdPartyLiability) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.THIRD_PARTY_LIABILITY))
        }

        if (quote.bscProductPartnerConfiguration?.AdditionalCustomDuty) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.ADDITIONAL_CUSTOM_DUTY))
        }

        if (quote.bscProductPartnerConfiguration?.DeteriorationofStocksinB) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_B))
        }
        if (quote.bscProductPartnerConfiguration?.DeteriorationofStocksinA) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.DETERIORATION_OF_STOCKS_IN_A))
        }
        if (quote.bscProductPartnerConfiguration?.Escalation) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.ESCALATION))
        }
        if (quote.bscProductPartnerConfiguration?.EMIProtectionCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.EMI_PROTECTION_COVER))
        }
        if (quote.bscProductPartnerConfiguration?.Insuranceofadditionalexpense) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.INSURANCE_OF_ADDITIONAL_EXPENSE))
        }
        if (quote.bscProductPartnerConfiguration?.Involuntarybetterment) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == AllowedProductBscCover.INVOLUNTARY_BETTERMENT))
        }


        return covers

    }

    getSelectedBscAllowedCovers(quote: IQuoteSlip) {

        let covers = []
        // console.log(quote)

        for (let cover of quote.selectedAllowedProductBscCover) {
            covers.push(OPTIONS_PRODUCT_BSC_COVERS.find((item) => item.value == cover))
        }
        console.log(covers)
        return covers
    }

    cancellQuote(quoteId, action): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/cancellQuote`, { quoteId: quoteId, action: action }, { headers: this.accountService.bearerTokenHeader() });
    }

    copyRevisedQuote(quoteId): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/copyRevisedQuote`, { quoteId: quoteId }, { headers: this.accountService.bearerTokenHeader() });
    }

    revisedQuote(insurerQuoteOptionId, brokerQuoteId): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/revisionQuote`, { insurerQuoteOptionId: insurerQuoteOptionId, brokerQuoteId: brokerQuoteId }, { headers: this.accountService.bearerTokenHeader() });
    }

    createOptionQCRVersioningLiability(insurerQuoteOptionId: string, brokerQuoteId: string) {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/create-option-version-Liability`, { insurerQuoteOptionId, brokerQuoteId }, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    dashboard(request: BrokerDashboardRequest): Observable<IOneResponseDto<BrokerDashboardResponse>> {
        return this.http.post<IOneResponseDto<BrokerDashboardResponse>>(`${this.baseUrl}/brokerDashboard`, request, { headers: this.accountService.bearerTokenHeader() });
    }

    insurerDashboard(request: BrokerDashboardRequest): Observable<IOneResponseDto<InsurerDashboardResponse>> {
        return this.http.post<IOneResponseDto<InsurerDashboardResponse>>(`${this.baseUrl}/insurerDashboard`, request, { headers: this.accountService.bearerTokenHeader() });
    }

    misexcelDownload(quoteIds): Observable<IOneResponseDto<IBulkImportResponseDto>> {

        //return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/mis-excel-download-v2`,quoteIds, { headers: this.accountService.bearerTokenHeader()});
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/mis-excel-download-v2`, { quoteIds }, { headers: this.accountService.bearerTokenHeader() });

    }

    misexcelDownloadTake2(quoteIds): Observable<IOneResponseDto<IBulkImportResponseDto>> {

        //return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/mis-excel-download-v2`,quoteIds, { headers: this.accountService.bearerTokenHeader()});
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/download-quote-report-excel`, { quoteIds }, { headers: this.accountService.bearerTokenHeader() });

    }

    downloadAuditTrail(quoteId): Observable<IOneResponseDto<IBulkImportResponseDto>> {

        //return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/mis-excel-download-v2`,quoteIds, { headers: this.accountService.bearerTokenHeader()});
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/downloadAuditLogExcel`, { quoteId }, { headers: this.accountService.bearerTokenHeader() });

    }


    getInsurerQuote(originalQuoteId): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/getInsurerQuote`, { originalQuoteId: originalQuoteId }, { headers: this.accountService.bearerTokenHeader() });
    }

    uploadCKYCDocument(payload: any) {
        return this.http.post(`${this.baseUrl}/uploadDocument`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    sendpaymentLink(payload) {
        return this.http.post(`${this.baseUrl}/paymentSendEmailLink`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    // sendpaymentLinkWithQuoteSlip(payload){
    //     return this.http.post(`${this.baseUrl}/paymentSendEmailWithQuoteSlipandLink`, payload, {
    //         headers: this.accountService.bearerTokenHeader(),
    //       });
    // }

    sendpaymentLinkWithQuoteSlip(payload) {
        return this.http.post(`${this.baseUrl}/paymentSendEmailLinkWithAttachQuoteSlip`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    sendQCREmailToClient(payload) {
        return this.http.post(`${this.baseUrl}/sendQCREmailToClient`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        })
    }

    finalQuoteslipUploadForPaymentLink(payload, quoteId) {
        return this.http.post(`${this.baseUrl}/${quoteId}/finalQuoteslipUploadForPaymentLink`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    quoteDataToExternalPaymentLink(quoteId) {
        return this.http.post(`${this.baseUrl}/paymentLinkQuoteSlip`, quoteId);
    }

    getPaymentURL(payload) {
        return this.http.post(`${this.baseUrl}/makePayment`, payload);
    }

    savePaymentDetails(payload) {
        return this.http.post(`${this.baseUrl}/savePaymentDetails`, payload);
    }

    updatePaymentStatus(quoteId) {
        return this.http.post(`${this.baseUrl}/updatePaymentStatus`, quoteId);
    }

    retryFgiQueue(quoteId) {
        return this.http.post(`${this.baseUrl}/reccallFgiApi`, quoteId, { headers: this.accountService.bearerTokenHeader() });
    }

    rejectQuote(payload) {
        return this.http.post(`${this.baseUrl}/rejectQuote`, payload, { headers: this.accountService.bearerTokenHeader() });
    }

    getClientDetails(payload) {
        return this.http.post(`${this.baseUrl}/getClientDetails`, payload, { headers: this.accountService.bearerTokenHeader() })
    }

    //Intergation-EB [Start]
    empGradewiseDataByQuoteId(id: string) {
        return this.http.get<IOneResponseDto<any>>(`${this.baseUrl}/${id}/empGradewiseDataByQuoteId`, { headers: this.accountService.bearerTokenHeader() });
    }
    viewEmployeesSummary(body): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/view-employees-summary`, body, { headers: this.accountService.bearerTokenHeader() });
    }

    // To Get/Read Single Records from the DB
    getAllQuoteOptions(id: string, queryParams?: any): Observable<IOneResponseDto<IQuoteGmcTemplate[]>> {
        return this.http.get<IOneResponseDto<IQuoteGmcTemplate[]>>(`${this.baseUrl}/getQuoteGmcOptions/${id}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    // To Get/Read Single Records from the DB
    getAllLiabilityQuoteOptions(id: string, isPopulate: any = false): Observable<IOneResponseDto<any[]>> {
        return this.http.get<IOneResponseDto<any[]>>(`${this.baseUrl}/getQuoteLiabilityOptions/${id}/${isPopulate}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    placeLiabilityQuotewithOption(quoteId: string, quoteOptionId: string): Observable<IOneResponseDto<any[]>> {
        return this.http.post<IOneResponseDto<any[]>>(`${this.baseUrl}/place-liability-quote`, { quoteId, quoteOptionId }, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    getPlacedLiabilityQuote(quoteNo: string): Observable<IOneResponseDto<any[]>> {
        return this.http.get<IOneResponseDto<any[]>>(`${this.baseUrl}/get-placed-liability-quote/${quoteNo}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    //Upload Employee Demography Excel Url
    getBulkImportProps(quoteId: string, planType: string, fileUploadType: string, onUpload): PFileUploadGetterProps {
        return {
            name: 'excel_upload',
            url: `${this.baseUrl}/${quoteId}/${planType}/${fileUploadType}/excel-upload-v2`,
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
    downloadQuoteEmpDataExcel(id: string, planType: string, fileType: string) {
        return this.http.get(`${this.baseUrl}/exceldownload/${id}/${planType}/${fileType}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    downloadQuoteEmployeeDemographyExcel(id: string, fileType: string) {
        return this.http.get(`${this.baseUrl}/employee-demography-download-excel/${id}/${fileType}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }
    uploadEmpDemographicFormUrl(quoteId: string) {
        return `${this.baseUrl}/${quoteId}/proposal-form-upload`;
    };

    claimAnalyticsDocumentUploadUrl(id: string) {
        return `${this.baseUrl}/${id}/upload-claim-analytics-document`;
        //return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${id}/view-employees-summary`, body, { headers: this.accountService.bearerTokenHeader() });
    };


    claimAnalyticsDocumentDownload(id: string) {
        return this.http.get(`${this.baseUrl}/${id}/download-claim-analytics-document`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    getCategoryIdDetails(id): Observable<IManyResponseDto<IMappedRmEmailICName>> {
        return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/${id}`, { headers: this.accountService.bearerTokenHeader() });

    }

    claimAnalyticsDocumentDelete(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}/delete-claim-analytics-document`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    createKyc(payload) {
        return this.http.post(`${this.baseUrl}/createKyc`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        })
    }

    downloadUnderWriterReviewExcel(quoteId: string) {
        return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteId}/excel-download-underwriterReview`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    sendMailToInsurer(payload, queryParams) {
        return this.http.post(`${this.baseUrl}/${this.quote._id}/sendMailToInsurerOffline?${stringify(queryParams)}`, payload, {
            headers: this.accountService.bearerTokenHeader()
        })
    }

    getQuoteByQuoteNo(payload) {
        return this.http.get(`${this.baseUrl}/${payload}/getQuoteSlipByQuoteNo`, {
            headers: this.accountService.bearerTokenHeader()
        })
    }
    externalQCR(id, queryParams) {
        return this.http.get(`${this.baseUrl}/externalQCR/${id}?${stringify(queryParams)}`)
    }
    externalQCRGmc(id, queryParams) {
        return this.http.get(`${this.baseUrl}/externalQCRGmc/${id}?${stringify(queryParams)}`)
    }
    pushBackTo(id, payload) {
        return this.http.patch(`${this.baseUrl}/${id}/push-back`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        })
    }
    sendForQCRApproval(id, queryParams) {
        return this.http.patch(`${this.baseUrl}/${id}/send-for-approval?${stringify(queryParams)}`, {}, {
            headers: this.accountService.bearerTokenHeader(),
        })
    }
    sendForQuoteSlipApproval(id, queryParams) {
        return this.http.patch(`${this.baseUrl}/${id}/send-for-approval?${stringify(queryParams)}`, {}, {
            headers: this.accountService.bearerTokenHeader(),
        })
    }

    sendForApproval(id) {
        return this.http.patch(`${this.baseUrl}/${id}/send-for-approval`, {}, {
            headers: this.accountService.bearerTokenHeader(),
        })
    }

    updateUWSlip(payload: any) {
        return this.http.post(`${this.baseUrl}/updateUWSlip`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }
    //Intergation-EB [End]

    lossquote(id: string, payload): Observable<any> {
        return this.http.post(`${environment.apiUrl}/quotes/quote-details/${id}`, payload,
            {
                headers: this.accountService.bearerTokenHeader()
            })
    }

}
