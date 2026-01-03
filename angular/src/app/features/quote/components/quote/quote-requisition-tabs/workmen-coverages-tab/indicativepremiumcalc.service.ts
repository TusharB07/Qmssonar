import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DatePipe } from '@angular/common'
import { IWCRates } from 'src/app/features/admin/wc-rates-master/wc-rate-master.model';
import { ISalarySlabs } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.model';
import { IQuoteSlip, IWCRatesData } from 'src/app/features/admin/quote/quote.model';
import { EmpRatesService } from 'src/app/features/admin/emp-ratesTemplates/emprates.service';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { forkJoin } from 'rxjs';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
declare let Plotly: any;
@Injectable({
    providedIn: 'root'
})
export class IndicativePremiumCalcService {

    constructor(
        private http: HttpClient, private empRateService: EmpRatesService, private wclistofmasterservice: WCListOfValueMasterService) { }

    CalculateWCPremium(_wcRatesMaster: IWCRates[], _salarySlab: ISalarySlabs[], wcRatesData: IWCRatesData[]) {
        let indicpremium = 0
        wcRatesData.forEach(element => {
            let salarySlab = _salarySlab.filter(x => element.salaryPerMonth >= x.fromSalary && element.salaryPerMonth <= x.toSalary)[0]
            if (salarySlab != undefined) {
                let wcrate = _wcRatesMaster.filter(x => x.salaryId == salarySlab._id && x.businessTypeId == element.businessTypeId)[0]
                if (wcrate != undefined) {
                    let totalwages = +element.salaryPerMonth * +element.PeriodCoveredInMonths * +element.noOfEmployees;
                    let salaryToCompare = salarySlab.fromSalary == 0 ? salarySlab.toSalary : salarySlab.fromSalary
                    if (element.salaryPerMonth < salaryToCompare) {
                        element.totalSalaryUptoFT = +element.noOfEmployees * +element.salaryPerMonth * +element.PeriodCoveredInMonths
                        element.rateUptoFT = wcrate.rate;
                        element.rateAboveFT = wcrate.rateAbove;
                    }
                    else {
                        element.totalSalaryUptoFT = +(salarySlab.fromSalary - 1) * +element.PeriodCoveredInMonths * +element.noOfEmployees;
                        let _salarySlabAbove = _salarySlab.filter(x => element.salaryPerMonth >= x.fromSalary && element.salaryPerMonth >= x.toSalary)[0]
                        if (_salarySlabAbove != undefined) {
                            let _wcrateAbove = _wcRatesMaster.filter(x => x.salaryId == _salarySlabAbove._id && x.businessTypeId == element.businessTypeId)[0]
                            if (_wcrateAbove != undefined) {
                                element.rateUptoFT = _wcrateAbove.rate;
                                element.rateAboveFT = wcrate.rate;
                            }
                        }
                    }
                    element.totalSalaryAboveFT = +totalwages - +element.totalSalaryUptoFT;

                    element.netPremium = ((+element.totalSalaryUptoFT * +element.rateUptoFT) / 1000) + ((+element.totalSalaryAboveFT * +element.rateAboveFT) / 1000)
                }
            }

        });
        return wcRatesData;
    }


    CalculateDandOPremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 0.33500;
        return premium;
    }

    CalculateEandOPremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 0.25;
        return premium;
    }

    CalculateCGLPremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 0.15;
        return premium;
    }

    CalculateProductLiabilityPremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 0.35;
        return premium;
    }

    CalculateCyberLiabilityPremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 1;
        return premium;
    }

    CalculatePublicLiabilityPremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 0.10;
        return premium;
    }

    CalculateCrimeInsurancePremium(limitOfLiability: number) {
        let premium = 0;
        premium = limitOfLiability * 0.5;
        return premium;
    }

    isOtcCheckLiability(quoteData: any, templateData: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let isBreach = false;

            forkJoin({
                activities: this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_INSURED_BUSINESS_ACTIVITY),
                subsiderylist: this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_SUBSIDIARY_LOCATION),
                policies: this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_TYPE_OF_POLICY)
            }).subscribe({
                next: ({ activities, subsiderylist, policies }) => {
                    const optionsTypeOfPolicy = policies.data.entities.map(entity => ({
                        label: entity.lovKey.toString(),
                        value: entity._id,
                        otcType: entity.otcType
                    }));
                    const selectedTypeOfPolicy = optionsTypeOfPolicy.find(x => x.value == templateData.typeOfPolicyId);

                    const optionsInsuredBusinessActivity = activities.data.entities.map(entity => ({
                        label: entity.lovKey.toString(),
                        value: entity._id,
                        otcType: entity.otcType
                    }));
                    const selectedOptionsInsuredBusinessActivity = optionsInsuredBusinessActivity.find(x => x.value == quoteData.insuredBusinessActivityId["_id"]);

                    const optionSubsideryLocation = subsiderylist.data.entities.map(entity => ({
                        label: entity.lovKey.toString(),
                        value: entity._id,
                        otcType: entity.otcType
                    }));
                    const selectedCountryIds = templateData.subsidaryDetails.map(item => item.countryId);
                    const selectedSubsideryLocations = optionSubsideryLocation.filter(item =>
                        selectedCountryIds.includes(item.value)
                    );

                    if (selectedOptionsInsuredBusinessActivity?.otcType === AllowedOtcTypes.NONOTC) {
                        isBreach = true;
                    }
                    if (quoteData.turnOverThresholdOrAssetSizeOfCompany > 10000000000) {
                        isBreach = true;
                    }
                    if (selectedTypeOfPolicy?.otcType === AllowedOtcTypes.NONOTC) {
                        isBreach = true;
                    }
                    if (
                        templateData.liabiltyDeductibles.length > 0 &&
                        templateData.liabiltyDeductibles.some((x) => x.otcType === AllowedOtcTypes.NONOTC && x.isSelected)
                    ) {
                        isBreach = true;
                    }
                    if (selectedSubsideryLocations.some((item) => item.otcType === AllowedOtcTypes.NONOTC)) {
                        isBreach = true;
                    }

                    resolve(isBreach);
                },
                error: (error) => {
                    console.error('Error fetching values:', error);
                    reject(error);
                }
            });
        });
    }

    static isLiabilityProduct(quote: IQuoteSlip): boolean {
        let isLiabilityProduct: boolean = false
        if (quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY ||
            quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CGL ||
            quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CRIME ||
            quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CYBER ||
            quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_EANDO ||
            quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PRODUCT ||
            quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PUBLIC ||
            quote.productId["productTemplate"] == AllowedProductTemplate.WORKMENSCOMPENSATION
        ) isLiabilityProduct = true;
        return isLiabilityProduct;
    }


}

