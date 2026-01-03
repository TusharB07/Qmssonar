import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { Subscription } from 'rxjs';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IQuoteOption, IQuoteSlip, OPTIONS_QUOTE_AGE_OF_BUILDING, OPTIONS_QUOTE_AMC_FOR_FIRE_PROTECTION, OPTIONS_QUOTE_CONSTRUCTION_TYPE, OPTIONS_QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE, OPTIONS_QUOTE_FIRE_PROTECTION, OPTIONS_QUOTE_PREMISES_FLOOR, OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY } from 'src/app/features/admin/quote/quote.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { DialogService } from 'primeng/dynamicdialog';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { ToWords } from 'to-words';
import { RiskInspectionStatusViewAllLoactionsDialogComponent } from 'src/app/features/broker/risk-inspection-status-view-all-loactions-dialog/risk-inspection-status-view-all-loactions-dialog.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-quote-edit-steps-risk-inspection-claim-experience-tab',
    templateUrl: './quote-edit-steps-risk-inspection-claim-experience-tab.component.html',
    styleUrls: ['./quote-edit-steps-risk-inspection-claim-experience-tab.component.scss']
})
export class QuoteEditStepsRiskInspectionClaimExperienceTabComponent implements OnInit {

    currentYear: number = new Date().getFullYear();
    //   quoteId: string = '';
    quote: IQuoteSlip;
    selectedQuoteLocationOccpancyId: string;

    toWord = new ToWords();



    cols: any = []
    rows: any = [
        { header: 'Premium Paid' },
        { header: 'Claim Amount' },
        { header: 'No. of Claims' },
        { header: 'Nature of Claim' },
    ];
    riskParametersForm: FormGroup;

    private currentQuote: Subscription;

    ageOfBuildingOptions: ILov[];
    constructionTypeOptions: ILov[];
    yearLossHistoryOptions: ILov[];
    fireProtectionOptions: ILov[];
    amcProtectionOptions: ILov[];
    riskCoveredOptions: ILov[];
    premisesBasementOptions: ILov[];
    ageOfBuilding: any;
    constructionType: any;
    yearLossHistory: any;
    fireProtection: any;
    amcProtection: any;
    riskCovered: any;
    premisesBasement: any;

    optionsAgeOfBuilding: ILov[];
    optionsConstructionType: ILov[];
    optionsYearLossHistory: ILov[];
    optionsFireProtection: ILov[];
    optionsAmcProtection: ILov[];
    optionsDistanceBetweenFireBrigade: ILov[];
    optionsPremises: ILov[];
    submitted: any[];
    index: any;

    private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
    quoteOptionData: IQuoteOption                                          // New_Quote_option

    constructor(


        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private formBuilder: FormBuilder,
        private dialogService: DialogService,
        private listOfValueService: ListOfValueMasterService,
        private router: Router,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,
    ) {

        this.optionsAgeOfBuilding = OPTIONS_QUOTE_AGE_OF_BUILDING;
        this.optionsConstructionType = OPTIONS_QUOTE_CONSTRUCTION_TYPE;
        this.optionsYearLossHistory = OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY
        this.optionsFireProtection = OPTIONS_QUOTE_FIRE_PROTECTION
        this.optionsAmcProtection = OPTIONS_QUOTE_AMC_FOR_FIRE_PROTECTION
        this.optionsDistanceBetweenFireBrigade = OPTIONS_QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE
        this.optionsPremises = OPTIONS_QUOTE_PREMISES_FLOOR

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
        this.cols = [
            { from: new Date(this.currentYear - 3, 1, 1), to: new Date(this.currentYear - 2, 1, 1) },
            { from: new Date(this.currentYear - 2, 1, 1), to: new Date(this.currentYear - 1, 1, 1) },
            { from: new Date(this.currentYear - 1, 1, 1), to: new Date(this.currentYear, 1, 1) },
        ];
        // this.createForm();

        // Old_Quote
        // this.createForm(this.quote?.locationBasedCovers?.quoteLocationOccupancy);

        // New_Quote_option
        this.createForm(this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy);
        this.cols = [
            this.currentYear - 2,
            this.currentYear - 1,
            this.currentYear
        ];
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

    searchOptionsAmcFireProtection(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_AMC_FOR_FIRE_PROTECTION).subscribe({
            next: data => {
                this.optionsAmcProtection = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }

    searchOptionsConstructionType(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_CONSTRUCTION_TYPE).subscribe({
            next: data => {
                // this.optionsConstructionType = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }



    searchOptionsYearLossHistory(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_THREE_YEAR_LOSS_HISTORY).subscribe({
            next: data => {
                // this.optionsYearLossHistory = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }


    searchOptionsRiskCovered(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE).subscribe({
            next: data => {
                // this.optionsDistanceBetweenFireBrigade = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }


    openRiskInspectionStatusDialog() {
        const ref = this.dialogService.open(RiskInspectionStatusViewAllLoactionsDialogComponent, {
            header: "Risk Parameters for all locations",
            data: {
                quoteId: this.quote._id,
            },
            width: '70%',
            styleClass: 'customPopup'
        })
    }

    // searchOptionsAgeOfBuilding(event) {
    //   this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_AGE_OF_BUILDING).subscribe({
    //       next: data => {
    //           this.optionsAgeOfBuilding = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //           // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //       },
    //       error: e => { }
    //   })
    // }



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
        const ageOfBuilding = null;

        this.riskParametersForm = this.formBuilder.group({
            ageOfBuilding: [
                quoteLocationOccupancy?.ageOfBuilding
                    ? this.optionsAgeOfBuilding.find(el => el.value == quoteLocationOccupancy.ageOfBuilding)
                    // : this.optionsAgeOfBuilding[0], Validators.required],
                    : null, Validators.required],
            constructionType: [
                quoteLocationOccupancy?.constructionType
                    ? this.optionsConstructionType.find(el => el.value == quoteLocationOccupancy.constructionType)
                    // : this.optionsConstructionType[0], Validators.required],
                    : null, Validators.required],
            yearLossHistory: [
                quoteLocationOccupancy?.yearLossHistory
                    ? this.optionsYearLossHistory.find(el => el.value == quoteLocationOccupancy.yearLossHistory)
                    // : this.optionsYearLossHistory[0], Validators.required],
                    : null, Validators.required],
            fireProtection: [
                quoteLocationOccupancy?.fireProtection
                    ? this.optionsFireProtection.find(el => el.value == quoteLocationOccupancy.fireProtection)
                    // : this.optionsFireProtection[0], Validators.required],
                    : null, Validators.required],
            amcFireProtection: [
                quoteLocationOccupancy?.amcFireProtection
                    ? this.optionsAmcProtection.find(el => el.value == `${quoteLocationOccupancy.amcFireProtection}`)
                    // : this.optionsAmcProtection[0], Validators.required],
                    : null, Validators.required],
            distanceBetweenFireBrigade: [
                quoteLocationOccupancy?.distanceBetweenFireBrigade
                    ? this.optionsDistanceBetweenFireBrigade.find(el => el.value == quoteLocationOccupancy.distanceBetweenFireBrigade)
                    // : this.optionsRiskCovered[0], Validators.required],
                    : null, Validators.required],
            premises: [
                quoteLocationOccupancy?.premises
                    ? this.optionsPremises.find(el => el.value == quoteLocationOccupancy.premises)
                    // : this.optionsPremises[0], Validators.required],
                    : null, Validators.required],
        })
    }


    submit($event) {
        const payload = { ...this.riskParametersForm.value };

        payload['ageOfBuilding'] = payload['ageOfBuilding']?.value;
        payload['constructionType'] = payload['constructionType']?.value;
        payload['yearLossHistory'] = payload['yearLossHistory']?.value;
        payload['fireProtection'] = payload['fireProtection']?.value;
        payload['amcFireProtection'] = payload['amcFireProtection']?.value;
        payload['distanceBetweenFireBrigade'] = payload['distanceBetweenFireBrigade']?.value;
        payload['premises'] = payload['premises']?.value;

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

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

}
