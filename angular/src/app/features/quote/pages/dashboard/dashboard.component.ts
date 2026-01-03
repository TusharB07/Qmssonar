import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { stringify } from 'query-string';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from '../../../account/account.service';
import { IPartner } from '../../../admin/partner/partner.model';
import { AllowedProductTemplate } from '../../../admin/product/product.model';
import { AllowedQuoteStates, IQuoteSlip } from '../../../admin/quote/quote.model';
import { QuoteService } from '../../../admin/quote/quote.service';
import { AllowedRoles, IRole } from '../../../admin/role/role.model';
import { IUser } from '../../../admin/user/user.model';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteCompareConfirmationDialogComponent } from '../../components/quote/add-on-covers-dialogs/quote-compare-confirmation-dialog/quote-compare-confirmation-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from '../../components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { ChoosePaymentModeDialogComponent } from '../../components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { RiskCoverLetterDialogComponent } from '../../components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';
import {AllowedPartnerTypes} from '../../../admin/partner/partner.model'


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    user: IUser

    partner: IPartner

    AllowedPartnerTypes = AllowedPartnerTypes

    constructor(
        private quoteService: QuoteService,
        private router: Router,
        private accountService: AccountService,
        private dialogService: DialogService,

    ) {

        this.accountService.currentUser$.subscribe((user: IUser) => {
            this.user = user;

            this.partner = user?.partnerId as IPartner
        })
    }

    ngOnInit(): void {

        // this.dialogService.open(AddOnsDialogComponent, {

        // })
    }
}
