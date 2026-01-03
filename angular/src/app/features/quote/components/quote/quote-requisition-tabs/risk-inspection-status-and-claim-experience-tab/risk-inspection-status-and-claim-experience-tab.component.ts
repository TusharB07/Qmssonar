import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip, OPTIONS_QUOTE_AGE_OF_BUILDING, OPTIONS_QUOTE_AMC_FOR_FIRE_PROTECTION, OPTIONS_QUOTE_CONSTRUCTION_TYPE, OPTIONS_QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE, OPTIONS_QUOTE_FIRE_PROTECTION, OPTIONS_QUOTE_PREMISES_FLOOR, OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskInspectionStatusViewAllLoactionsDialogComponent } from 'src/app/features/broker/risk-inspection-status-view-all-loactions-dialog/risk-inspection-status-view-all-loactions-dialog.component';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { AppService } from 'src/app/app.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-risk-inspection-status-and-claim-experience-tab',
    templateUrl: './risk-inspection-status-and-claim-experience-tab.component.html',
    styleUrls: ['./risk-inspection-status-and-claim-experience-tab.component.scss']
})
export class RiskInspectionStatusAndClaimExperienceTabComponent implements OnInit {

    quote: IQuoteSlip
    selectedQuoteLocationOccpancyId: string;

    toWord = new ToWords

    private currentQuote: Subscription;

    ageOfBuildingOptions: ILov[];
    constructionTypeOptions: ILov[];
    yearLossHistoryOptions: ILov[];
    fireProtectionOptions: ILov[];
    amcProtectionOptions: ILov[];
    premisesBasementOptions: ILov[];
    isMobile: boolean = false;
    user: IUser;
    private currentUser: Subscription;

    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    quoteOptionData: IQuoteOption    // New_Quote_Option
    quoteOptionId: any;

    constructor(
        private quoteService: QuoteService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,
        private accountService:AccountService,
        private claimExperienceService:ClaimExperienceService,
        private appService: AppService,
        private messageService: MessageService,
        private activatedRoute:ActivatedRoute
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
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
              this.user = user;
            }
          });
        this.quoteOptionId = this.activatedRoute.snapshot.queryParamMap.get('quoteOptionId');
  
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    // searchOptionsAgeOfBuilding(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_AGE_OF_BUILDING).subscribe({
    //         next: data => {
    //             this.optionsAgeOfBuilding = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }
    // searchOptionsConstructionType(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_CONSTRUCTION_TYPE).subscribe({
    //         next: data => {
    //             this.optionsConstructionType = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }
    // searchOptionsYearLossHistory(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_THREE_YEAR_LOSS_HISTORY).subscribe({
    //         next: data => {
    //             this.optionsYearLossHistory = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }
    // searchOptionsFireProtection(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_FIRE_PROTECTION).subscribe({
    //         next: data => {
    //             this.optionsFireProtection = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }
    // searchOptionsAmcFireProtection(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_AMC_FOR_FIRE_PROTECTION).subscribe({
    //         next: data => {
    //             this.optionsAmcProtection = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }
    // searchOptionsRiskCovered(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE).subscribe({
    //         next: data => {
    //             this.optionsRiskCovered = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }
    // searchOptionsPremises(event) {
    //     this.listOfValueService.current(AllowedListOfValuesMasters.QUOTE_PREMISES_FLOOR).subscribe({
    //         next: data => {
    //             this.optionsPremises = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
    //             // this.selectedEquipmentType = this.optionsEquipmentType[0];
    //         },
    //         error: e => { }
    //     })
    // }

    downloadSampleFile(){
        this.claimExperienceService.bulkExportGenerateSample(this.quote._id,{quoteOptionId:this.quoteOptionId}).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }
    get quoteLocationBreakupBulkImportProps(): PFileUploadGetterProps {
        // Old_Quote
        // return this.quoteLocationBreakupService.getBulkImportProps(this.quote['_id'], (dto: IOneResponseDto<IBulkImportResponseDto>) => {

        // New_Quote_Option
        return this.claimExperienceService.getBulkImportProps(this.quote._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                this.messageService?.add({
                    summary: "Success",
                    detail: 'File Uploaded Successfully',
                    severity: 'success'
                })
               
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }
}
