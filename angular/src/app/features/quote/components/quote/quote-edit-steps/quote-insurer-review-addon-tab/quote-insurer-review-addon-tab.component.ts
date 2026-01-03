import { PermissionType } from '../../../../../../app.model';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedAddonCoverCategory, OPTIONS_ADDON_COVER_CATEGORIES } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ConditionalFreeAddOnsDialogComponent } from '../../add-on-covers-dialogs/conditional-free-add-ons-dialog/conditional-free-add-ons-dialog.component';
import { FlexaCoversDialogComponent } from '../../add-on-covers-dialogs/flexa-covers-dialog/flexa-covers-dialog.component';
import { SectorAvgFreeAddOnsDialogComponent } from '../../add-on-covers-dialogs/sector-avg-free-add-ons-dialog/sector-avg-free-add-ons-dialog.component';
import { SectorAvgPaidAddOnsDialogComponent } from '../../add-on-covers-dialogs/sector-avg-paid-add-ons-dialog/sector-avg-paid-add-ons-dialog.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-quote-insurer-review-addon-tab',
    templateUrl: './quote-insurer-review-addon-tab.component.html',
    styleUrls: ['./quote-insurer-review-addon-tab.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuoteInsurerReviewAddonTabComponent implements OnInit {

    selectedAddOn: string[] = [];
    quote: IQuoteSlip;
    selectedQuoteLocationOccpancyId: string;
    optionsQuoteLocationOccupancies: ILov[];
    isBLUS: boolean;
    isGHRP: boolean;
    isFIPR: boolean;
    isMMPP: boolean;
    temp: string = 'Tooltip will come';
    temp1: string = "will have to customize this tooltip ";

    sectorAvgPaidCovers = [];
    //   selectedConditionalFreeCovers: any[] = ['Spontaneous Combustion', 'Spoilage Material Damage'];
    selectedConditionalFreeCovers: any[] = [];
    conditionalFreeCovers: any[] = [];
    //   conditionalFreeCovers: any[] = [
    //     { name: 'Spontaneous Combustion', limit: 'Free upto 5 Crs', sumInsured: 10000, premium: 0 },
    //     { name: 'Spoilage Material Damage', limit: 'Free upto 5 Crs', sumInsured: 20000, premium: 0 },
    //     { name: 'Leakage And Contamination Cover', limit: 'Free upto 5 Crs', sumInsured: 10000, premium: 0 },
    //     { name: 'Molten Material Spillage', limit: 'Free upto 5 Crs', sumInsured: 40000, premium: 0 },
    //     { name: 'Temporary Removal of Stocks Clause', limit: 'Free upto 5 Crs', sumInsured: 50000, premium: 0 },
    //     { name: 'Start-Up/Shut-Down Cost', limit: 'Free upto 5 Crs', sumInsured: 30000, premium: 0 },
    //     { name: 'Loss Of Rent clause', limit: 'Free upto 5 Crs', sumInsured: 60000, premium: 0 }
    // selectedSectorAvgPaidCovers: any[] = ['Floater Clause 2'];
    // sectorAvgCovers: any[] = ['Reinstatement Value Clause (Not Applicable for Stocks)', 'Designation Of Property Clause', 'Local Authorities Clause',
    //     'Declaration Clause', 'Property under care custody and control', 'On account Payment Clause (%age & Period to be specified)',
    //     '72 Hours Clause', 'Contract Price Insurance Clause', 'Non Invalidation Clause', 'Additional interests',
    //     'Automatic Reinstatement Clause', 'Errors & Omissions Clause', 'Multiple Insured Clause', 'No Control Clause',
    //     'Pair & Set', 'Replacement of Keys', 'Lawns, Plants, Shrubs or Trees', 'Growing Plants, Crops And Trees, Landscaping',
    //     'Waiver of Subrogation', 'Primary and Non-Contributory', 'Non-Vitiation Clause', 'Unnamed Locations', 'Nominated Loss Adjusters',
    //     'Loss Payee Clause', 'Unoccupancy Clause'
    selectedSectorAvgPaidCovers: any[] = [];
    sectorAvgCovers: any[] = [];

    flexaCovers: any[] = [];
    currentUser$: Observable<IUser>;
    sectorConditionalPermissions: boolean;

    AllowedProductTemplate = AllowedProductTemplate

    private currentQuote: Subscription;

    optionsAddonCoverCategories: ILov[];

    permissions: PermissionType[] = []

    private currentPropertyQuoteOption: Subscription;                      // New_Quote_option
    quoteOptionData: IQuoteOption                                          // New_Quote_option

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private accountService: AccountService,
        private quoteOptionService: QuoteOptionService,

    ) {
        // this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");

        this.optionsAddonCoverCategories = OPTIONS_ADDON_COVER_CATEGORIES

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote

                // Old_Quote
                // if (quote) {

                // this.isBLUS = false;
                // this.isGHRP = false;
                // this.isFIPR = false;
                // this.isMMPP = false;

                // let product: IProduct = quote.productId as IProduct;

                // switch (product['productTemplate']) {
                //     case AllowedProductTemplate.BLUS:
                //         this.applyFilterOnAddonCovers(quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                //         break;
                //     case AllowedProductTemplate.FIRE:
                //         this.applyFilterOnAddonCovers(quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                //         break;
                //     case AllowedProductTemplate.IAR:

                //         const addonCoverType: AllowedAddonCoverCategory = localStorage.getItem(`${this.quote._id}.${this.quote.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`) as AllowedAddonCoverCategory
                //         this.applyFilterOnAddonCovers(quote, addonCoverType ?? AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                //         break;
                // }
                // }
            }
        });

        this.currentUser$ = this.accountService.currentUser$

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto
                console.log(this.quoteOptionData, "sssssssssssss")
                if (this.quoteOptionData) {
                    this.isBLUS = false;
                    this.isGHRP = false;
                    this.isFIPR = false;
                    this.isMMPP = false;

                    let product: IProduct = this.quote.productId as IProduct;

                    switch (product['productTemplate']) {
                        case AllowedProductTemplate.BLUS:
                            this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                            break;
                        case AllowedProductTemplate.FIRE:
                            this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                            break;
                        case AllowedProductTemplate.IAR:

                            const addonCoverType: AllowedAddonCoverCategory = localStorage.getItem(`${this.quoteOptionData._id}.${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`) as AllowedAddonCoverCategory
                            this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, addonCoverType ?? AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                            break;
                    }
                }
            }
        });
    }

    ngOnInit(): void {
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM) {
                    this.sectorConditionalPermissions = true
                }
                if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })
    }

    // DIALOGS ---------------------------------------
    openFlexaCoversDialog() {
        const ref = this.dialogService.open(FlexaCoversDialogComponent, {
            header: "Flexa Covers",
            width: '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: this.flexaCovers,
                quoteOptionData: this.quoteOptionData,
            }
        })
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    openSectorAvgAddOnsDialog() {
        const ref = this.dialogService.open(SectorAvgFreeAddOnsDialogComponent, {
            header: "Sector Avg. Free Addons",
            width: '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: this.sectorAvgCovers
            }
        })
    }

    openConditionalFreeAddOnsDialog() {
        const ref = this.dialogService.open(ConditionalFreeAddOnsDialogComponent, {
            header: "Sector Conditional Paid Addons",
            width: '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: this.conditionalFreeCovers,
                quoteOptionData: this.quoteOptionData,
                selectedCovers: this.selectedConditionalFreeCovers
            },

        });

        ref.onClose.subscribe((data) => {
            if (data) {
                this.selectedConditionalFreeCovers = data;
            }
            this.quoteService.refresh()
        });
    }

    openSectorAvgPaidAddOnsDialog() {
        let cover = this.sectorAvgPaidCovers.filter(item => !this.selectedSectorAvgPaidCovers.includes(item.addOnCoverId?.name));
        let selectedcover = this.sectorAvgPaidCovers.filter(item => this.selectedSectorAvgPaidCovers.includes(item.addOnCoverId?.name));

        const ref = this.dialogService.open(SectorAvgPaidAddOnsDialogComponent, {
            header: "Sector Avg Paid Addons",
            width: '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: cover,
                selectedCovers: selectedcover
            }
        });

        ref.onClose.subscribe((data) => {
            if (data) {
                this.selectedSectorAvgPaidCovers = data.map(item => item.name);
            }
        });
    }

    selectedAddonCoverType;

    addonCoverTypeChanged($event) {
        // Old_Quote
        // this.applyFilterOnAddonCovers(this.quote, $event.value)

        // New_Quote_option
        this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, $event.value)
    }


    // Old_Quote
    // applyFilterOnAddonCovers(quote: IQuoteSlip, type: AllowedAddonCoverCategory) {

    //     if (quote?._id && quote.locationBasedCovers?.quoteLocationOccupancy?._id) {

    //         this.selectedAddonCoverType = type;

    //         localStorage.setItem(`${quote._id}.${quote.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`, type)

    //         this.flexaCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free')
    //             ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);

    //         this.conditionalFreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid')
    //             ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);

    //         this.selectedConditionalFreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && (item.addOnCoverId.addonTypeFlag == 'Condition Fix Paid' || item.addOnCoverId.addonTypeFlag == 'Condition Perc Paid')).map(item => item.addOnCoverId.name);

    //         this.sectorAvgPaidCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item?.addOnCoverId?.addonTypeFlag == 'Paid')
    //             ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);

    //         this.selectedSectorAvgPaidCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
    //     }

    // }


    // New_Quote_option
    applyFilterOnAddonCoversForQuoteOption(quoteOption: IQuoteOption, type: AllowedAddonCoverCategory) {

        if (quoteOption?._id && quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id) {

            this.selectedAddonCoverType = type;

            localStorage.setItem(`${quoteOption._id}.${quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`, type)

            this.flexaCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free')
                ?.filter(item => item?.addOnCoverId?.sectorId?.name == this.quote?.sectorId['name']);

            this.conditionalFreeCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid')
                ?.filter(item => item?.addOnCoverId?.sectorId?.name == this.quote?.sectorId['name']);

            this.selectedConditionalFreeCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && (item.addOnCoverId.addonTypeFlag == 'Condition Fix Paid' || item.addOnCoverId.addonTypeFlag == 'Condition Perc Paid')).map(item => item.addOnCoverId.name);

            this.sectorAvgPaidCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item?.addOnCoverId?.addonTypeFlag == 'Paid')
                ?.filter(item => item?.addOnCoverId?.sectorId?.name == this.quote?.sectorId['name']);

            this.selectedSectorAvgPaidCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
        }

    }
}
