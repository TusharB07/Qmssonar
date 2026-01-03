import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteSlip, AllowedQuoteStates, IQuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QuoteSlipDialogComponent } from '../../../components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteCompareConfirmationDialogComponent } from '../../../components/quote/add-on-covers-dialogs/quote-compare-confirmation-dialog/quote-compare-confirmation-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from '../../../components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { ChoosePaymentModeDialogComponent } from '../../../components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { RiskCoverLetterDialogComponent } from '../../../components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';
import { Board } from '../sub-view-kanban/sub-view-kanban.component';
import { ClientCKYCDialogComponent } from '../../../components/quote/client-ckycdialog/client-ckycdialog.component';
import { ChooseVerificationModeDialogComponent } from '../../../components/choose-verification-mode-dialog/choose-verification-mode-dialog.component';


const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 500,
    sortField: "updatedAt",
    sortOrder: -1,
    multiSortMeta: [],
    filters: {}
};

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
    PLACEMENT = "Placement",

    QUOTE_PLACED = "Quote Placed",
    PENDING_PAYMENT = "Pending Payment",

    INSURER_RM_REVIEW = "RM Review",
    INSURER_UNDERWRITTER_REVIEW = "Underwriter Review",
    INSURER_SENT_FOR_QCR = "Sent for QCR",
    // INSURER_PENDING_PAYMENT = "Pending Payment",
      POST_PLACEMENT = 'Post Placement'
}

@Component({
    selector: 'app-sub-view-table',
    templateUrl: './sub-view-table.component.html',
    styleUrls: ['./sub-view-table.component.scss']
})

export class SubViewTableComponent implements OnInit, OnChanges {
    role: IRole;
    loading: boolean;
    totalRecords: number;
    records: IQuoteSlip[];
    selectAll: boolean = false;
    selectedRecords: IQuoteSlip[] = [];
    user: IUser;
    isAllowedCreateQuote: boolean;
    currentUser$: Observable<IUser>;

    @Input() selectedQuoteStages: KanbanStages[]
    // @Input() filterParam: any;

    selectedFilters: any;

    constructor(
        private recordService: QuoteService,
        private routerService: Router,
        private router: Router,
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private accountService: AccountService,
    ) {
        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                this.role = user?.roleId as IRole;
                // console.log(user.roleId)
            }
        })
        this.currentUser$ = this.accountService.currentUser$

    }

    ngOnInit(): void {
        console.log(this.selectedQuoteStages)
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes)

        const queryParam = changes.selectedQuoteStages.currentValue;

        this.selectedQuoteStages = JSON.parse(queryParam.stage);
        this.selectedFilters = queryParam;


        this.loadRecords(this.lazyLoadEvent)
    }

    lazyLoadEvent: LazyLoadEvent = DEFAULT_RECORD_FILTER;

    loadRecords(event: LazyLoadEvent) {
        console.log("loadUsers:");
        console.log(event);

        if ([
            AllowedRoles.BROKER_CREATOR,
            AllowedRoles.BROKER_CREATOR_AND_APPROVER,
            AllowedRoles.AGENT_CREATOR,
            AllowedRoles.AGENT_CREATOR_AND_APPROVER,
            AllowedRoles.SALES_CREATOR,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR,
            AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.role.name)) {
            // @ts-ignore
            event.filters["createdById"] = [
                {
                    value: this.user._id,
                    matchMode: "equals",
                    operator: "and"
                }
            ];
        }
        if ([
            AllowedRoles.BROKER_APPROVER,
            AllowedRoles.BROKER_CREATOR_AND_APPROVER,
            AllowedRoles.SALES_APPROVER,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
            AllowedRoles.PLACEMENT_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.role.name)) {
            // @ts-ignore
            event.filters["createdById"] = [
                {
                    value: JSON.parse(this.selectedFilters['userId']).map(item => ({ value: item })),
                    matchMode: 'in',
                    operator: 'and'
                }
            ]
        } else if ([
            AllowedRoles.INSURER_UNDERWRITER,
        ].includes(this.role.name)) {
            // @ts-ignore
            event.filters["assignedToRMId"] = [
                {
                    value: JSON.parse(this.selectedFilters['userId']).map(item => ({ value: item })),
                    matchMode: 'in',
                    operator: 'and'
                }
            ]

        }

        // @ts-ignore
        event.filters["quoteState"] = [
            {
                value: JSON.parse(this.selectedFilters['stage']).map(item => ({ value: item })),
                matchMode: 'in',
                operator: 'and'
            }
        ]

        // @ts-ignore
        event.filters["clientId"] = [
            {
                value: JSON.parse(this.selectedFilters['clientId']).map(item => ({ value: item })),
                matchMode: 'in',
                operator: 'and'
            }
        ]

        // @ts-ignore
        event.filters["productId"] = [
            {
                value: JSON.parse(this.selectedFilters['productId']).map(item => ({ value: item })),
                matchMode: 'in',
                operator: 'and'
            }
        ]

        const dateRange = JSON.parse(this.selectedFilters['date']).map(item => (item.split('/').reverse().join('-')))
        if (dateRange.length == 2) {
            // @ts-ignore
            event.filters["createdOn"] = [
                {
                    // value: JSON.parse(this.selectedFilters['date']).map(item => ( item.split('/').reverse().join('-') )),
                    value: [
                        `${dateRange[0]}T00:00:00`,
                        `${dateRange[1]}T23:59:59`
                    ],
                    matchMode: 'between',
                    operator: 'and'
                }
            ]
        }
        // @ts-ignore
        /* event.filters["createdAt"] = [
            {
                value: [
                    '2023-05-01',
                    '2023-05-19',
                ],
                matchMode: 'between',
                operator: 'and'
            }
        ] */


        this.loading = true;

        this.lazyLoadEvent = event;
        console.log(event);

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

                if (quote.quoteState == AllowedQuoteStates.SENT_TO_INSURER_RM || quote.quoteState == AllowedQuoteStates.UNDERWRITTER_REVIEW || quote.quoteState == AllowedQuoteStates.WAITING_FOR_APPROVAL || quote.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER) {
                    this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
                }
                else {
                    const ref = this.dialogService.open(QuoteSlipDialogComponent, {
                        header: quote.quoteNo,
                        width: '1200px',
                        styleClass: 'customPopup customPopup-dark',
                        data: {
                            quote: dto.data.entity,
                        }
                    })
                }
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
                console.log(dto.data.entity)
                const quote = dto.data.entity
                const ckycDetails = quote.clientId['apiDetails']

                const ckycRecord = ckycDetails.filter(item => item['partnerId']['_id'] == quote.partnerId['_id'] && item['quoteNo'] == quote.quoteNo)
                console.log(ckycRecord)
                if (ckycRecord.length != 1) {
                    const cKYCDialogComponentref = this.dialogService.open(ClientCKYCDialogComponent, {
                        width: '80%',
                        height: '100%',
                        header: 'Quote No : ' + quote.quoteNo,
                        styleClass: 'customPopup',
                        data: {
                            quote: dto.data.entity,
                        }
                    })
                } else {
                    if (!quote?.otpVerifiedAt && !quote?.offlineVerificationFormUrl) {
                        const verificationModeDialogref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
                            header: 'Client : ' + quote.clientId['name'] + ' - ' + 'Quote No : ' + quote.quoteNo,
                            data: {
                                quote: quote,
                                //   kycFailed : false
                            },
                            width: '45%',
                            // height: '40%',
                            styleClass: "customPopup"
                        })
                    } else {
                        const paymentModeDialogref = this.dialogService.open(ChoosePaymentModeDialogComponent, {
                            // header: 'Choose Payment Method',
                            header: 'Client : ' + quote.clientId['name'] + ' - ' + 'Quote No : ' + quote.quoteNo,
                            data: {
                                quote: quote,
                            },
                            width: '45%',
                            // height: '40%',
                            styleClass: "customPopup "
                        })
                    }
                }

                // const ref = this.dialogService.open(ClientCKYCDialogComponent, {
                //     width: '80%',
                //     height : '80%',
                //     header: 'Quote No : ' + quote.quoteNo,
                //     styleClass:'customPopup',
                //     data: {
                //         quote: dto.data.entity,
                //     }
                // })
            }
        })
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
                //Intergation-EB [Start]
                if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                    this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.quoteService.setQuote(quote);
                            this.quoteService.setQuoteOptions(dto.data.entity);
                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    this.quoteService.setQuote(quote);
                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                }
                // this.quoteService.setQuote(quote)
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                //Intergation-EB [End]
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
            case AllowedQuoteStates.POST_PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                    break;
        }
    }

    openQuoteForOperations(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            // case AllowedQuoteStates.DRAFT:
            //     this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
            //     break;
            // case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
            //     this.openQuoteSlipDialog(quote)
            //     break;
            // case AllowedQuoteStates.WAITING_FOR_APPROVAL:

            //     this.openQuoteSlipDialog(quote)
            //     break;
            // case AllowedQuoteStates.SENT_TO_INSURER_RM:
            //     this.openQuoteSlipDialog(quote)
            //     break;
            // case AllowedQuoteStates.UNDERWRITTER_REVIEW:
            //     this.openQuoteSlipDialog(quote)
            //     break;
            // case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
            //     this.openQuoteSlipDialog(quote)
            //     break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openChoosePaymentMethodDialogComponent(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                // this.openRiskCoverLetterDialog(quote)
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
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
            case AllowedRoles.OPERATIONS:
                this.openQuoteForOperations(quote)
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
                this.openQuoteForBrokerCreatorAndApprover(quote)
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
                this.openQuoteForBrokerApprover(quote)
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

