import { Component, Input, OnInit } from '@angular/core';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ILov, PermissionType } from 'src/app/app.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-risk-management-feature-tab',
    templateUrl: './risk-management-feature-tab.component.html',
    styleUrls: ['./risk-management-feature-tab.component.scss']
})
export class RiskManagementFeatureTabComponent implements OnInit {

    //   quote: IQuoteSlip;

    riskParametersForm: FormGroup;

    optionsAgeOfBuilding: ILov[];
    optionsConstructionType: ILov[];
    optionsYearLossHistory: ILov[];
    optionsFireProtection: ILov[];
    optionsAmcProtection: ILov[];
    optionsRiskCovered: ILov[];
    optionsPremises: ILov[];
    isMobile: boolean = false;
    toWord = new ToWords();
    private currentQuote: Subscription;

    @Input() quote: IQuoteSlip;

    @Input() permissions: PermissionType[] = []

    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    @Input() quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private listOfValueService: ListOfValueMasterService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,
    ) {
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote

            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto
            }
        });
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        this.createForm();
    }

    searchOptionsAgeOfBuilding(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_AGE_OF_BUILDING).subscribe({
            next: data => {
                this.optionsAgeOfBuilding = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }
    searchOptionsConstructionType(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_CONSTRUCTION_TYPE).subscribe({
            next: data => {
                this.optionsConstructionType = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }
    searchOptionsYearLossHistory(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_THREE_YEAR_LOSS_HISTORY).subscribe({
            next: data => {
                this.optionsYearLossHistory = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }
    searchOptionsFireProtection(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_FIRE_PROTECTION).subscribe({
            next: data => {
                this.optionsFireProtection = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }
    searchOptionsAmcFireProtection(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_AMC_FOR_FIRE_PROTECTION).subscribe({
            next: data => {
                this.optionsAmcProtection = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }
    searchOptionsRiskCovered(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE).subscribe({
            next: data => {
                this.optionsRiskCovered = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }
    searchOptionsPremises(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_PREMISES_FLOOR).subscribe({
            next: data => {
                this.optionsPremises = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }

    createForm(quoteLocationOccupancy?: IQuoteLocationOccupancy) {

        // console.log(this.ageOfBuildingOptions.find(el => el.value == quoteLocationOccupancy?.ageOfBuilding))

        this.riskParametersForm = this.formBuilder.group({
            /* ageOfBuilding: [
                quoteLocationOccupancy?.ageOfBuilding
                    ? this.ageOfBuildingOptions.find(el => el.value == quoteLocationOccupancy.ageOfBuilding)
                    : this.ageOfBuildingOptions[0], Validators.required],
            constructionType: [
                quoteLocationOccupancy?.constructionType
                    ? this.constructionTypeOptions.find(el => el.value == quoteLocationOccupancy.constructionType)
                    : this.constructionTypeOptions[0], Validators.required],
            yearLossHistory: [
                quoteLocationOccupancy?.yearLossHistory
                    ? this.yearLossHistoryOptions.find(el => el.value == quoteLocationOccupancy.yearLossHistory)
                    : this.yearLossHistoryOptions[0], Validators.required],
            fireProtection: [
                quoteLocationOccupancy?.fireProtection
                    ? this.fireProtectionOptions.find(el => el.value == quoteLocationOccupancy.fireProtection)
                    : this.fireProtectionOptions[0], Validators.required],
            amcFireProtection: [
                quoteLocationOccupancy?.amcFireProtection
                    ? this.amcProtectionOptions.find(el => el.value == `${quoteLocationOccupancy.amcFireProtection}`)
                    : this.amcProtectionOptions[0], Validators.required],
            riskCovered: [
                quoteLocationOccupancy?.riskCovered
                    ? this.riskCoveredOptions.find(el => el.value == quoteLocationOccupancy.riskCovered)
                    : this.riskCoveredOptions[0], Validators.required],
            premises: [
                quoteLocationOccupancy?.premises
                    ? this.premisesBasementOptions.find(el => el.value == quoteLocationOccupancy.premises)
                    : this.premisesBasementOptions[0], Validators.required], */
            ageOfBuilding: [],
            constructionType: [],
            yearLossHistory: [],
            fireProtection: [],
            amcFireProtection: [],
            riskCovered: [],
            premises: []
        })
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

}
