import { filter } from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedQuoteStates, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { PaymentCompletedSuccessfullyDialogComponent } from 'src/app/features/quote/components/payment-completed-successfully-dialog/payment-completed-successfully-dialog.component';
import { QuoteSlipDialogComponent } from 'src/app/features/quote/components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteCompareConfirmationDialogComponent } from 'src/app/features/quote/components/quote/add-on-covers-dialogs/quote-compare-confirmation-dialog/quote-compare-confirmation-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from 'src/app/features/quote/components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { ProceedWithOfflinePaymentDialogComponent } from 'src/app/features/quote/components/quote/proceed-with-offline-payment-dialog/proceed-with-offline-payment-dialog.component';
import { RiskCoverLetterDialogComponent } from 'src/app/features/quote/components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';
// import { Board } from 'src/app/features/insurer/models/board.model';
import { stringify } from 'query-string';
import { ChoosePaymentModeDialogComponent } from '../../../components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { PaymentDetailsPopupComponent } from '../../../components/quote/payment-details-popup/payment-details-popup.component';
import { QuoteDiscussionPageComponent } from '../../quote-discussion-page/quote-discussion-page.component';
import { QmsService } from '../../quote-discussion-page/qms.service';
import { CreateClientComponent } from 'src/app/features/global/create-client/create-client.component';
import { ClientCKYCDialogComponent } from '../../../components/quote/client-ckycdialog/client-ckycdialog.component';
import { ChooseVerificationModeDialogComponent } from '../../../components/choose-verification-mode-dialog/choose-verification-mode-dialog.component';
import { ApiTemplateService } from 'src/app/features/admin/api-template/api-template.service';
import { LoadingService } from 'src/app/features/service/loading.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { IPartner } from "../../../../admin/partner/partner.model";
import items from "razorpay/dist/types/items";
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { QuoteLossDialogComponent } from '../../../components/quote-loss-dialog/quote-loss-dialog.component';
import { environment } from 'src/environments/environment';
import { PlacementDialogComponent } from '../../../components/placementmaker&checker-dialog/placementmaker-dialog/placement-dialog.component';
import { PlacementcheckerDialogComponent } from '../../../components/placementmaker&checker-dialog/placementchecker-dialog/placementchecker-dialog.component';
import { ReasonForQuoteLossComponent } from '../../../components/reason-for-quote-loss/reason-for-quote-loss.component';



const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 2000,
    sortField: "updatedAt",
    sortOrder: -1,
    multiSortMeta: [],
    filters: {}
};


export interface Board {
    name: string;
    columns: Column[]
}

export interface Column {
    name: KanbanStages,
    quotes: IQuoteSlip[]
}

export enum KanbanStages {
    BROKER_DRAFT = 'Draft RFP',
    BROKER_REQUISION = 'Requistion',
    BROKER_APPROVAL = 'Request for Quotation (RFQ)',
    BROKER_SENT_TO_INSURER = 'Insurance Company Response',
    BROKER_QCR_REVIEW = "Quote Comparision Report",
    // BROKER_PLACEMENTSLIP_GENERATED = "Placement Slip Generated",
    BROKER_QUOTE_PLACED = "Placement",
    POST_PLACEMENT = 'Post Placement',

    PLACEMENT = "Placement",
    PENDING_PAYMENT = "Pending Payment",
    PENDING_PAYMENT_ONLINE = "Pending Payment Online",
    PENDING_PAYMENT_OFFLINE = "Pending Payment Offline",
    // REJECTED = "Rejected",
    // CANCELLED = "Cancelled Quote",

    INSURER_RM_REVIEW = "RM Review",
    INSURER_UNDERWRITTER_REVIEW = "Underwriter Review",
    INSURER_SENT_FOR_QCR = "Sent for QCR",
    // INSURER_PENDING_PAYMENT = "Pending Payment",
    LOSS_QUOTE = "Loss Quote",
    BROKER_RFP = 'Request for Proposal (RFP)',
}


@Component({
    selector: 'app-sub-view-kanban',
    templateUrl: './sub-view-kanban.component.html',
    styleUrls: ['./sub-view-kanban.component.scss'],
    providers: [DialogService, MessageService, ConfirmationService]
})



export class SubViewKanbanComponent implements OnInit, OnChanges {
    id: string;
    role: IRole;
    user: IUser;
    faThumbtack = faThumbtack;
    quote: IQuoteSlip
    displayConfirmation: boolean = false;
    isAllowedCreateQuote: boolean
    // optionsInsurer: IMappedRmEmailICName[];
    showBrokerName: boolean = false;
    currentUser$: Observable<IUser>;
    allowedCopyQuote: boolean;
    allowedCopyRevisedQuote: boolean;

    @Input() selectedQuoteStages: KanbanStages[]
    // @Input() filterParam: any;
    @Input() underwriterMappingFlag: IPartner;
    selectedFilters: any;
    isMobile: boolean = false;

    AllowedQuoteStates = AllowedQuoteStates;
    AllowedRoles = AllowedRoles

    queries: any;
    quoteNumber: string = '';
    quotes: IQuoteSlip[] = []
    allInsurerList: { id: string, version: string, partnerName: string, createdAt: Date }[] = [];
    selectedInsurer: string = '';
    showModal: boolean = false;
    board: Board =
        {
            name: 'To Do List',
            columns: []
        }

    quoteOptionsLst: any[];

    private currentQuote: Subscription;
    isLokton: boolean;
    constructor(
        private dialogService: DialogService,
        public messageService: MessageService,
        private quoteService: QuoteService,
        private confirmationService: ConfirmationService,
        private routerService: Router,
        private accountService: AccountService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private qmsService: QmsService,
        private apiTemplateService: ApiTemplateService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,      // New_Quote_Option
    ) {
        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                this.role = user?.roleId as IRole;

                if ([
                    // AllowedRoles.BROKER_ADMIN,
                    // AllowedRoles.BROKER_APPROVER,
                    AllowedRoles.BROKER_CREATOR,
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                    AllowedRoles.AGENT_CREATOR,
                    AllowedRoles.AGENT_CREATOR_AND_APPROVER,
                    AllowedRoles.SALES_CREATOR,
                    AllowedRoles.SALES_CREATOR_AND_APPROVER,
                    // AllowedRoles.PLACEMENT_CREATOR,
                    // AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
                ].includes(this.role.name)) {
                    this.isAllowedCreateQuote = true
                }
            }
        })

        this.currentUser$ = this.accountService.currentUser$;
        this.isLokton = environment.isLokton;
    }

    prepareStages(selectedQuoteStages) {
        if ([
            AllowedRoles.BROKER_ADMIN,
            AllowedRoles.AGENT_ADMIN,
            AllowedRoles.AGENT_CREATOR,
            AllowedRoles.AGENT_CREATOR_AND_APPROVER,
            AllowedRoles.BROKER_APPROVER,
            AllowedRoles.BROKER_CREATOR,
            AllowedRoles.BROKER_CREATOR_AND_APPROVER,
            AllowedRoles.BANCA_CREATOR,
            AllowedRoles.BANCA_APPROVER,
            AllowedRoles.BANCA_CREATOR_AND_APPROVER,
            AllowedRoles.SALES_CREATOR,
            AllowedRoles.SALES_APPROVER,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
            // AllowedRoles.PLACEMENT_CREATOR,
            // AllowedRoles.PLACEMENT_APPROVER,
            // AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.role.name)) {

            let columns = []

            // if (selectedQuoteStages.includes(AllowedQuoteStates.DRAFT)) columns.push({
            //     name: KanbanStages.BROKER_DRAFT,
            //     quotes: []
            // })

            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,AllowedQuoteStates.WAITING_FOR_APPROVAL)) columns.push({
            //     name: KanbanStages.BROKER_REQUISION,
            //     quotes: []
            // })
            console.log(selectedQuoteStages.includes(AllowedQuoteStates.DRAFT) || selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE));
            if (selectedQuoteStages.includes(AllowedQuoteStates.DRAFT) || selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE)) {
                columns.push({
                    name: KanbanStages.BROKER_RFP,
                    quotes: []
                });
            }
            if (selectedQuoteStages.includes(AllowedQuoteStates.WAITING_FOR_APPROVAL)) columns.push({
                name: KanbanStages.BROKER_APPROVAL,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.SENT_TO_INSURER_RM)) columns.push({
                name: KanbanStages.BROKER_SENT_TO_INSURER,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.QCR_FROM_UNDERWRITTER)) columns.push({
                name: KanbanStages.BROKER_QCR_REVIEW,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_PAYMENT)) columns.push({
            //     name: KanbanStages.PENDING_PAYMENT,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.PLACEMENT)) columns.push({
                name: KanbanStages.PLACEMENT,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.CANCELLED)) columns.push({
            //     name: KanbanStages.CANCELLED,
            //     quotes: []
            // })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.REJECTED)) columns.push({
            //     name: KanbanStages.REJECTED,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.POST_PLACEMENT)) columns.push({
                name: KanbanStages.POST_PLACEMENT,
                quotes: []
            })
            this.board = {
                name: 'To do List',
                columns: columns
            }
        }

        if ([
            AllowedRoles.INSURER_ADMIN,
            AllowedRoles.INSURER_RM,
            AllowedRoles.INSURER_UNDERWRITER,
        ].includes(this.role.name)) {

            let columns = []

            if (selectedQuoteStages.includes(AllowedQuoteStates.SENT_TO_INSURER_RM)) columns.push({
                name: KanbanStages.INSURER_RM_REVIEW,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.UNDERWRITTER_REVIEW)) columns.push({
                name: KanbanStages.INSURER_UNDERWRITTER_REVIEW,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.QCR_FROM_UNDERWRITTER)) columns.push({
                name: KanbanStages.INSURER_SENT_FOR_QCR,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_PAYMENT)) columns.push({
            //     name: KanbanStages.PENDING_PAYMENT,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.PLACEMENT)) columns.push({
                name: KanbanStages.PLACEMENT,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.REJECTED)) columns.push({
            //     name: KanbanStages.REJECTED,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.POST_PLACEMENT)) columns.push({
                name: KanbanStages.POST_PLACEMENT,
                quotes: []
            })
            this.board = {
                name: 'To do List',
                columns: columns
            }
        }
        if ([
            AllowedRoles.OPERATIONS,
        ].includes(this.role.name)) {

            let columns = []

            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_PAYMENT)) columns.push({
            //     name: KanbanStages.PENDING_PAYMENT,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.PLACEMENT)) columns.push({
                name: KanbanStages.PLACEMENT,
                quotes: []
            })

            this.board = {
                name: 'To do List',
                columns: columns
            }
        }

        if ([
            AllowedRoles.PLACEMENT_CREATOR,
            AllowedRoles.PLACEMENT_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER
        ].includes(this.role.name)) {

            let columns = []

            // if (selectedQuoteStages.includes(AllowedQuoteStates.DRAFT)) columns.push({
            //     name: KanbanStages.BROKER_DRAFT,
            //     quotes: []
            // })

            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE)) columns.push({
            //     name: KanbanStages.BROKER_REQUISION,
            //     quotes: []
            // })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.DRAFT) || selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE)) {
            //     columns.push({
            //         name: KanbanStages.BROKER_RFP,
            //         quotes: []
            //     });
            // }
            if (selectedQuoteStages.includes(AllowedQuoteStates.WAITING_FOR_APPROVAL)) columns.push({
                name: KanbanStages.BROKER_APPROVAL,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.SENT_TO_INSURER_RM)) columns.push({
                name: KanbanStages.BROKER_SENT_TO_INSURER,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.QCR_FROM_UNDERWRITTER)) columns.push({
                name: KanbanStages.BROKER_QCR_REVIEW,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_PAYMENT)) columns.push({
            //     name: KanbanStages.PENDING_PAYMENT,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.PLACEMENT)) columns.push({
                name: KanbanStages.PLACEMENT,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.CANCELLED)) columns.push({
            //     name: KanbanStages.CANCELLED,
            //     quotes: []
            // })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.REJECTED)) columns.push({
            //     name: KanbanStages.REJECTED,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.POST_PLACEMENT)) columns.push({
                name: KanbanStages.POST_PLACEMENT,
                quotes: []
            })

            this.board = {
                name: 'To do List',
                columns: columns
            }
        }

        if ([
            AllowedRoles.PLACEMENT_APPROVER
        ].includes(this.role.name)) {

            let columns = []

            if (selectedQuoteStages.includes(AllowedQuoteStates.QCR_FROM_UNDERWRITTER)) columns.push({
                name: KanbanStages.BROKER_QCR_REVIEW,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.PLACEMENT)) columns.push({
                name: KanbanStages.PLACEMENT,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.POST_PLACEMENT)) columns.push({
                name: KanbanStages.POST_PLACEMENT,
                quotes: []
            })
            this.board = {
                name: 'To do List',
                columns: columns
            }
        }
        if ([
            AllowedRoles.SALES_CREATOR,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
        ].includes(this.role.name)) {

            let columns = []

            // if (selectedQuoteStages.includes(AllowedQuoteStates.DRAFT)) columns.push({
            //     name: KanbanStages.BROKER_DRAFT,
            //     quotes: []
            // })

            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE)) columns.push({
            //     name: KanbanStages.BROKER_REQUISION,
            //     quotes: []
            // })

            if (selectedQuoteStages.includes(AllowedQuoteStates.DRAFT) || selectedQuoteStages.includes(AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE)) {
                columns.push({
                    name: KanbanStages.BROKER_RFP,
                    quotes: []
                });
            }
            if (selectedQuoteStages.includes(AllowedQuoteStates.WAITING_FOR_APPROVAL)) columns.push({
                name: KanbanStages.BROKER_APPROVAL,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.SENT_TO_INSURER_RM)) columns.push({
                name: KanbanStages.BROKER_SENT_TO_INSURER,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.QCR_FROM_UNDERWRITTER)) columns.push({
                name: KanbanStages.BROKER_QCR_REVIEW,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.PENDING_PAYMENT)) columns.push({
            //     name: KanbanStages.PENDING_PAYMENT,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.PLACEMENT)) columns.push({
                name: KanbanStages.PLACEMENT,
                quotes: []
            })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.CANCELLED)) columns.push({
            //     name: KanbanStages.CANCELLED,
            //     quotes: []
            // })
            // if (selectedQuoteStages.includes(AllowedQuoteStates.REJECTED)) columns.push({
            //     name: KanbanStages.REJECTED,
            //     quotes: []
            // })
            if (selectedQuoteStages.includes(AllowedQuoteStates.POST_PLACEMENT)) columns.push({
                name: KanbanStages.POST_PLACEMENT,
                quotes: []
            })
            if (selectedQuoteStages.includes(AllowedQuoteStates.LOSS_QUOTE)) columns.push({
                name: KanbanStages.LOSS_QUOTE,
                quotes: []
            })

            this.board = {
                name: 'To do List',
                columns: columns
            }

            this.board = {
                name: 'To do List',
                columns: columns
            }
        }








    }

    ngOnInit(): void {
        // this.loadRecords();
        this.isMobile = this.deviceService.isMobile();
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name !== AllowedRoles.BROKER_APPROVER &&
                    role?.name !== AllowedRoles.BROKER_ADMIN &&
                    role?.name !== AllowedRoles.BROKER_CREATOR &&
                    role?.name !== AllowedRoles.BROKER_CREATOR_AND_APPROVER &&
                    role?.name !== AllowedRoles.SALES_CREATOR &&
                    role?.name !== AllowedRoles.SALES_APPROVER &&
                    role?.name !== AllowedRoles.SALES_CREATOR_AND_APPROVER &&
                    role?.name !== AllowedRoles.PLACEMENT_CREATOR &&
                    role?.name !== AllowedRoles.PLACEMENT_APPROVER &&
                    role?.name !== AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER) {
                    this.showBrokerName = true;

                } else {
                    this.showBrokerName = false;
                }
            }
        })
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (
                    role?.name !== AllowedRoles.BROKER_ADMIN &&
                    role?.name !== AllowedRoles.BROKER_CREATOR &&
                    role?.name !== AllowedRoles.BROKER_APPROVER &&
                    role?.name !== AllowedRoles.BROKER_CREATOR_AND_APPROVER &&
                    role?.name !== AllowedRoles.AGENT_ADMIN &&
                    role?.name !== AllowedRoles.AGENT_CREATOR &&
                    role?.name !== AllowedRoles.AGENT_CREATOR_AND_APPROVER &&
                    role?.name !== AllowedRoles.BANCA_CREATOR &&
                    role?.name !== AllowedRoles.BANCA_APPROVER &&
                    role?.name !== AllowedRoles.BANCA_CREATOR_AND_APPROVER &&
                    role?.name !== AllowedRoles.SALES_CREATOR &&
                    role?.name !== AllowedRoles.SALES_APPROVER &&
                    role?.name !== AllowedRoles.SALES_CREATOR_AND_APPROVER &&
                    role?.name !== AllowedRoles.PLACEMENT_CREATOR &&
                    role?.name !== AllowedRoles.PLACEMENT_APPROVER &&
                    role?.name !== AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER
                ) {
                    this.allowedCopyQuote = false;

                } else {
                    this.allowedCopyQuote = true;
                }
            }
        })

        // if (([
        //     AllowedProductTemplate.FIRE,
        //     AllowedProductTemplate.BLUS,
        //     AllowedProductTemplate.IAR
        // ]).includes(this.quote?.productId['productTemplate'])) {
        // this.activatedRoute.queryParams.subscribe((params) => {
        //     if (params?.reload && params.reload == 'reload') {
        //         setTimeout(() => {
        //             location.reload();
        //         }, 0)
        //     }
        // });

        // let redirect = this.activatedRoute.snapshot.queryParamMap.get('redirect');
        // if (redirect) {
        //     this.router.navigate([`/backend/quotes/${redirect}/edit`], {
        //         queryParams: { quoteOptionId: this.activatedRoute.snapshot.queryParamMap.get('quoteOptionId') }
        //     });
        // }
        // }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const queryParam = changes.selectedQuoteStages.currentValue;
        if (queryParam) {
            this.selectedQuoteStages = JSON.parse(queryParam.stage);

            this.selectedFilters = queryParam;
        }

        this.loadRecords()
    }
    getOptions(id) {
        this.quoteService.getAllQuoteOptions(id).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                this.loadOptionsData(dto.data.entity);
                this.loadSelectedOption(dto.data.entity[0])
            },
            error: e => {
                console.log(e);
            }
        });
    }

    loadOptionsData(quoteOption: any[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }

    loadSelectedOption(quoteOption: any) {
        this.quoteService.setSelectedOptions(quoteOption)
    }
    loadRecords() {
        let event: LazyLoadEvent = DEFAULT_RECORD_FILTER;

        if ([
            AllowedRoles.BROKER_CREATOR,
            AllowedRoles.BROKER_APPROVER,
            AllowedRoles.BROKER_CREATOR_AND_APPROVER,
            AllowedRoles.SALES_APPROVER,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
            AllowedRoles.PLACEMENT_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR
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
                    operator: 'or'
                }
            ]
            // @ts-ignore
            event.filters["updatedAt"] = [
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

            // Add sorting logic
            event.sortField = 'updatedAt'; // Field to sort by
            event.sortOrder = -1; // -1 for descending, 1 for ascending
        }

        this.quoteService.getMany(event).subscribe({
            next: records => {
                // console.log(records);
                if (this.user.partnerId['brokerModeStatus']) {
                    if (this.user.partnerId['isBrokerMappedFromMaster']) {
                        if (this.user.roleId['name'] == AllowedRoles.PLACEMENT_CREATOR || this.user.roleId['name'] == AllowedRoles.PLACEMENT_APPROVER) {
                            console.log("if called")
                            const matchQuotes = records.data.entities.filter((res: any) => {
                                // if(this.user._id == (res.assignedToPlacementMakerId && res.assignedToPlacementCheckerId)){
                                if (res.pushedBackToId) {
                                    if ([res.assignedToPlacementCheckerId, res.assignedToPlacementMakerId, res.pushedBackToId].includes(this.user._id)) {
                                        return res;
                                    }
                                } else if (!res.pushedBackToId) {
                                    if ([res.assignedToPlacementMakerId, res.pushedBackToId].includes(this.user._id)) {
                                        return res;
                                    }
                                }
                            })
                            this.qmsService.notificationcount().subscribe({
                                next: (response) => {
                                    // @ts-ignore
                                    this.queries = response.data.entity

                                    this.queries = this.queries.filter(query => query.state == 'Open')

                                    records.data.entities.map((quote) => {
                                        quote['chatCount'] = 0

                                        this.queries.map(chat => {

                                            if (chat?.quoteId[0]?._id == quote?._id || chat?.quoteId[0]?._id == quote?.originalQuoteId) {
                                                quote['chatCount'] += 1
                                            }
                                        })
                                    })

                                    this.quoteService.setQuote(null)
                                    this.quoteService.setQuoteLocationOccupancyId(null)
                                    this.quoteService.setQuoteOptions(null)
                                    this.quoteOptionService.setQuoteOptionForProperty(null)
                                    this.quotes = records.data.entities;
                                    this.board.columns = []
                                    this.prepareStages(this.selectedQuoteStages);
                                    this.mapQuotes(matchQuotes)
                                    this.quoteNumber = '';
                                }
                            })
                        } else if (this.user.roleId['name'] == AllowedRoles.SALES_CREATOR_AND_APPROVER) {
                            this.qmsService.notificationcount().subscribe({
                                next: (response) => {
                                    // @ts-ignore
                                    this.queries = response.data.entity

                                    this.queries = this.queries.filter(query => query.state == 'Open')

                                    records.data.entities.map((quote) => {
                                        quote['chatCount'] = 0

                                        this.queries.map(chat => {
                                            if (chat?.quoteId[0]?._id == quote?._id || chat?.quoteId[0]?._id == quote?.originalQuoteId) {
                                                quote['chatCount'] += 1
                                            }
                                        })
                                    })

                                    this.quoteService.setQuote(null)
                                    this.quoteService.setQuoteLocationOccupancyId(null)
                                    this.quoteService.setQuoteOptions(null)
                                    this.quoteOptionService.setQuoteOptionForProperty(null)
                                    this.quotes = records.data.entities;
                                    this.board.columns = []
                                    this.prepareStages(this.selectedQuoteStages);
                                    this.mapQuotes(records.data.entities)
                                    this.quoteNumber = '';
                                }
                            })
                        }
                    }
                    else if (!this.user.partnerId['isBrokerMappedFromMaster']) {
                        if (this.user.roleId['name'] == AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER) {
                            console.log("else if called");
                            //@ts-ignore
                            const filterMappedQuote = records.data.entities.filter((ele) => ele?.salesApprovedById?.["mappedPlacementUsers"].includes(this.user._id));
                            this.qmsService.notificationcount().subscribe({
                                next: (response) => {
                                    // @ts-ignore
                                    this.queries = response.data.entity

                                    this.queries = this.queries.filter(query => query.state == 'Open')

                                    records.data.entities.map((quote) => {
                                        quote['chatCount'] = 0

                                        this.queries.map(chat => {
                                            if (chat?.quoteId[0]?._id == quote?._id || chat?.quoteId[0]?._id == quote?.originalQuoteId) {
                                                quote['chatCount'] += 1
                                            }
                                        })
                                    })

                                    this.quoteService.setQuote(null)
                                    this.quoteService.setQuoteLocationOccupancyId(null)
                                    this.quoteService.setQuoteOptions(null)
                                    this.quoteOptionService.setQuoteOptionForProperty(null)                      // New_Quote_Option
                                    this.quotes = records.data.entities;
                                    this.board.columns = []
                                    this.prepareStages(this.selectedQuoteStages);
                                    this.mapQuotes(filterMappedQuote)
                                    this.quoteNumber = '';
                                }
                            })
                        }
                        else if (this.user.roleId['name'] == AllowedRoles.SALES_CREATOR_AND_APPROVER) {
                            this.qmsService.notificationcount().subscribe({
                                next: (response) => {
                                    // @ts-ignore
                                    this.queries = response.data.entity

                                    this.queries = this.queries.filter(query => query.state == 'Open')

                                    records.data.entities.map((quote) => {
                                        quote['chatCount'] = 0

                                        this.queries.map(chat => {
                                            if (chat?.quoteId[0]?._id == quote?._id || chat?.quoteId[0]?._id == quote?.originalQuoteId) {
                                                quote['chatCount'] += 1
                                            }
                                        })
                                    })

                                    this.quoteService.setQuote(null)
                                    this.quoteService.setQuoteLocationOccupancyId(null)
                                    this.quoteService.setQuoteOptions(null)
                                    this.quoteOptionService.setQuoteOptionForProperty(null)
                                    this.quotes = records.data.entities;
                                    this.board.columns = []
                                    this.prepareStages(this.selectedQuoteStages);
                                    this.mapQuotes(records.data.entities)
                                    this.quoteNumber = '';
                                }
                            })
                        }
                    }
                }
                else {
                    console.log("else called")
                    this.qmsService.notificationcount().subscribe({
                        next: (response) => {
                            // @ts-ignore
                            this.queries = response.data.entity

                            this.queries = this.queries.filter(query => query.state == 'Open')

                            records.data.entities.map((quote) => {
                                quote['chatCount'] = 0

                                this.queries.map(chat => {
                                    if (chat?.quoteId[0]?._id == quote?._id || chat?.quoteId[0]?._id == quote?.originalQuoteId) {
                                        quote['chatCount'] += 1
                                    }
                                })
                            })

                            this.quoteService.setQuote(null)
                            this.quoteService.setQuoteLocationOccupancyId(null)
                            this.quoteService.setQuoteOptions(null)
                            this.quoteOptionService.setQuoteOptionForProperty(null)                      // New_Quote_Option
                            this.quotes = records.data.entities;
                            this.board.columns = []
                            this.prepareStages(this.selectedQuoteStages);
                            this.mapQuotes(records.data.entities)
                            this.quoteNumber = '';
                        }
                    })
                }
            },
            error: e => {
                console.log(e);

            }
        });
    }

    mapQuotes(quotes: IQuoteSlip[]) {
        // const a = quotes.filter((item, index) => item.tenantId.indexOf(item.tenantId) !== index && item.partnerId.indexOf(item.partnerId) !== index)
        quotes.map((quote: IQuoteSlip) => {
            // if (!quote?.parentQuoteId) {
            switch (quote.quoteState) {
                // case AllowedQuoteStates.DRAFT:
                //     this.board.columns.find(el => el.name == KanbanStages.BROKER_DRAFT)?.quotes?.push(quote)
                //     break;
                // case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                //     this.board.columns.find(el => el.name == KanbanStages.BROKER_REQUISION)?.quotes?.push(quote)
                //     break;
                case AllowedQuoteStates.DRAFT:
                    this.board.columns.find(el => el.name == KanbanStages.BROKER_RFP)?.quotes?.push(quote);
                    break;
                case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                    // Merge the DRAFT and PENDING_REQUISTION_FOR_QUOTE stages into BROKER_RFP
                    this.board.columns.find(el => el.name == KanbanStages.BROKER_RFP)?.quotes?.push(quote);
                    break;
                case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                    this.board.columns.find(el => el.name == KanbanStages.BROKER_APPROVAL)?.quotes?.push(quote)
                    break;
                case AllowedQuoteStates.SENT_TO_INSURER_RM:
                    this.board.columns.find(el => el.name == KanbanStages.BROKER_SENT_TO_INSURER)?.quotes?.push(quote)
                    this.board.columns.find(el => el.name == KanbanStages.INSURER_RM_REVIEW)?.quotes?.push(quote)
                    break;
                case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                    this.board.columns.find(el => el.name == KanbanStages.BROKER_SENT_TO_INSURER)?.quotes?.push(quote)
                    this.board.columns.find(el => el.name == KanbanStages.INSURER_UNDERWRITTER_REVIEW)?.quotes?.push(quote)
                    break;
                case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                    this.board.columns.find(el => el.name == KanbanStages.INSURER_SENT_FOR_QCR)?.quotes?.push(quote)
                    this.board.columns.find(el => el.name == KanbanStages.BROKER_QCR_REVIEW)?.quotes?.push(quote)
                    break;
                case AllowedQuoteStates.PENDING_PAYMENT:
                    // alert(quote._id)
                    if ([
                        AllowedRoles.OPERATIONS
                    ].includes(this.role.name)) {
                        switch (quote.paymentMode) {
                            case 'offline':
                                if (quote.paymentOfflineDraweeBank && quote.paymentOfflineInstrumentTransferCode) {
                                    this.board.columns.find(el => el.name == KanbanStages.PENDING_PAYMENT_OFFLINE)?.quotes?.push(quote)
                                } else {
                                    this.board.columns.find(el => el.name == KanbanStages.PENDING_PAYMENT)?.quotes?.push(quote)
                                }
                                break;
                            case 'online':
                                this.board.columns.find(el => el.name == KanbanStages.PENDING_PAYMENT_ONLINE)?.quotes?.push(quote)
                                break;
                            default:
                                this.board.columns.find(el => el.name == KanbanStages.PENDING_PAYMENT)?.quotes?.push(quote)
                        }

                    } else {
                        this.board.columns.find(el => el.name == KanbanStages.PENDING_PAYMENT)?.quotes?.push(quote)
                    }

                    break;
                case AllowedQuoteStates.PLACEMENT:
                    // this.board.columns.find(el => el.name == KanbanStages.INSURER_PLACEMENT)?.quotes?.push(quote)
                    // this.board.columns.find(el => el.name == KanbanStages.BROKER_PLACEMENT)?.quotes?.push(quote)
                    this.board.columns.find(el => el.name == KanbanStages.PLACEMENT)?.quotes?.push(quote)
                    break;
                case AllowedQuoteStates.CANCELLED:
                // this.board.columns.find(el => el.name == KanbanStages.INSURER_PLACEMENT)?.quotes?.push(quote)
                // this.board.columns.find(el => el.name == KanbanStages.BROKER_PLACEMENT)?.quotes?.push(quote)
                // this.board.columns.find(el => el.name == KanbanStages.CANCELLED)?.quotes?.push(quote)
                // break;
                case AllowedQuoteStates.REJECTED:
                // this.board.columns.find(el => el.name == KanbanStages.INSURER_PLACEMENT)?.quotes?.push(quote)
                // this.board.columns.find(el => el.name == KanbanStages.BROKER_PLACEMENT)?.quotes?.push(quote)
                // this.board.columns.find(el => el.name == KanbanStages.REJECTED)?.quotes?.push(quote)
                // break;
                case AllowedQuoteStates.LOSS_QUOTE:
                    // this.board.columns.find(el => el.name == KanbanStages.INSURER_PLACEMENT)?.quotes?.push(quote)
                    // this.board.columns.find(el => el.name == KanbanStages.BROKER_PLACEMENT)?.quotes?.push(quote)
                    this.board.columns.find(el => el.name == KanbanStages.LOSS_QUOTE)?.quotes?.push(quote)
                    break;
                case AllowedQuoteStates.POST_PLACEMENT:
                    // this.board.columns.find(el => el.name == KanbanStages.INSURER_PLACEMENT)?.quotes?.push(quote)
                    // this.board.columns.find(el => el.name == KanbanStages.BROKER_PLACEMENT)?.quotes?.push(quote)
                    this.board.columns.find(el => el.name == KanbanStages.POST_PLACEMENT)?.quotes?.push(quote)
                    break;
            }
            // }
        })
        this.board.columns = this.board.columns.map(item => {
            let filteredQuotes = item.quotes.filter(item => item.pinnedQuoteAt).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            let unfilteredQuotes = item.quotes.filter(item => !item.pinnedQuoteAt);
            item.quotes = [...filteredQuotes, ...unfilteredQuotes];
            return item;
        });
    }

    searchQuote(e) {
        this.prepareStages(this.selectedQuoteStages);
        this.mapQuotes(this.quotes)
        if (e != '') {
            this.board.columns = this.board.columns.map(item => {
                item.quotes = item.quotes.filter(quote => {
                    if (quote.quoteNo) {
                        return quote.quoteNo.toLowerCase().includes(e.toLowerCase())
                    }
                    else {
                        return false;
                    }
                })
                return item;
            })
        }
    }
    submitSelection() {
        // Add your logic to process the selected insurer
        this.quoteService.revisedQuote(this.selectedInsurer, this.quote._id).subscribe({
            next: response => {
                this.loadRecords()
            }
        });
        this.showModal = false;
    }

    cancel() {
        this.selectedInsurer = '';
        this.showModal = false;
    }

    revisedQuote(quote: IQuoteSlip) {
        this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                let allQuotes = dto.data.entity;
                this.quote = dto.data.entity;
                this.quoteService.setQuote(allQuotes)
                this.allInsurerList = []; // Reset the cols array
                for (const insurerQuote of allQuotes.insurerProcessedQuotes) {
                    this.allInsurerList.push({
                        id: insurerQuote._id,
                        version: "Version " + insurerQuote.qcrVersion + (insurerQuote.parentQuoteId ? " (Expiry Terms)" : ""),
                        partnerName: insurerQuote.partnerId['name'],
                        createdAt: insurerQuote.createdAt
                    });
                }

                this.showModal = true; // Show the modal
            },
            error: e => {
                console.log(e);
            }
        });
    }

    copyRevisedQuote(quote: IQuoteSlip) {
        this.quoteService.copyRevisedQuote(quote?._id).subscribe({
            next: response => {
                this.loadRecords()
            }
        });
    }
    cancelQuote(quote: IQuoteSlip, action: string) {
        this.quoteService.cancellQuote(quote?._id, action).subscribe({
            next: response => {
                this.loadRecords()
                this.messageService.add({ key: "success", severity: 'success', detail: 'Successfully Cancelled' })
            }
        });
    }


    lossQuote(quote: IQuoteSlip, action: string) {
        this.quoteService.lossquote(quote?._id, action).subscribe({
            next: response => {
                this.loadRecords()
                this.messageService.add({ key: "success", severity: 'success', detail: 'Successfully Cancelled' })
            }
        });
    }


    ref: DynamicDialogRef

    isAllowedOpenQuote(quote: IQuoteSlip): boolean {
        return true;
    }

    openRiskCoverLetterDialog(quote: IQuoteSlip) {
        this.quoteService.get(quote._id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                    this.quoteService.setQuote(dto.data.entity)
                    this.quoteService.getAllQuoteOptions(quote?.placedIcQuoteId.toString()).subscribe({
                        next: async (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.loadOptionsData(dtoOption.data.entity);
                            this.loadSelectedOption(dtoOption.data.entity.filter(x => x.isOptionSelected == true)[0])
                            this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                } else if (this.isAllowedProductLiability(quote)) {
                    this.quoteService.setQuote(dto.data.entity)
                    this.quoteService.getAllLiabilityQuoteOptions(quote?.placedIcQuoteId.toString()).subscribe({
                        next: (dtoLiability: IOneResponseDto<any[]>) => {
                            this.quoteService.get(quote?.placedIcQuoteId.toString()).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    let placedTemplate;
                                    switch (quote.productId?.['productTemplate']) {
                                        case AllowedProductTemplate.WORKMENSCOMPENSATION:
                                            placedTemplate = dtoLiability.data.entity.filter(x => x.isQuoteOptionPlaced == true && x._id == dto.data.entity.wcTemplateDataId["_id"])[0]
                                            this.loadOptionsData(dtoLiability.data.entity);
                                            this.loadSelectedOption(placedTemplate); break;
                                        case AllowedProductTemplate.LIABILITY:
                                        case AllowedProductTemplate.LIABILITY_CRIME:
                                            placedTemplate = dtoLiability.data.entity.filter(x => x.isQuoteOptionPlaced == true && x._id == dto.data.entity.liabilityTemplateDataId["_id"])[0]
                                            this.loadOptionsData(dtoLiability.data.entity);
                                            this.loadSelectedOption(placedTemplate); break;
                                        case AllowedProductTemplate.LIABILITY_EANDO:
                                            placedTemplate = dtoLiability.data.entity.filter(x => x.isQuoteOptionPlaced == true && x._id == dto.data.entity.liabilityEandOTemplateDataId["_id"])[0]
                                            this.loadOptionsData(dtoLiability.data.entity);
                                            this.loadSelectedOption(placedTemplate); break;
                                        case AllowedProductTemplate.LIABILITY_CGL:
                                        case AllowedProductTemplate.LIABILITY_PUBLIC:
                                            placedTemplate = dtoLiability.data.entity.filter(x => x.isQuoteOptionPlaced == true && x._id == dto.data.entity.liabilityCGLTemplateDataId["_id"])[0]
                                            this.loadOptionsData(dtoLiability.data.entity);
                                            this.loadSelectedOption(placedTemplate); break;
                                        case AllowedProductTemplate.LIABILITY_PRODUCT:
                                        case AllowedProductTemplate.LIABILITY_CYBER:
                                            placedTemplate = dtoLiability.data.entity.filter(x => x.isQuoteOptionPlaced == true && x._id == dto.data.entity.liabilityProductTemplateDataId["_id"])[0]
                                            this.loadOptionsData(dtoLiability.data.entity);
                                            this.loadSelectedOption(placedTemplate); break;
                                    }

                                    this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
                                }
                            })

                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    this.quoteService.getQuoteByQuoteNo(quote.quoteNo).subscribe({
                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                            dto.data.entity.map((val) => {
                                this.quoteOptionService.getAllOptionsByQuoteId(val._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                        const quoteOptionId = dto.data.entities.filter(val => val.quoteOptionStatus === 'Accept');
                                        this.router.navigate([`/backend/quotes/${quote._id}/quote-discussion`], { queryParams: { quoteOptionId: quoteOptionId[0]._id } })
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            })
                        }
                    })
                }
                // this.router.navigateByUrl(`/backend/quotes/${dto.data?.entity._id}/quote-risk-head-letter`)
            }
        });


    }


    openQuoteSlipDialog(quote: IQuoteSlip) {

        this.quoteService.get(quote._id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                this.quoteService.setQuote(dto.data.entity)
                //Intergation-EB [Start]
                if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                    this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                        next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.loadOptionsData(dtoOption.data.entity);
                            this.loadSelectedOption(dtoOption.data.entity[0])
                            if (quote.quoteState == AllowedQuoteStates.SENT_TO_INSURER_RM || quote.quoteState == AllowedQuoteStates.UNDERWRITTER_REVIEW || quote.quoteState == AllowedQuoteStates.WAITING_FOR_APPROVAL || quote.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER) {
                                if (this.user.partnerId['brokerModeStatus']) {
                                    this.quoteService.getQuoteByQuoteNo(quote.quoteNo).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            let expiredTermQuoteId
                                            Object.keys(dto.data.entity).forEach(function (key, index) {
                                                if (dto.data.entity[key].parentQuoteId) {
                                                    expiredTermQuoteId = dto.data.entity[key]._id
                                                }
                                            })
                                            this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                        }
                                    })
                                    // this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                }
                                else {
                                    this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
                                }
                                // this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
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
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    if (quote.quoteState == AllowedQuoteStates.SENT_TO_INSURER_RM ||
                        quote.quoteState == AllowedQuoteStates.UNDERWRITTER_REVIEW ||
                        quote.quoteState == AllowedQuoteStates.QCR_FROM_UNDERWRITTER) {
                        if (!this.user.roleId["name"].includes([AllowedRoles.SALES_CREATOR_AND_APPROVER])) {
                            if (this.user.partnerId['brokerModeStatus']) {
                                this.quoteService.getQuoteByQuoteNo(quote.quoteNo).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        let quoteOptionId
                                        let isLiabilityProduct = false
                                        switch (quote.productId?.['productTemplate']) {
                                            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                                                isLiabilityProduct = true
                                                break;
                                            case AllowedProductTemplate.LIABILITY:
                                            case AllowedProductTemplate.LIABILITY_CRIME:
                                                isLiabilityProduct = true
                                                break;
                                            case AllowedProductTemplate.LIABILITY_EANDO:
                                                isLiabilityProduct = true
                                                break;
                                            case AllowedProductTemplate.LIABILITY_CGL:
                                            case AllowedProductTemplate.LIABILITY_PUBLIC:
                                                isLiabilityProduct = true
                                                break;
                                            case AllowedProductTemplate.LIABILITY_PRODUCT:
                                            case AllowedProductTemplate.LIABILITY_CYBER:
                                                isLiabilityProduct = true
                                                break;
                                        }
                                        if (isLiabilityProduct) {
                                            let selectedOptions;
                                            this.quoteService.getAllLiabilityQuoteOptions(quote._id).subscribe({
                                                next: (dto: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dto.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    quoteOptionId = this.quoteOptionsLst[0]._id
                                                    selectedOptions = this.quoteOptionsLst[0];
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0]);
                                                    this.loadQuoteDetails(quote._id)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        } else {
                                            quoteOptionId = dto.data.entity[1].quoteOption[0]._id
                                        }

                                        // this.router.navigate([], {
                                        //     relativeTo: this.activatedRoute,
                                        //     queryParams: {
                                        //         location: dto.data.entity[0].locationBasedCovers.quoteLocationOccupancy._id,
                                        //         quoteOptionId: quoteOptionId,
                                        //         redirect: dto.data.entity[0]._id,
                                        //         reload: 'reload'
                                        //     },
                                        //     queryParamsHandling: 'merge'
                                        // });
                                        this.router.navigate([`/backend/quotes/${dto.data.entity[0]._id}/edit`], {
                                            queryParams: {
                                                quoteOptionId: quoteOptionId
                                            }
                                        });

                                    }
                                })
                            } else {
                                this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
                            }
                        } else {
                            this.router.navigateByUrl(`/backend/quotes/${quote._id}/quote-discussion`)
                        }
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
                //Intergation-EB [Start]
            }
        })

    }

    loadQuoteDetails(qoute_id) {
        this.quoteService.get(qoute_id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quote = dto.data.entity;
                this.quoteService.setQuote(dto.data.entity);
                //this.getEmployeesDemographySummary()
            },
            error: e => {
                console.log(e);
            }
        });
    }

    openChoosePaymentMethodDialogComponent(quote: IQuoteSlip) {

        this.quoteService.get(quote._id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // this.quoteService.setQuote(dto.data.entity)ent
                if (dto.data.entity.quoteState == AllowedQuoteStates.PLACEMENT) {
                    this.openRiskCoverLetterDialog(dto.data.entity);
                }
                else {

                    if (dto.data.entity.paymentMode) {
                        const ref = this.dialogService.open(PaymentDetailsPopupComponent, {
                            // width: '500px',
                            header: 'Payment Details Confirmed',
                            styleClass: 'flatPopup',
                            data: {
                                quote: dto.data.entity.placedIcQuoteId,
                            }
                        })

                    } else {
                        let isCKYCTemplate = false;

                        let lazyLoadEvent: LazyLoadEvent = {
                            first: 0,
                            rows: 200,
                            sortField: null,
                            sortOrder: 1,
                            filters: {
                                // @ts-ignore
                                partnerId: [
                                    {
                                        value: dto.data.entity?.placedIcQuoteId?.partnerId,
                                        matchMode: "equals",
                                        operator: "or"
                                    }
                                ]
                            },
                            globalFilter: null,
                            multiSortMeta: null
                        }

                        this.apiTemplateService.getMany(lazyLoadEvent).subscribe(templates => {

                            isCKYCTemplate = templates.data.entities.filter(item => item.sequenceNumber == 8).length == 1

                            const quote = dto.data.entity
                            const ckycDetails = quote.clientId['apiDetails']
                            const ckycRecord = ckycDetails.filter(item => item['partnerId']['_id'] == quote.partnerId['_id'] && item['quoteNo'] == quote.quoteNo)


                            if (isCKYCTemplate) {
                                if (ckycRecord.length != 1) {
                                    const cKYCDialogComponentref = this.dialogService.open(ClientCKYCDialogComponent, {
                                        width: '60%',
                                        height: '100%',
                                        header: 'Quote No : ' + quote.quoteNo,
                                        styleClass: 'customPopup',
                                        data: {
                                            quote: dto.data.entity,
                                            isCKYCTemplate: isCKYCTemplate
                                        }
                                    })
                                } else {
                                    if (!quote?.otpVerifiedAt && !quote?.offlineVerificationFormUrl) {
                                        const verificationModeDialogref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
                                            header: 'Client : ' + quote.clientId['name'] + ' - ' + 'Quote No : ' + quote.quoteNo,
                                            data: {
                                                quote: quote,
                                                isCKYCTemplate: isCKYCTemplate
                                            },
                                            width: '45%',
                                            // height: '40%',
                                            styleClass: "customPopup"
                                        })
                                    }
                                    else {
                                        const ref = this.dialogService.open(ProceedWithOfflinePaymentDialogComponent, {
                                            header: 'Client : ' + quote.clientId['name'] + ' - ' + 'Quote No : ' + quote.quoteNo,

                                            data: {
                                                quote: quote,
                                            },
                                            width: '45%',
                                            // height: '40%',
                                            styleClass: "customPopup "
                                        })
                                    }
                                    // if (!quote?.otpVerifiedAt && !quote?.offlineVerificationFormUrl) {
                                    //     const verificationModeDialogref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
                                    //         header: 'Client : ' + quote.clientId['name'] + ' - ' + 'Quote No : ' + quote.quoteNo,
                                    //         data: {
                                    //             quote: quote,
                                    //             isCKYCTemplate: isCKYCTemplate
                                    //             //   kycFailed : false
                                    //         },
                                    //         width: '45%',
                                    //         // height: '40%',
                                    //         styleClass: "customPopup"
                                    //     })
                                    // } else {

                                    // }
                                }
                            }
                            else {
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

                        })

                    }
                }
            }
        })
    }


    openQuoteForBrokerAdmin(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                // this.openQuoteSlipDialog(quote)
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
            case AllowedQuoteStates.POST_PLACED:
                this.openRiskCoverLetterDialog(quote)
                break;
            case AllowedQuoteStates.LOSS_QUOTE:
                this.openReasonForQuoteLoss(quote)
                break;
        }
    }

    openReasonForQuoteLoss(quote: IQuoteSlip) {
        console.log("comparing", quote);
        const ref = this.dialogService.open(ReasonForQuoteLossComponent, {
            header: "Reason for quote loss",
            width: '500px',
            styleClass: 'customPopup customPopup-dark',
            data: {
                quote: quote,
            }
        })
        ref.onClose.subscribe((data) => {
        });

    }

    openQuoteForBrokerCreator(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                //Intergation-EB [Start]
                if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                    this.quoteService.get(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                            this.quoteService.setQuote(dto.data.entity)

                            this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                                next: async (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                    this.loadOptionsData(dtoOption.data.entity);
                                    this.loadSelectedOption(dtoOption.data.entity[0])
                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else if (this.isAllowedProductLiability(quote)) {
                    this.quoteService.getAllLiabilityQuoteOptions(quote._id).subscribe({
                        next: (dto: IOneResponseDto<any[]>) => {
                            this.quoteOptionsLst = dto.data.entity.filter(x => x.version == quote.qcrVersion)
                            this.loadOptionsData(this.quoteOptionsLst);
                            this.loadSelectedOption(this.quoteOptionsLst[0])
                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    // New_Quote_Option
                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                    // Old_Quote
                    // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                    // this.quoteService.setQuote(quote);
                }
                //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                //Intergation-EB [End]
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                if (this.user.partnerId['brokerModeStatus'] && this.role.name == AllowedRoles.PLACEMENT_CREATOR) {
                    // New_Quote_Option
                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                } else {
                    this.messageService.add({ key: "success", severity: 'success', detail: 'Your Quote in send to insurer' })
                }
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
            case AllowedQuoteStates.REJECTED:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.LOSS_QUOTE:
                this.openReasonForQuoteLoss(quote)
                break;
        }
    }

    isAllowedProductLiability(quote) {
        const isTemplateAllowed = [
            AllowedProductTemplate.LIABILITY_CGL,
            AllowedProductTemplate.LIABILITY_PUBLIC,
            AllowedProductTemplate.LIABILITY,
            AllowedProductTemplate.LIABILITY_EANDO,
            AllowedProductTemplate.LIABILITY_CRIME,
            AllowedProductTemplate.LIABILITY_PRODUCT,
            AllowedProductTemplate.WORKMENSCOMPENSATION,
            AllowedProductTemplate.LIABILITY_CYBER].includes(quote.productId['productTemplate'])
        return isTemplateAllowed;
    }

    openQuoteForBrokerCreatorAndApprover(quote: IQuoteSlip) {

        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                // New_Quote_Option
                this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                        this.router.navigate([`/backend/quotes/${quote._id}`], {
                            queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                        });
                    },
                    error: e => {
                        console.log(e);
                    }
                });
                // Old_Quote
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                if (this.isAllowedProductLiability(quote)) {
                    this.quoteService.getAllLiabilityQuoteOptions(quote._id).subscribe({
                        next: (dto: IOneResponseDto<any[]>) => {
                            this.quoteOptionsLst = dto.data.entity.filter(x => x.version == quote.qcrVersion)
                            this.loadOptionsData(this.quoteOptionsLst);
                            this.loadSelectedOption(this.quoteOptionsLst[0])
                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                queryParams: { quoteOptionId: this.quoteOptionsLst[0]?._id }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    // New_Quote_Option
                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }

                    });
                }
                // Old_Quote
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                if (this.user.partnerId['brokerModeStatus']) {
                    if (!this.user.roleId["name"].includes([AllowedRoles.SALES_CREATOR_AND_APPROVER])) {
                        if (!this.user.partnerId['isBrokerMappedFromMaster']) {
                            if (!quote.assignedToPlacementMakerId) {
                                this.placementMakerOpenDialogComponent(quote);
                            } else if (quote.assignedToPlacementMakerId != this.user._id) {
                                alert("This quote is already assigned other")
                            }
                            else {
                                if (this.isAllowedProductLiability(quote)) {
                                    this.quoteService.getAllLiabilityQuoteOptions(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<any[]>) => {
                                            this.quoteOptionsLst = dto.data.entity.filter(x => x.version == quote.qcrVersion)
                                            this.loadOptionsData(this.quoteOptionsLst);
                                            this.loadSelectedOption(this.quoteOptionsLst[0])
                                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                                queryParams: { quoteOptionId: this.quoteOptionsLst[0]?._id }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        this.messageService.add({ key: "success", severity: 'success', detail: 'Quote is sent to RFQ' })
                        // New_Quote_Option
                        // this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                        //     next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                        //         this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                        //             queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                        //         });
                        //     },
                        //     error: e => {
                        //         console.log(e);
                        //     }
                        // });
                    }
                } else {
                    // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                    this.messageService.add({ key: "success", severity: 'success', detail: 'Your Quote in send to insurer' })
                }
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                if (this.user.partnerId['brokerModeStatus']) {
                    if (!this.user.roleId["name"].includes([AllowedRoles.SALES_CREATOR_AND_APPROVER])) {
                        if (!this.user.partnerId['isBrokerMappedFromMaster']) {
                            if (quote.assignedToPlacementMakerId == this.user._id) {
                                this.openQuoteSlipDialog(quote);
                            } else if (quote.assignedToPlacementMakerId != this.user._id) {
                                alert("This quote is already assigned other")
                            }
                        }
                    } else {
                        this.openQuoteSlipDialog(quote);
                    }
                } else {
                    this.openQuoteSlipDialog(quote);
                }
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:

                switch (quote.productId['productTemplate']) {
                    case AllowedProductTemplate.BLUS:
                    case AllowedProductTemplate.IAR:
                    case AllowedProductTemplate.FIRE:
                        if (this.user.partnerId['brokerModeStatus']) {
                            if (!this.user.partnerId['isBrokerMappedFromMaster']) {
                                if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                    if(quote.qcrApprovedRequested && this.user._id == quote.assignedToPlacementMakerId){
                                        this.messageService.add({ key: "success", severity: 'success', detail: 'Your Quote is sent for QCR approval' })
                                    }else{
                                        this.placementCheckerOpenDialogComponent(quote);
                                    }
                                } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                            this.router.navigate([`/backend/quotes/${quote._id}/comparision-review-detailed`], {
                                                queryParams: { quoteOptionId: dto.data.entities.filter(option => option.qcrVersion).slice(-1)[0]?._id || dto.data.entities[0]?._id }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                            this.router.navigate([`/backend/quotes/${quote._id}/comparision-review-detailed`], {
                                                queryParams: { quoteOptionId: dto.data.entities.filter(option => option.qcrVersion).slice(-1)[0]?._id || dto.data.entities[0]?._id }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                        this.router.navigate([`/backend/quotes/${quote._id}/comparision-review-detailed`], {
                                            queryParams: { quoteOptionId: dto.data.entities.filter(option => option.qcrVersion).slice(-1)[0]?._id || dto.data.entities[0]?._id }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            // New_Quote_Option
                            this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                    this.router.navigate([`/backend/quotes/${quote._id}/comparision-review-detailed`], {
                                        queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                                    });
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }

                        // Old_Quote
                        // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed`)

                        break;

                    case AllowedProductTemplate.GMC:
                        if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                            if (this.user.partnerId['brokerModeStatus'] == true) {
                                if (this.user.partnerId['isBrokerMappedFromMaster'] == false) {
                                    if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                        this.placementCheckerOpenDialogComponent(quote);
                                    } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                        this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                                this.quoteService.setQuote(dto.data.entity)

                                                this.quoteService.getAllQuoteOptions(dto.data.entity._id).subscribe({
                                                    next: async (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                                        this.loadOptionsData(dtoOption.data.entity);
                                                        this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                                                    },
                                                    error: e => {
                                                        console.log(e);
                                                    }
                                                });
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    }
                                    else {
                                        this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                                this.quoteService.setQuote(dto.data.entity)

                                                this.quoteService.getAllQuoteOptions(dto.data.entity._id).subscribe({
                                                    next: async (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                                        this.loadOptionsData(dtoOption.data.entity);
                                                        // this.loadSelectedOption(dtoOption.data.entity[0])
                                                        this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                                                    },
                                                    error: e => {
                                                        console.log(e);
                                                    }
                                                });
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    }
                                } else {
                                    // New_Quote_Option
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)

                                            this.quoteService.getAllQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                                    this.loadOptionsData(dtoOption.data.entity);
                                                    // this.loadSelectedOption(dtoOption.data.entity[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)

                                        this.quoteService.getAllQuoteOptions(dto.data.entity._id).subscribe({
                                            next: async (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                                this.loadOptionsData(dtoOption.data.entity);
                                                // this.loadSelectedOption(dtoOption.data.entity[0])
                                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                        }
                        //Intergation-EB [End]
                        break;
                    case AllowedProductTemplate.WORKMENSCOMPENSATION:
                        if (this.user.partnerId['brokerModeStatus'] == true) {
                            if (this.user.partnerId['isBrokerMappedFromMaster'] == false) {
                                if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                    this.placementCheckerOpenDialogComponent(quote);
                                } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)
                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-wc`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)

                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-wc`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                            next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                this.loadOptionsData(this.quoteOptionsLst);
                                                this.loadSelectedOption(this.quoteOptionsLst[0])
                                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-wc`)
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            // New_Quote_Option
                            this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    this.quoteService.setQuote(dto.data.entity)
                                    this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                        next: async (dtoOption: IOneResponseDto<any[]>) => {
                                            this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                            this.loadOptionsData(this.quoteOptionsLst);
                                            this.loadSelectedOption(this.quoteOptionsLst[0])
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-wc`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }
                        //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-wc`)
                        //this.handleQuoteCRProcessing(quote._id, quote?.qcrVersion, `/backend/quotes/${quote._id}/comparision-review-detailed-wc`);                         
                        break;
                    case AllowedProductTemplate.LIABILITY_CRIME:
                    case AllowedProductTemplate.LIABILITY:
                        if (this.user.partnerId['brokerModeStatus'] == true) {
                            if (this.user.partnerId['isBrokerMappedFromMaster'] == false) {
                                if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                    this.placementCheckerOpenDialogComponent(quote);
                                } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)
                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liability`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)
                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liability`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                            next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                this.loadOptionsData(this.quoteOptionsLst);
                                                this.loadSelectedOption(this.quoteOptionsLst[0])
                                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liability`)
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            // New_Quote_Option
                            this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    this.quoteService.setQuote(dto.data.entity)
                                    this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                        next: async (dtoOption: IOneResponseDto<any[]>) => {
                                            this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                            this.loadOptionsData(this.quoteOptionsLst);
                                            this.loadSelectedOption(this.quoteOptionsLst[0])
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liability`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }
                        //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liability`)
                        //this.handleQuoteCRProcessing(quote._id, quote?.qcrVersion, `/backend/quotes/${quote._id}/comparision-review-detailed-liability`);                      
                        break;
                    case AllowedProductTemplate.LIABILITY_EANDO:
                        if (this.user.partnerId['brokerModeStatus'] == true) {
                            if (this.user.partnerId['isBrokerMappedFromMaster'] == false) {
                                if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                    this.placementCheckerOpenDialogComponent(quote);
                                } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)
                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityeando`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)

                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityeando`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                            next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                this.loadOptionsData(this.quoteOptionsLst);
                                                this.loadSelectedOption(this.quoteOptionsLst[0])
                                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityeando`)
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            // New_Quote_Option
                            this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    this.quoteService.setQuote(dto.data.entity)
                                    this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                        next: async (dtoOption: IOneResponseDto<any[]>) => {
                                            this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                            this.loadOptionsData(this.quoteOptionsLst);
                                            this.loadSelectedOption(this.quoteOptionsLst[0])
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityeando`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }
                        //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityeando`)
                        //this.handleQuoteCRProcessing(quote._id, quote?.qcrVersion, `/backend/quotes/${quote._id}/comparision-review-detailed-liabilityeando`);
                        break;
                    case AllowedProductTemplate.LIABILITY_PUBLIC:
                    case AllowedProductTemplate.LIABILITY_CGL:
                        if (this.user.partnerId['brokerModeStatus'] == true) {
                            if (this.user.partnerId['isBrokerMappedFromMaster'] == false) {
                                if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                    this.placementCheckerOpenDialogComponent(quote);
                                } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)
                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilitycgl`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)

                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilitycgl`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                            next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                this.loadOptionsData(this.quoteOptionsLst);
                                                this.loadSelectedOption(this.quoteOptionsLst[0])
                                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilitycgl`)
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            // New_Quote_Option
                            this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    this.quoteService.setQuote(dto.data.entity)
                                    this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                        next: async (dtoOption: IOneResponseDto<any[]>) => {
                                            this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                            this.loadOptionsData(this.quoteOptionsLst);
                                            this.loadSelectedOption(this.quoteOptionsLst[0])
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilitycgl`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }

                        //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilitycgl`)
                        //this.handleQuoteCRProcessing(quote._id, quote?.qcrVersion, `/backend/quotes/${quote._id}/comparision-review-detailed-liabilitycgl`);
                        break;
                    case AllowedProductTemplate.LIABILITY_CYBER:
                    case AllowedProductTemplate.LIABILITY_PRODUCT:
                        if (this.user.partnerId['brokerModeStatus'] == true) {
                            if (this.user.partnerId['isBrokerMappedFromMaster'] == false) {
                                if (quote.qcrApprovedRequested && !quote.assignedToPlacementCheckerId) {
                                    this.placementCheckerOpenDialogComponent(quote);
                                } else if (quote.qcrApprovedRequested && quote.assignedToPlacementCheckerId) {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)
                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityproduct`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else {
                                    this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                            this.quoteService.setQuote(dto.data.entity)

                                            this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                                next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                    this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                    this.loadOptionsData(this.quoteOptionsLst);
                                                    this.loadSelectedOption(this.quoteOptionsLst[0])
                                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityproduct`)
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                            } else {
                                // New_Quote_Option
                                this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                            next: async (dtoOption: IOneResponseDto<any[]>) => {
                                                this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                                this.loadOptionsData(this.quoteOptionsLst);
                                                this.loadSelectedOption(this.quoteOptionsLst[0])
                                                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityproduct`)
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                        } else {
                            // New_Quote_Option
                            this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    this.quoteService.setQuote(dto.data.entity)
                                    this.quoteService.getAllLiabilityQuoteOptions(dto.data.entity._id).subscribe({
                                        next: async (dtoOption: IOneResponseDto<any[]>) => {
                                            this.quoteOptionsLst = dtoOption.data.entity.filter(x => x.version == quote.qcrVersion)
                                            this.loadOptionsData(this.quoteOptionsLst);
                                            this.loadSelectedOption(this.quoteOptionsLst[0])
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-liabilityproduct`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }
                        //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-wc`)
                        //this.handleQuoteCRProcessing(quote._id, quote?.qcrVersion, `/backend/quotes/${quote._id}/comparision-review-detailed-wc`);
                        break;
                    case AllowedQuoteStates.POST_PLACEMENT:
                        this.openRiskCoverLetterDialog(quote)
                        break;

                }


                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                /*
                if (this.user.partnerId["brokerModeStatus"]) {
                    this.openRiskCoverLetterDialog(quote)
                } else {
                    this.openChoosePaymentMethodDialogComponent(quote)
                }
                */
                this.openChoosePaymentMethodDialogComponent(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
            case AllowedQuoteStates.REJECTED:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.LOSS_QUOTE:
                this.openReasonForQuoteLoss(quote)
                break;
            case AllowedQuoteStates.POST_PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }

    handleQuoteCRProcessing(quoteId: string, qcrVersion: number, navigateUrl: string) {
        this.quoteService.get(`${quoteId}`, { allCovers: true, qcr: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                console.log(dto.data.entity);
                this.quoteService.setQuote(dto.data.entity);

                this.quoteService.getAllLiabilityQuoteOptions(quoteId).subscribe({
                    next: (dto: IOneResponseDto<any[]>) => {
                        this.quoteOptionsLst = dto.data.entity.filter(x => x.version == qcrVersion);
                        this.loadOptionsDataLiability(this.quoteOptionsLst);
                        this.routerService.navigateByUrl(navigateUrl);
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            },
            error: e => {
                console.log(e);
            }
        });
    }

    openQuoteForOperations(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.PENDING_PAYMENT:
                if (quote.paymentMode == 'offline') {
                    this.router.navigateByUrl(`/backend/quotes/${quote._id}/offline-payment`)
                } else {
                    this.openQuoteSlipDialog(quote)
                }

                break;
            case AllowedQuoteStates.PLACEMENT:
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
                //Intergation-EB [Start]
                if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                    this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.quoteService.setQuote(quote);
                            this.loadOptionsData(dto.data.entity);
                            this.loadSelectedOption(dto.data.entity[0])
                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    // New_Quote_Option
                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                            this.router.navigate([`/backend/quotes/${quote._id}/requisition`], {
                                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                    // Old_Quote
                    // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                }
                //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                //Intergation-EB [End]
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                //Intergation-EB [Start]
                switch (quote.productId['productTemplate']) {
                    case AllowedProductTemplate.BLUS:
                        this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review`)

                        break;
                    case AllowedProductTemplate.IAR:
                        this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed`)
                        break;
                    case AllowedProductTemplate.FIRE:
                        this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed`)
                        break;
                    case AllowedProductTemplate.GMC:
                        if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                            this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                                next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                    this.quoteService.setQuote(quote);
                                    this.loadOptionsData(dto.data.entity);
                                    this.loadSelectedOption(dto.data.entity[0])
                                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        }
                        else {
                            this.quoteService.setQuote(quote);
                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed-gmc`)
                        }
                        //Intergation-EB [End]
                        break;
                }
                //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/comparision-review-detailed`)
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openChoosePaymentMethodDialogComponent(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
            case AllowedQuoteStates.REJECTED:
                this.openQuoteSlipDialog(quote)
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
                //Intergation-EB [Start]
                if (quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
                    this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.quoteService.setQuote(quote);
                            this.loadOptionsData(dto.data.entity);
                            this.loadSelectedOption(dto.data.entity[0])
                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
                else {
                    this.quoteService.setQuote(quote);
                    this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                }
                //this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                //Intergation-EB [End]
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

    openQuoteForInsurerUnderwritter(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.openQuoteSlipDialog(quote)
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.openQuoteSlipDialog(quote)
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.openQuoteSlipDialog(quote)
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/requisition`)
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                if (!quote.acceptedByUnderwriter && quote.quoteState === AllowedQuoteStates.UNDERWRITTER_REVIEW && !quote.underwriterMappingId) {
                    this.confirmationService.confirm({
                        message: 'Are you sure that you want to accept the quote?',
                        header: 'Confirmation',
                        icon: 'pi pi-exclamation-triangle',
                        accept: () => {
                            this.updateQuoteFields(quote, this.user)
                            // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted this quote for review.'});
                        },
                        reject: (type) => {
                        }
                    });
                } else {
                    this.quoteService.get(quote._id, {
                        // allCovers: true,
                        brokerQuotes: true
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

                            if ((currentUnderwritterLevel == this.user['underWriterLevel'] && this.user['_id'] == quote[`underWriter${currentUnderwritterLevel}`]['_id']) || quote.acceptedByUnderwriter == this.user?._id) {
                                if (quote?.productId['productTemplate'] == AllowedProductTemplate.FIRE && quote.brokerWiseQuotes.length > 1) {
                                    const ref = this.dialogService.open(QuoteCompareConfirmationDialogComponent, {
                                        header: '',
                                        width: '740px',
                                        // contentStyle: { "max-height": "400px", "overflow": "auto" },
                                        // baseZIndex: 10000
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

                                                // New_Quote_Option
                                                this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                                    next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                                        this.router.navigate([`/backend/quotes/${quote._id}/edit`], {
                                                            queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                                                        });
                                                    },
                                                    error: e => {
                                                        console.log(e);
                                                    }
                                                });

                                                // Old_Quote
                                                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                            }
                                        }
                                    })

                                } else if (quote?.productId['productTemplate'] == AllowedProductTemplate.GMC) {
                                    this.quoteService.getAllQuoteOptions(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                            this.quoteService.setQuote(quote);
                                            this.loadOptionsData(dto.data.entity);
                                            this.loadSelectedOption(dto.data.entity[0])
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });
                                }
                                else if (quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_EANDO
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CYBER
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC
                                    || quote?.productId['productTemplate'] == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                                    this.quoteService.getAllLiabilityQuoteOptions(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<any[]>) => {
                                            this.quoteService.setQuote(quote);
                                            this.quoteOptionsLst = dto.data.entity.filter(x => x.version == quote?.qcrVersion)
                                            this.loadOptionsDataLiability(this.quoteOptionsLst);
                                            this.loadSelectedOptionLiability(this.quoteOptionsLst[0]);
                                            this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });

                                }
                                else {

                                    // New_Quote_Option
                                    this.quoteOptionService.getAllOptionsByQuoteId(quote._id).subscribe({
                                        next: (dto: IOneResponseDto<IQuoteOption[]>) => {
                                            this.router.navigate([`/backend/quotes/${quote._id}/edit`], {
                                                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
                                            });
                                        },
                                        error: e => {
                                            console.log(e);
                                        }
                                    });

                                    // Old_Quote
                                    // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                }

                                // }


                            } else if (quote.acceptedByUnderwriter && quote.acceptedByUnderwriter != this.user?._id) {
                                return
                            }
                            else {
                                // this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                this.openQuoteSlipDialog(quote)
                            }

                            this.quoteService.setQuote(dto.data.entity);

                        }
                    })
                }
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
            case AllowedQuoteStates.REJECTED:
                // this.openRiskCoverLetterDialog(quote)
                this.routerService.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                break;
        }
    }

    loadSelectedOptionLiability(quoteOption: any) {
        this.quoteService.setSelectedOptions(quoteOption)
    }

    loadOptionsDataLiability(quoteOption: any[]) {
        this.quoteService.setQuoteOptions(quoteOption)
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
                this.openQuoteForBrokerAdmin(quote)
                break;
            case AllowedRoles.AGENT_CREATOR:
                this.openQuoteForBrokerCreator(quote)
                break;
            case AllowedRoles.OPERATIONS:
                this.openQuoteForOperations(quote)
                break;
            case AllowedRoles.AGENT_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerCreatorAndApprover(quote)
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
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
            case AllowedRoles.PLACEMENT_APPROVER:
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
            case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                this.openQuoteForBrokerCreatorAndApprover(quote)
                break;
        }

    }

    pinnedQuote(quote: IQuoteSlip) {
        if (quote?.pinnedQuoteAt) {
            this.quoteService.update(quote._id, { pinnedQuoteAt: null }).subscribe(res => {
                this.quotes = this.quotes.map(quote => {
                    if (quote._id == res.data.entity._id) {
                        return res.data.entity
                    } else {
                        return quote
                    }
                })

                this.prepareStages(this.selectedQuoteStages);
                this.mapQuotes(this.quotes)

                this.board.columns = this.board.columns.map(item => {

                    let filterdQuotes = item.quotes.filter(item => item.pinnedQuoteAt).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                    let unfilteredQuotes = item.quotes.filter(item => !item.pinnedQuoteAt);
                    item.quotes = [...filterdQuotes, ...unfilteredQuotes]

                    return item;
                })
            })
        } else {
            this.quoteService.update(quote._id, { pinnedQuoteAt: new Date }).subscribe(res => {

                this.quotes = this.quotes.map(quote => {
                    if (quote._id == res.data.entity._id) {
                        return res.data.entity
                    } else {
                        return quote
                    }
                })

                this.prepareStages(this.selectedQuoteStages);
                this.mapQuotes(this.quotes)

                this.board.columns = this.board.columns.map(item => {

                    let filterdQuotes = item.quotes.filter(item => item.pinnedQuoteAt).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                    let unfilteredQuotes = item.quotes.filter(item => !item.pinnedQuoteAt);
                    item.quotes = [...filterdQuotes, ...unfilteredQuotes]

                    return item;
                })
            })
        }
    }

    updateQuoteFields(quote: IQuoteSlip, user: IUser) {
        const payload = {
            acceptedByUnderwriter: user._id,
        };
        this.quoteService.updateQuoteSlipFields(quote._id, payload)
            .subscribe(
                (response) => {
                    this.board.columns = this.board.columns.map(item => {
                        item.quotes = item.quotes.map(quote => {
                            if (quote?._id == response?.quote?._id) {
                                return response.quote
                                // return quote.quoteNo.toLowerCase().includes(e.toLowerCase())
                            }
                            else {
                                return quote;
                            }
                        })
                        return item;
                    })
                },
                (error) => {
                    console.error('Failed to update quote slip:', error);
                }
            );
    }
    placementMakerOpenDialogComponent(quote: IQuoteSlip) {
        console.log(quote)
        this.dialogService.open(PlacementDialogComponent, {
            header: 'Quote No : ' + quote.quoteNo,
            data: {
                quoteId: quote._id,
                quote: quote
            },
            width: '600px',
            styleClass: "customPopup"
        })
    }
    placementCheckerOpenDialogComponent(quote: IQuoteSlip) {
        console.log(quote);
        this.dialogService.open(PlacementcheckerDialogComponent, {
            header: 'Quote No : ' + quote.quoteNo,
            data: {
                quoteData: quote
            },
            width: '600px',
            styleClass: "customPopup"
        })
    }

    OpenLossQuote(quote: IQuoteSlip) {
        console.log("comparing", quote);
        const ref = this.dialogService.open(QuoteLossDialogComponent, {
            header: "Loss Quote Reason",
            width: '800px',
            height: '400px',
            styleClass: 'customPopup customPopup-dark',
            data: {
                quote: quote,
            }
        })
        ref.onClose.subscribe((data) => {
        });

    }


}
