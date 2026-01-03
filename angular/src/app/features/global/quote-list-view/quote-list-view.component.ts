import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { AllowedProductTemplate } from '../../admin/product/product.model';
import { AllowedQuoteStates, IQuoteSlip } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';
import { AllowedRoles, IRole } from '../../admin/role/role.model';
import { IUser } from '../../admin/user/user.model';
import { QuoteSlipDialogComponent } from '../../quote/components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteCompareConfirmationDialogComponent } from '../../quote/components/quote/add-on-covers-dialogs/quote-compare-confirmation-dialog/quote-compare-confirmation-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from '../../quote/components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { ChoosePaymentModeDialogComponent } from '../../quote/components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { RiskCoverLetterDialogComponent } from '../../quote/components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';
import { stringify } from 'query-string';
import { AccountService } from '../../account/account.service';
import { Observable } from 'rxjs';
import { Board } from '../../insurer/models/board.model';


export interface Column {
    name: KanbanStages,
    quotes: IQuoteSlip[]
}

export enum KanbanStages {
    BROKER_DRAFT = 'Draft',
    BROKER_REQUISION = 'Requisition',
    BROKER_APPROVAL = 'Waiting of Approval',
    BROKER_SENT_TO_INSURER = 'Sent to Insurer',
    BROKER_QCR_REVIEW = "Quote Comparision Report",
    // BROKER_PLACEMENTSLIP_GENERATED = "Placement Slip Generated",
    BROKER_QUOTE_PLACED = "Quote Placed",

    QUOTE_PLACED = "Quote Placed",
    PENDING_PAYMENT = "Pending Payment",

    INSURER_RM_REVIEW = "RM Review",
    INSURER_UNDERWRITTER_REVIEW = "Underwriter Review",
    INSURER_SENT_FOR_QCR = "Sent for QCR",
    // INSURER_PENDING_PAYMENT = "Pending Payment",
}
@Component({
    selector: 'app-quote-list-view',
    templateUrl: './quote-list-view.component.html',
    styleUrls: ['./quote-list-view.component.scss']
})
export class QuoteListViewComponent implements OnInit {
    role: IRole;
    loading: boolean;
    totalRecords: number;
    records: IQuoteSlip[];
    selectAll: boolean = false;
    selectedRecords: IQuoteSlip[] = [];
    user: IUser;
    isAllowedCreateQuote: boolean;
    currentUser$: Observable<IUser>;
    board: Board =
        {
            name: 'To Do List',
            columns: [
            ]
        }
    constructor(
        private recordService: QuoteService,
        private routerService: Router,
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private accountService: AccountService,
        private router: Router,
    ) {
        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                this.role = user.roleId as IRole;
                console.log(user.roleId)
            }
        })
        this.currentUser$ = this.accountService.currentUser$
    }

    ngOnInit(): void {
    }
    loadRecords(event: LazyLoadEvent) {
        console.log("loadUsers:");
        console.log(event);

        this.loading = true;
        this.recordService.getMany(event).subscribe({
            next: records => {
                console.log(records);

                this.records = records.data.entities;
                this.totalRecords = records.results;
                this.loading = false;
            },
            error: e => {
                console.log(e);
            }
        });
    }


    openRiskCoverLetterDialog(quote: IQuoteSlip) {
        const ref = this.dialogService.open(RiskCoverLetterDialogComponent, {
            header: '',
            width: '800px',
            styleClass: 'flatPopup'
        });

        ref.onClose.subscribe(() => {
        })
    }


    openQuoteSlipDialog(quote: IQuoteSlip) {



        this.quoteService.get(quote._id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                this.quoteService.setQuote(dto.data.entity)

                const ref = this.dialogService.open(QuoteSlipDialogComponent, {
                    header: quote.quoteNo,
                    width: '1200px',
                    styleClass: 'customPopup customPopup-dark',
                    data: {
                        quote: dto.data.entity,
                    }
                })
            }
        })

    }

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.totalRecords;
        this.selectedRecords = value;
    }

    onSelectAllChange(event) {
        const checked = event.checked;

        if (checked) {
            this.selectedRecords = [...this.records];
            this.selectAll = true;
        } else {
            this.selectedRecords = [];
            this.selectAll = false;
        }
    }
    openChoosePaymentMethodDialogComponent(quote: IQuoteSlip) {

        this.quoteService.get(quote._id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                this.quoteService.setQuote(dto.data.entity)
                const ref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
                    width: '400px',
                    header: 'Choose Payment Method',
                    styleClass: 'flatPopup',
                    data: {
                        quote: dto.data.entity,
                    }
                })
            }
        })
    }

    gotoDashboard() {
        this.routerService.navigateByUrl(`/backend`)
    }


    openQuoteForBrokerAdmin(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
             case AllowedQuoteStates.POST_PLACEMENT:
                    this.openRiskCoverLetterDialog(quote)
                    break;
        }
    }

    openQuoteForBrokerCreator(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }

    openQuoteForBrokerCreatorAndApprover(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed`)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openChoosePaymentMethodDialogComponent(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }

    openQuoteForBrokerApprover(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed`)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openChoosePaymentMethodDialogComponent(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }

    openQuoteForInsurerRM(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }
    openQuoteForInsurerUnderwritter(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.quoteService.get(quote._id, {
                    allCovers: true, brokerQuotes: true
                }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        let quote = dto.data.entity;
                        let indexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        let currentUnderwritterLevel = 0;
                        indexes.map((index: number) => {
                            if (quote[`underWriter${index}Stage`] == 'work_in_progress') {
                                currentUnderwritterLevel = index;
                            }
                        })
                        if (currentUnderwritterLevel == this.user['underWriterLevel'] && this.user['_id'] == quote[`underWriter${currentUnderwritterLevel}`]['_id']) {
                            console.log(quote?.productId['productTemplate'])

                            if (quote?.productId['productTemplate'] == AllowedProductTemplate.FIRE) {
                                const ref = this.dialogService.open(QuoteCompareConfirmationDialogComponent, {
                                    header: '',
                                    width: '740px',
                                    styleClass: "flatPopup"
                                });

                                ref.onClose.subscribe((response) => {
                                    if (response?.compare != undefined) {

                                        if (response.compare) {
                                            const ref2 = this.dialogService.open(QuoteSelectBrokerForCompareDialogComponent, {
                                                header: '',
                                                width: '540px',
                                                styleClass: "flatPopup",
                                                data: {
                                                    brokerWiseQuotes: dto.data.entity.brokerWiseQuotes
                                                },
                                            });
                                            ref2.onClose.subscribe((selectedBrokers) => {
                                                if (selectedBrokers) this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/compare-and-analytics?${stringify({ selectedBrokerQuotes: JSON.stringify(selectedBrokers) })}`)
                                            })
                                        } else {
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                        }
                                    }
                                })
                            } else {
                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                            }
                        } else {
                            this.openQuoteSlipDialog(quote)
                        }
                        this.quoteService.setQuote(dto.data.entity);
                    }
                })
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }

    openQuote(quote: IQuoteSlip) {
        switch (this.role.name) {
            case AllowedRoles.BROKER_ADMIN:
                this.openQuoteForBrokerAdmin(quote)
                break;
            case AllowedRoles.BROKER_CREATOR:
                this.openQuoteForBrokerCreator(quote)
                break;
            case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
            case AllowedRoles.BROKER_APPROVER:
                this.openQuoteForBrokerApprover(quote)
                break;
            case AllowedRoles.AGENT_ADMIN:
                this.openQuoteForBrokerCreator(quote)
                break;
            case AllowedRoles.AGENT_CREATOR:
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
            case AllowedRoles.AGENT_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerApprover(quote)
                break;
            case AllowedRoles.INSURER_RM:
                this.openQuoteForInsurerRM(quote)
                break;
            case AllowedRoles.INSURER_UNDERWRITER:
                this.openQuoteForInsurerUnderwritter(quote)
                break;
            case AllowedRoles.BANCA_ADMIN:
                this.openQuoteForBrokerAdmin(quote)
                break;
            case AllowedRoles.BANCA_CREATOR:
                this.openQuoteForBrokerCreator(quote)
                break;
            case AllowedRoles.BANCA_APPROVER:
                this.openQuoteForBrokerApprover(quote)
                break;
            case AllowedRoles.BANCA_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerApprover(quote)
                break;
            case AllowedRoles.SALES_CREATOR:
                this.openQuoteForBrokerCreator(quote)
                break;
            case AllowedRoles.SALES_APPROVER:
                this.openQuoteForBrokerApprover(quote)
                break;
            case AllowedRoles.SALES_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
            case AllowedRoles.PLACEMENT_CREATOR:
                this.openQuoteForBrokerCreator(quote)
                break;
            case AllowedRoles.PLACEMENT_APPROVER:
                this.openQuoteForBrokerApprover(quote)
                break;
            case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
        }
    }
}
