import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { FireFloaterAddonCoverService } from 'src/app/features/admin/fire-floater-addon-cover/fire-floater-addon-cover.service';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';
import { FireFloaterCoverAddonDialogComponent } from '../fire-floater-cover-addon-dialog/fire-floater-cover-addon-dialog.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
// import {  FireFloaterCoverAddonDialogComponent } from '../fire-floater-cover-addon-dialog/fire-floater-cover-addon-dialog.component';

@Component({
    selector: 'app-fire-floater-cover-addon-card',
    templateUrl: './fire-floater-cover-addon-card.component.html',
    styleUrls: ['./fire-floater-cover-addon-card.component.scss']
})
export class FireFloaterCoverAddonCardComponent implements OnInit {
    id: string;

    quote: IQuoteSlip;
    private currentQuote: Subscription;
    AllowedRoles = AllowedRoles

    checked: boolean;
    // enableBtn: boolean;
    toWord = new ToWords();
    backgroundColor: object = { 'background': 'rgb(236, 236, 236)' };
    totalPremium = 0;
    basePremium = 0;
    sumInsured = 0;

    permissions: PermissionType[] = [];
    AllowedProductTemplate = AllowedProductTemplate


    allowProduct: boolean;
    currentUser$: Observable<IUser>;

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option


    constructor(
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private activatedRoute: ActivatedRoute,
        private fireFloaterAddonCoverService: FireFloaterAddonCoverService,
        private accountService: AccountService,
        private quoteOptionService: QuoteOptionService,
    ) {

        this.currentUser$ = this.accountService.currentUser$

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })
    }

    ngOnInit(): void {
        // Old_Quote
        // if (this.quote?.locationBasedCovers?.fireFloaterCoverAddOnCover?.isChecked) {
        //     this.checked = true;

        // } else {
        //     this.checked = false;

        // }
        // this.basePremium = Number(this.quote?.totalFlexa) + Number(this.quote?.totalStfi) + Number(this.quote?.totalEarthquake) + Number(this.quote?.totalTerrorism)

        // this.sumInsured = this.quote?.totalSumAssured

        // New_Quote_Option
        if (this.quoteOptionData?.locationBasedCovers?.fireFloaterCoverAddOnCover?.isChecked) {
            this.checked = true;

        } else {
            this.checked = false;

        }
        this.basePremium = Number(this.quoteOptionData?.totalFlexa) + Number(this.quoteOptionData?.totalStfi) + Number(this.quoteOptionData?.totalEarthquake) + Number(this.quoteOptionData?.totalTerrorism)

        this.sumInsured = this.quoteOptionData?.totalSumAssured

        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })

    }


    ngOnChanges() {
        this.ngOnInit()
    }


    openFireFloaterCoverAddOnDialog() {
        const ref = this.dialogService.open(FireFloaterCoverAddonDialogComponent, {
            header: "Floater Cover Addon ",
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData,
            },
            // width: '500px',

            styleClass: 'customPopup'
        })
        ref.onClose.subscribe(() => {

        });

    }
    enable() {
        // Old_Quote
        // this.fireFloaterAddonCoverService.toggleAllFloaterCoverAddOn(this.quote._id).subscribe({
        //     next: (dto) => {
        //         this.quoteService.refresh()
        //     }
        // })

        // New_Quote_Option
        this.fireFloaterAddonCoverService.toggleAllFloaterCoverAddOn(this.quoteOptionData._id).subscribe({
            next: (dto) => {
                this.quoteOptionService.refreshQuoteOption()
            }
        })
    }
}
