import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { RiskManagementFeaturesService } from 'src/app/features/admin/risk-management-features/risk-management-features.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { RiskManagementFeaturesDialogComponent } from '../risk-management-features-dialog/risk-management-features-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-risk-management-features-card',
    templateUrl: './risk-management-features-card.component.html',
    styleUrls: ['./risk-management-features-card.component.scss']
})
export class RiskManagementFeaturesCardComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip;

    @Input() permission: PermissionType[] = []

    newRiskManagementFeature: any;
    selectedRiskManagementFeatures: any[] = [];
    riskManagementFeatures: any[] = [];
    showDialogeFlag: boolean = false;
    selectedQuoteLocationOccpancyId: string;
    permissions: PermissionType[] = [];
    currentUser$: Observable<IUser>;
    riskManagementPermissionsForRM: boolean;
    selectedLocationName: string = '';

    isMobile: boolean = false;

    private currentQuote: Subscription;

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option
    riskManagementFeature: any[];
    productType: any;

    constructor(
        private riskManagementFeaturesService: RiskManagementFeaturesService,
        private quoteService: QuoteService,
        private accountService: AccountService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private deviceService: DeviceDetectorService
    ) {
        this.currentUser$ = this.accountService.currentUser$

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                this.productType = this.quote?.productId['type'];
                
            }
        })
    }

    ngOnInit(): void {
        // const productType = this.quote.productId['type'];
        this.isMobile = this.deviceService.isMobile();
        // Old_Quote
        // this.riskManagementFeatures = [...this.quote.locationBasedCovers?.riskManagementFeatures ?? []]
        // this.selectedRiskManagementFeatures = this.quote.locationBasedCovers?.riskManagementFeatures?.filter(rm => rm?.riskManagementFeaturesdict?.checkbox === true).map(item => item?.riskManagementFeaturesdict._id);
        // this.selectedQuoteLocationOccpancyId = this.quote.locationBasedCovers?.quoteLocationOccupancy?._id;
        // let locationNameBreakup = this.quote.locationBasedCovers?.quoteLocationOccupancy?.locationName.split(',');
        // this.selectedLocationName = locationNameBreakup[0] + ' - ' + locationNameBreakup[5];

        // New_Quote_Option

        this.riskManagementFeature = [...this.quoteOptionData.locationBasedCovers?.riskManagementFeatures ?? []]
 

        console.log('productType:', this.productType); // Check the type
        
        // Check the original data before filtering
        console.log('Before filtering:', this.riskManagementFeatures);
        
        this.riskManagementFeatures = this.riskManagementFeature.filter(feature => 
          feature.riskManagementFeaturesdict.productId?.type === this.productType
        );
        
        console.log('After filtering:', this.riskManagementFeatures);
        this.selectedRiskManagementFeatures = this.quoteOptionData.locationBasedCovers?.riskManagementFeatures?.filter(rm => rm?.riskManagementFeaturesdict?.checkbox === true).map(item => item?.riskManagementFeaturesdict._id);
        this.selectedQuoteLocationOccpancyId = this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?._id;
        let locationNameBreakup = this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?.locationName.split(',');
        this.selectedLocationName = locationNameBreakup[0] + ' - ' + locationNameBreakup[5];

        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {
                    this.riskManagementPermissionsForRM = true
                    this.permissions = ['read'];
                } else {
                    this.permissions = ['read', 'update'];
                }
            }
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Old_Quote
        // const quote = changes.quote.currentValue as IQuoteSlip;

        // this.riskManagementFeatures = [...quote?.locationBasedCovers?.riskManagementFeatures ?? []]
        // this.selectedRiskManagementFeatures = quote?.locationBasedCovers?.riskManagementFeatures?.filter(rm => rm?.riskManagementFeaturesdict?.checkbox === true).map(item => item?.riskManagementFeaturesdict._id);
        // this.selectedQuoteLocationOccpancyId = quote.locationBasedCovers?.quoteLocationOccupancy?._id;

        // New_Quote_Option
        const productType = this.quote.productId['type'];
        const quoteOption = changes.quoteOptionData.currentValue as IQuoteOption;
console.log(this.riskManagementFeature);

       this.riskManagementFeatures = this.riskManagementFeature.filter(feature => 
            feature.riskManagementFeaturesdict.productId?.['type'] === this.productType
          );
        this.selectedRiskManagementFeatures = quoteOption?.locationBasedCovers?.riskManagementFeatures?.filter(rm => rm?.riskManagementFeaturesdict?.checkbox === true).map(item => item?.riskManagementFeaturesdict._id);
        this.selectedQuoteLocationOccpancyId = quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id;

    }

    saveRiskManagementFeature() {
        let temp = {
            riskManagementFeatures: [],
            quoteLocationOccupancyId: ''
        }

        temp.quoteLocationOccupancyId = this.selectedQuoteLocationOccpancyId;
        temp.riskManagementFeatures = [...this.selectedRiskManagementFeatures];

        if (temp.riskManagementFeatures.length == 0) {
            this.messageService.add({
                severity: "error",
                summary: "Please select data",
                life: 2000
            })
        } else {
            // Old_Quote
            // this.riskManagementFeaturesService.saveQuoteRMFeatures(temp).subscribe(response => {

            // New_Quote_Option
            this.riskManagementFeaturesService.saveQuoteOptionRMFeatures(temp).subscribe(response => {
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail:'Saved!',
                    life: 2000
                })
            }, error => {
                console.log(error);
            })
        }
    }

    showDialog() {
        // this.showDialogeFlag = true;
        // Old_Quote
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')

        // New_Quote_Option
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')
        const ref = this.dialogService.open(RiskManagementFeaturesDialogComponent, {
            header: "Risk Management Features: " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            data: {
                quote_id: this.quote,
                selectedRiskManagementFeatures: this.selectedRiskManagementFeatures,
                riskManagementFeatures: this.riskManagementFeatures,
                quoteOption: this.quoteOptionData,                                           // New_Quote_Option

            },
            width: this.isMobile ? '98vw' : "50%",
            styleClass: "customPopup"
        });

        ref.onClose.subscribe(SRMF => {
            this.selectedRiskManagementFeatures = SRMF;
        })
    }

}
