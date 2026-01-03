import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscAccompaniedBaggage } from 'src/app/features/admin/bsc-accompanied-baggage/bsc-accompanied-baggage.model';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { IBscElectronicEquipmentsCover } from 'src/app/features/admin/bsc-electronic-equipment/bsc-electronic-equipment.model';
import { IBSCFidelityGurantee } from 'src/app/features/admin/bsc-fidelity-gurantee/bsc-fidelity-gurantee.model';
import { IBscFixedPlateGlassCover } from 'src/app/features/admin/bsc-fixed-plate-glass/bsc-fixed-plate-glass.model';
import { IBscLiability } from 'src/app/features/admin/bsc-liability/bsc-liability.model';
import { IBscMoneySafeTillCover } from 'src/app/features/admin/bsc-money-safe-till/bsc-money-safe-till.model';
import { IBscPortableEquipments } from 'src/app/features/admin/bsc-portable-equipments/bsc-portable-equipment.model';
import { IBscSignage } from 'src/app/features/admin/bsc-signage/bsc-signage.model';
import { IFloaterCoverAddOn } from 'src/app/features/admin/floater-cover-addon/floater-cover-addon.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip, QUOTE_STATUS_FROM_DB_TO_NEW_NAME } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IValuableContentsOnAgreedValue } from 'src/app/features/admin/valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.model';


interface QuoteSlipTemplateConfig {
    isProposalForm: boolean
}

@Component({
    selector: 'app-quote-slip-template-one',
    templateUrl: './quote-slip-template-one.component.html',
    styleUrls: ['./quote-slip-template-one.component.scss']
})
export class QuoteSlipTemplateOneComponent implements OnInit, OnChanges {

    AllowedProductTemplate = AllowedProductTemplate
    @Input() selectedQuoteOption: any
    @Input() quote: IQuoteSlip;
    private currentQuote: Subscription;
    @Input() config: QuoteSlipTemplateConfig

    user: IUser;
    isQuoteslipAllowedUser: boolean = false;
    role: any;
    private currentUser: Subscription;
    private currentSelectedOption: Subscription;

    monthoryears;

    // New_Quote_option
    @Input() quoteOption: IQuoteOption;
    selectedOpt: any
    slipName: string = ""
    constructor(
        private accountService: AccountService,
        public messageService: MessageService,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,

    ) {
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user;
                this.role = user.roleId['name'];
                if ([
                    AllowedRoles.BROKER_CREATOR,
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                    AllowedRoles.BROKER_APPROVER,
                    AllowedRoles.AGENT_CREATOR,
                    AllowedRoles.AGENT_CREATOR_AND_APPROVER,
                    AllowedRoles.BANCA_APPROVER,
                    AllowedRoles.BANCA_CREATOR,
                    AllowedRoles.BANCA_CREATOR_AND_APPROVER,
                    AllowedRoles.SALES_CREATOR,
                    AllowedRoles.SALES_APPROVER,
                    AllowedRoles.SALES_CREATOR_AND_APPROVER,
                    AllowedRoles.PLACEMENT_CREATOR,
                    AllowedRoles.PLACEMENT_APPROVER,
                    AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
                ].includes(this.role)) {
                    this.isQuoteslipAllowedUser = true;
                }
                else {
                    this.isQuoteslipAllowedUser = false;
                }

            }
        });

        this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                const temp = template;
                this.selectedOpt = template//._id;

            }
        })
    }

    // new variables for displaying the total
    totalSumInsured = 0;
    totalNetPremium = 0;
    totalGst = 0;
    totalOfTotalPremium = 0;
    addOnsData = [];

    ngOnInit(): void {
        // Old_Quote
        console.log(this.quote)
        //console.log(this.selectedQuoteOption)
        // if (this.quote) {

        //     if (this.quote.hypothications.length > 0) {

        //         this.quote['hypothication'] = this.quote.hypothications.map(item => item.name).join(', ')
        //     } else {
        //         this.quote['hypothication'] = 'N/A'
        //     }

        //     if (this.quote?.productId['renewalPolicyPeriodinMonthsoryears'] == "Y") {
        //         this.monthoryears = String(Number(this.quote?.renewalPolicyPeriod.split(" ")[0]) / 12) + ' Years'
        //     } else {
        //         this.monthoryears = this.quote?.renewalPolicyPeriod
        //     }
        // }

        // console.log(this.selectedQuoteOption)
        // New_Quote_option
        if (this.quoteOption) {

            if (this.quoteOption.hypothications.length > 0) {

                this.quoteOption['hypothication'] = this.quoteOption.hypothications.map(item => item.name).join(', ')
            } else {
                this.quoteOption['hypothication'] = 'N/A'
            }

            if (this.quote?.productId['renewalPolicyPeriodinMonthsoryears'] == "Y") {
                this.monthoryears = String(Number(this.quote?.renewalPolicyPeriod.split(" ")[0]) / 12) + ' Years'
            } else {
                this.monthoryears = this.quote?.renewalPolicyPeriod
            }
        }

        //STAGE WISE SLIP
        this.slipName = QUOTE_STATUS_FROM_DB_TO_NEW_NAME[this.quote?.quoteState] || 'Placement Slip';

        if (this.quote?.productId['productTemplate'] == AllowedProductTemplate.GMC) {
            if (this.quote.originalQuoteId != null && this.quote.assignedToPlacementMakerId != null) {
                this.slipName = "Placement Slip"
            }
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit()
    }

}
