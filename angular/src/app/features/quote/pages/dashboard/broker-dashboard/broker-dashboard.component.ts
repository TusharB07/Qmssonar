import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { stringify } from 'query-string';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedPartnerTypes } from 'src/app/features/admin/partner/partner.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { ProductService } from 'src/app/features/admin/product/product.service';
import { AllowedBrokerTat, AllowedQuoteStates, IQuoteSlip, OPTIONS_BROKER_TAT } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QuoteSlipDialogComponent } from 'src/app/features/quote/components/quote-slip-dialog/quote-slip-dialog.component';
import { QuoteCompareConfirmationDialogComponent } from 'src/app/features/quote/components/quote/add-on-covers-dialogs/quote-compare-confirmation-dialog/quote-compare-confirmation-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from 'src/app/features/quote/components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { ChoosePaymentModeDialogComponent } from 'src/app/features/quote/components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { RiskCoverLetterDialogComponent } from 'src/app/features/quote/components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';
import { ResetPasswordPopupDialogComponent } from '../../../components/quote/reset-password-popup-dialog/reset-password-popup-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TermAndConditionDialogComponent } from 'src/app/features/account/term-and-condition-dialog/term-and-condition-dialog.component';
import { ClientService } from 'src/app/features/admin/client/client.service';
import { FormGroup } from '@angular/forms';

interface BrokerDashboardCard {
    value: number,
    subValue?: number
}

interface BrokerDashboardClientItem {
    clientName: string,
    pendingQuotes: number
    people?: any[]
}

export interface carouselCardsProps {
    label: string;
    sublabel?: string;
    value?: number
    subvalue?: number
    navigateFunction?: Function
    navigateFunctionLabel?: string
    imageURL: string
    iscurrency?: boolean
    isTat?: boolean
}

interface BrokerDashboardStageItem {
    clientName: string,
    productName: string,
    clientId: string,
    stage: string
    quoteId: string

}

type Type = { id: string } & ILov<any>

export interface BrokerDashboardResponse {
    quotesOpenedCard?: BrokerDashboardCard;
    quotesPlacedCard?: BrokerDashboardCard;
    quotesPlacedRatioCard?: BrokerDashboardCard;

    quotesPendingWithInsurerCard?: BrokerDashboardCard;
    totalPremiumOfAllQuotesCard?: BrokerDashboardCard;
    totalComissionTillDateCard?: BrokerDashboardCard;

    clients?: BrokerDashboardClientItem[];
    stages?: BrokerDashboardStageItem[];

    productWiseCountGraph?: ILov<number>[];
    productWiseTatGraph?: Type[];


    averageBrokerTat: ILov<number>[]
    quotesPlacedCardForInsurer: BrokerDashboardCard;
    quotesPendingCardForInsurer: BrokerDashboardCard;
    averageInsurerTat: ILov<number>[];
}

export interface BrokerDashboardRequest {
    startDate: Date;
    endDate: Date;
}


export enum AllowedBrokerDashboardGraphs {
    PRODUCT_WISE_COUNT_GRAPH = 'product_wise_count_graph',
    PRODUCT_WISE_TAT_GRAPH = 'product_wise_tat_graph',
}

@Component({
    selector: 'app-broker-dashboard',
    templateUrl: './broker-dashboard.component.html',
    styleUrls: ['./broker-dashboard.component.scss', './../dashboard.component.scss']
})
export class BrokerDashboardComponent implements OnInit, OnChanges {


    @Input() user;
    @Input() partner;
    AllowedPartnerTypes = AllowedPartnerTypes;
    role: IRole

    dashboardData: BrokerDashboardResponse

    dateToday = new Date()
    threeMonthsFromToday = new Date()
    dateRange;

    basicData: any;
    basicOptions: any;
    clients
    stages

    selectedAverageBrokerTat: ILov<number>;

    averageBrokerTat: ILov[] = []


    optionsProducts: ILov[] = []
    selectedProducts: ILov[] = []

    selectedProduct;

    optionsForTat: ILov<number>[] = []

    optionsBrokerDashboardGraphs: ILov[] = []
    days;
    hours;
    remainingMinutes;
    roundedRemainingMinutes;
    roundedRemainingSeconds;
    selectBrokerDashboardGraph: AllowedBrokerDashboardGraphs = AllowedBrokerDashboardGraphs.PRODUCT_WISE_COUNT_GRAPH
    isAllowedCreateQuote: boolean
    returnUrl: string;
    isMobile: boolean = false;
    carouselCards: carouselCardsProps[] = []
    displayCalendar: boolean = false;
    selectedClients: any;
    quoteCreationForm: FormGroup;

    constructor(
        private quoteService: QuoteService,
        private router: Router,
        private dialogService: DialogService,
        private productService: ProductService,
        private accountService: AccountService,
        private appService: AppService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private deviceService: DeviceDetectorService,
        private clientService: ClientService

    ) {
        this.isMobile = this.deviceService.isMobile();
        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                if (user) {
                    this.user = user;
                    this.role = user.roleId as IRole;

                    if (![
                        // AllowedRoles.BROKER_ADMIN,
                        // AllowedRoles.BROKER_APPROVER,
                        AllowedRoles.INSURER_RM,
                        AllowedRoles.OPERATIONS,
                        AllowedRoles.INSURER_ADMIN,
                        AllowedRoles.INSURER_UNDERWRITER,
                        // AllowedRoles.BROKER_CREATOR,
                        // AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                        // AllowedRoles.AGENT_CREATOR,
                        // AllowedRoles.AGENT_CREATOR_AND_APPROVER,
                        AllowedRoles.SALES_APPROVER,
                        AllowedRoles.PLACEMENT_APPROVER,
                        AllowedRoles.PLACEMENT_CREATOR
                    ].includes(this.role.name)) {
                        this.isAllowedCreateQuote = true
                    }
                }
            }
        })
    }
    AllowedQuoteStates = AllowedQuoteStates
    AllowedBrokerDashboardGraphs = AllowedBrokerDashboardGraphs

    JSON = JSON

    rangeChanged($event) {
        console.log($event);

        this.prepareDashboard({
            startDate: $event[0],
            endDate: $event[1],
        })
        // this.dateRange[0].toLocaleDateString('en-UK')
        if ($event[0] != null && $event[1] != null) {
            const dateArray = [$event[0].toLocaleDateString('en-UK'), $event[1].toLocaleDateString('en-UK')]
            console.log("Normal", dateArray)
            console.log("stringyfy", JSON.stringify(dateArray))
            console.log("parse", JSON.parse(JSON.stringify(dateArray)))
            localStorage.setItem("DaterangeSelected", JSON.stringify(dateArray))
        }

    }
    lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {},
        globalFilter: null,
        multiSortMeta: null
    }

    ngOnInit(): void {

        console.log(this.user);
        console.log(this.user.partnerId.brokerModeStatus != true)

        if (!this.user?.acceptedTermsAndConditions) {
            this.termandconditionpop();
        }

        // else if (this.user?.passwordExpiresAt){
        //         let passwordExpiresAt = new Date(this.user.passwordExpiresAt)
        //         if (passwordExpiresAt.getTime() - this.dateToday.getTime() < 24 * 60 * 60 * 1000 || !this.user?.lastLogin) {
        //             this.openResetPasswordPopup();  
        //             // this.termandconditionpop();  
        //         }
        // }
        if (this.user?.passwordExpiresAt) {
            let passwordExpiresAt = new Date(this.user.passwordExpiresAt)
            if (passwordExpiresAt.getTime() - this.dateToday.getTime() < 24 * 60 * 60 * 1000 || !this.user?.lastLogin) {
                this.openResetPasswordPopup();
            }
        }




        this.optionsBrokerDashboardGraphs = [
            { label: 'Product Wise Count Graph', value: AllowedBrokerDashboardGraphs.PRODUCT_WISE_COUNT_GRAPH },
            { label: 'Product Wise Tat Graph', value: AllowedBrokerDashboardGraphs.PRODUCT_WISE_TAT_GRAPH },
        ]

        this.role = this.user.roleId as IRole;

        // if(localStorage.getItem('DaterangeSelected')){
        //     const storedArrayString = localStorage.getItem('DaterangeSelected');
        //     const storedArray = JSON.parse(storedArrayString).map(item => new Date(item.split('/').reverse().join('-')))
        //     console.log(storedArray);
        //     this.dateRange = [
        //         storedArray[0],
        //         storedArray[1]
        //     ]
        // }else{
        //     this.threeMonthsFromToday.setDate(this.dateToday.getDate() - 7);
        //     const threeMonthsFromToday = new Date(this.threeMonthsFromToday.getFullYear(), this.threeMonthsFromToday.getMonth(), this.threeMonthsFromToday.getDate());
        //     const dateToday = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate());

        //     this.dateRange = [
        //         threeMonthsFromToday,
        //         dateToday,
        //     ]
        // }

        if (localStorage.getItem('DaterangeSelected')) {
            const storedArrayString = localStorage.getItem('DaterangeSelected');
            const storedArray = JSON.parse(storedArrayString).map(item => new Date(item.split('/').reverse().join('-')));
            console.log(storedArray);
            this.dateRange = [
                storedArray[0],
                storedArray[1]
            ];
        } else {
            this.threeMonthsFromToday.setDate(this.dateToday.getDate() - 7);

            const threeMonthsFromToday = new Date(this.threeMonthsFromToday.getFullYear(), this.threeMonthsFromToday.getMonth(), this.threeMonthsFromToday.getDate());
            const dateToday = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), this.dateToday.getDate());

            this.dateRange = [
                threeMonthsFromToday,
                dateToday,
            ]
        }

        this.productService.searchOptionsProducts().then((response) => {
            this.selectedProducts = response
            this.optionsProducts = response

            this.prepareDashboard({
                startDate: this.dateRange[0],
                endDate: this.dateRange[1],
            })
        })
        //this.handleBrokerTatOption("Started Requision");
        this.clientService.getMany(this.lazyLoadEvent).subscribe({
            next: (dto) => {
                const optionsClients = dto.data.entities;
                this.selectedClients = optionsClients.map(item => item._id);
            }
        })
    }

    openResetPasswordPopup() {
        const ref1 = this.dialogService.open(ResetPasswordPopupDialogComponent, {
            header: 'Important!',
            width: this.isMobile ? '350px' : '500px',
            styleClass: 'flatPopup',
            data: {
                lastLogin: this.user?.lastLogin
            },
            closable: false,
            closeOnEscape: false
        })

        ref1.onClose.subscribe((value) => {
            if (value == 'closed') {
                ref1.close();
                this.accountService.logout();
            }
            if (value == 'changed') {
                this.dialogService.dialogComponentRefMap.forEach(dialog => {
                    dialog.destroy();
                });
                this.accountService.logout();
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Password Changed Sucessfully`,
                    life: 3000
                });
            }
        })
    }

    termandconditionpop() {
        console.log("i am in");
        const ref1 = this.dialogService.open(TermAndConditionDialogComponent, {
            // header: 'Important!',
            width: this.isMobile ? '400px' : '330px',
            height: this.isMobile ? '400px' : '425px',
            styleClass: 'flatPopup',
            data: {
                // lastLogin: this.user?.lastLogin
            },
            closable: false,
            closeOnEscape: false
        })
    }

    handleBrokerTatOption($event) {

        console.log($event)
        console.log(this.averageBrokerTat)
        console.log(this.averageBrokerTat.find((item) => item.label == $event.value.label))

        const selectedAverageBrokerTat = this.optionsForTat.find((item) => item.label == $event.value.label)
        this.days = Math.floor(selectedAverageBrokerTat.value / 1440);
        this.hours = Math.floor((selectedAverageBrokerTat.value % 1440) / 60);
        const remainingMinutes = selectedAverageBrokerTat.value % 60;
        this.remainingMinutes = remainingMinutes;
        this.roundedRemainingMinutes = Math.round(remainingMinutes);

        const remainingSeconds = remainingMinutes % 60;
        this.roundedRemainingSeconds = Math.round(remainingSeconds);


        console.log(`${this.days} days, ${this.hours} hours, ${this.roundedRemainingMinutes} minutes, ${this.roundedRemainingSeconds} seconds`);
        console.log("selectedAverageBrokerTat", this.selectedAverageBrokerTat)
    }



    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes)

        // this.prepareDashboard({
        //     startDate: this.dateRange[0],
        //     endDate: this.dateRange[1],
        // })

    }

    productWiseFilterChanged() {
        this.prepareDashboard({
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
        })
    }

    setSelectedBrokerDashboardGraph(item) {
        console.log(item)
        this.selectBrokerDashboardGraph = item
        this.prepareDashboard({
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
        })

    }
    setSelectedProduct(item) {
        console.log(item)
        this.selectedProduct = item
        this.prepareDashboard({
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
        })

    }


    prepareDashboard({ startDate, endDate }: BrokerDashboardRequest) {

        if (endDate) {
            /*             console.log(new Date(endDate.setHours(23)));
                        endDate = new Date(endDate.setMinutes(23)); */
        }
        startDate.setHours(0, 0);
        endDate.setHours(23, 59)
        this.quoteService.dashboard({
            startDate: startDate,
            endDate: endDate,
        }).subscribe({
            next: (dto: IOneResponseDto<BrokerDashboardResponse>) => {

                this.dashboardData = dto.data.entity
                this.optionsForTat = this.dashboardData.averageBrokerTat

                this.selectedAverageBrokerTat = this.optionsForTat[0] ?? null
                this.days = Math.floor(this.selectedAverageBrokerTat.value / 1440);
                this.hours = Math.floor((this.selectedAverageBrokerTat.value % 1440) / 60);
                const remainingMinutes = this.selectedAverageBrokerTat.value % 60;
                this.remainingMinutes = remainingMinutes;
                this.roundedRemainingMinutes = Math.round(remainingMinutes);

                const remainingSeconds = remainingMinutes % 60;
                this.roundedRemainingSeconds = Math.round(remainingSeconds);

                this.clients = this.dashboardData.clients.filter(client => client.pendingQuotes > 0).slice(0, 5);
                this.stages = this.dashboardData.stages.slice(0, 5)

                switch (this.selectBrokerDashboardGraph) {
                    case AllowedBrokerDashboardGraphs.PRODUCT_WISE_COUNT_GRAPH:
                        this.basicData = {
                            labels: this.dashboardData.productWiseCountGraph.filter((item) => this.selectedProducts.map((product) => product.label).includes(item.label)).map((item) => item.label),
                            datasets: [
                                {
                                    label: 'Number of Quotes',
                                    data: this.dashboardData.productWiseCountGraph.filter((item) => this.selectedProducts.map((product) => product.label).includes(item.label)).map((item) => item.value),
                                    fill: false,
                                    borderColor: '#0064BB',
                                    tension: .4
                                },

                            ]
                        };
                        break;
                    case AllowedBrokerDashboardGraphs.PRODUCT_WISE_TAT_GRAPH:
                        this.basicData = {
                            // labels: this.dashboardData.productWiseCountGraph.map((item) => item.label),
                            // labels: this.dashboardData.productWiseCountGraph.filter((item) => this.selectedProducts.map((product) => product.label).includes(item.label)).map((item) => item.label),
                            labels: this.dashboardData.productWiseTatGraph.find(product => product.id == this.selectedProduct)?.value?.map((item) => item.label),
                            datasets: [
                                {
                                    label: 'Stage Wise Average Tat in Minutes',
                                    // data: this.dashboardData.productWiseCountGraph.filter((item) => this.selectedProducts.map((product) => product.label).includes(item.label)).map((item) => item.value),
                                    data: this.dashboardData.productWiseTatGraph.find(product => product.id == this.selectedProduct)?.value?.map((item) => item.value?.toFixed(2)),
                                    // data: this.dashboardData.productWiseCountGraph.map((item) => item.value),
                                    fill: false,
                                    borderColor: '#0064BB',
                                    tension: .4
                                },

                            ]
                        };
                        break;
                }

                const darkTheme = JSON.parse(localStorage.getItem('isDarkTheme'))
                if (!darkTheme) {
                    this.basicOptions = {
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#333333'
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: '##333333'
                                },
                                grid: {
                                    color: '#ebedef'
                                }
                            },
                            y: {
                                ticks: {
                                    color: '#333333'
                                },
                                grid: {
                                    color: '#ebedef'
                                }
                            }
                        }
                    };
                } else {
                    this.basicOptions = {
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#ffffff'
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: '#ffffff'
                                },
                                grid: {
                                    color: '#ffffff'
                                }
                            },
                            y: {
                                ticks: {
                                    color: '#ffffff'
                                },
                                grid: {
                                    color: '#ffffff'
                                }
                            }
                        }
                    };
                }

                if (this.isMobile) {
                    this.carouselCards = []
                    if (this.dashboardData?.quotesOpenedCard) this.carouselCards.push({
                        label: 'QUOTES OPEN',
                        value: this.dashboardData?.quotesOpenedCard?.value,
                        subvalue: this.dashboardData?.quotesOpenedCard?.subValue,
                        navigateFunction: () => this.openAllOpenQuotes(),
                        navigateFunctionLabel: 'View all open quotes',
                        imageURL: 'assets/dashboard/quotes_open.png',
                        iscurrency: false,
                        isTat: false
                    })
                    if (this.dashboardData?.quotesPendingWithInsurerCard) this.carouselCards.push({
                        label: 'PENDING WITH INSURER',
                        value: this.dashboardData?.quotesPendingWithInsurerCard?.value,
                        subvalue: this.dashboardData?.quotesPendingWithInsurerCard?.subValue,
                        navigateFunction: () => this.openPendingInsurerQuotes(),
                        navigateFunctionLabel: 'View all pending quotes',
                        imageURL: 'assets/dashboard/pending_with_insurer.png',
                        iscurrency: false,
                        isTat: false
                    })
                    if (this.dashboardData?.quotesPlacedCard) this.carouselCards.push({
                        label: 'QUOTES PLACED',
                        value: this.dashboardData?.quotesPlacedCard?.value,
                        subvalue: this.dashboardData?.quotesPlacedCard?.subValue,
                        navigateFunction: () => this.openPlacedQuotes(),
                        navigateFunctionLabel: 'View all placed quotes',
                        imageURL: 'assets/dashboard/quotes_placed.png',
                        iscurrency: false,
                        isTat: false
                    })
                    if (this.dashboardData?.quotesPlacedRatioCard) this.carouselCards.push({
                        label: 'TAT:',
                        value: this.dashboardData?.quotesPlacedRatioCard?.value,
                        subvalue: this.dashboardData?.quotesPlacedRatioCard?.subValue,
                        imageURL: 'assets/dashboard/Tat.png',
                        iscurrency: false,
                        isTat: true
                    })
                    if (this.dashboardData?.totalPremiumOfAllQuotesCard) this.carouselCards.push({
                        label: 'TOTAL PREMIUM OF ALL QUOTES (Incl. Taxes)',
                        sublabel: '(within date range)',
                        value: this.dashboardData?.totalPremiumOfAllQuotesCard?.value,
                        imageURL: 'assets/dashboard/premium.png',
                        iscurrency: true,
                        isTat: false
                    })
                    if (this.dashboardData?.totalComissionTillDateCard) this.carouselCards.push({
                        label: 'TOTAL COMMISSION TILL DATE',
                        value: this.dashboardData?.totalComissionTillDateCard?.value,
                        imageURL: 'assets/dashboard/commission.png',
                        iscurrency: true,
                        isTat: false
                    })
                }
                this.carouselCards = [...this.carouselCards]
            }
        })

    }


    openAllOpenQuotes() {

        const product = this.optionsProducts.map((ele) => ele.value);
        const url = '/backend/quotes' +
            '?stage=' + encodeURIComponent(JSON.stringify([
                AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE
            ])) +
            '&date=' + encodeURIComponent(JSON.stringify([
                this.dateRange[0].toLocaleDateString('en-UK'),
                this.dateRange[1].toLocaleDateString('en-UK')
            ])) +
            '&productId=' + encodeURIComponent(JSON.stringify(
                product
            )) +
            '&clientId=' + encodeURIComponent(JSON.stringify(
                this.selectedClients
            ));
        this.router.navigateByUrl(url);

    }


    openPlacedQuotes() {
        const product = this.optionsProducts.map((ele) => ele.value);
        const url = '/backend/quotes' +
            '?stage=' + encodeURIComponent(JSON.stringify([
                AllowedQuoteStates.PLACEMENT,
            ])) +
            '&date=' + encodeURIComponent(JSON.stringify([
                this.dateRange[0].toLocaleDateString('en-UK'),
                this.dateRange[1].toLocaleDateString('en-UK')
            ])) +
            '&productId=' + encodeURIComponent(JSON.stringify(
                product
            )) +
            '&clientId=' + encodeURIComponent(JSON.stringify(
                this.selectedClients
            ));
        this.router.navigateByUrl(url);

    }

    openPendingInsurerQuotes() {
        const product = this.optionsProducts.map((ele) => ele.value);
        const url = '/backend/quotes' +
            '?stage=' + encodeURIComponent(JSON.stringify([
                AllowedQuoteStates.SENT_TO_INSURER_RM
            ])) +
            '&date=' + encodeURIComponent(JSON.stringify([
                this.dateRange[0].toLocaleDateString('en-UK'),
                this.dateRange[1].toLocaleDateString('en-UK')
            ])) +
            '&productId=' + encodeURIComponent(JSON.stringify(
                product
            )) +
            '&clientId=' + encodeURIComponent(JSON.stringify(
                this.selectedClients
            ));
        this.router.navigateByUrl(url);
    }

    openClientWisePendingQuotes(client) {
        console.log(client)
        this.router.navigateByUrl('/backend/quotes?clientId=' + JSON.stringify([
            client.clientId
        ]) + '&stage=' + JSON.stringify([
            // AllowedQuoteStates.DRAFT,
            AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
            AllowedQuoteStates.WAITING_FOR_APPROVAL,
            AllowedQuoteStates.SENT_TO_INSURER_RM,
            AllowedQuoteStates.UNDERWRITTER_REVIEW,
            AllowedQuoteStates.QCR_FROM_UNDERWRITTER,
            AllowedQuoteStates.PENDING_PAYMENT,
        ])
            + '&date=' + this.JSON.stringify([
                this.dateRange[0].toLocaleDateString('en-UK'),
                this.dateRange[1].toLocaleDateString('en-UK')])
        );
    }

    showCalendar() {
        this.displayCalendar = true;
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
        }
    }

    openRiskCoverLetterDialog(quote: IQuoteSlip) {
        const ref = this.dialogService.open(RiskCoverLetterDialogComponent, {
            header: '',
            width: '800px',
            styleClass: 'flatPopup'
        });

        ref.onClose.subscribe(() => {
            // this.router.navigateByUrl(`/`);
        })
    }


    openQuoteForBrokerCreator(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            case AllowedQuoteStates.DRAFT:
                this.router.navigateByUrl(this.appService.routes.quotes.draft(quote._id))
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.router.navigateByUrl(this.appService.routes.quotes.requisition(quote._id))
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
                this.router.navigateByUrl(this.appService.routes.quotes.draft(quote._id))
                break;
            case AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE:
                this.router.navigateByUrl(this.appService.routes.quotes.requisition(quote._id))
                break;
            case AllowedQuoteStates.WAITING_FOR_APPROVAL:
                this.router.navigateByUrl(this.appService.routes.quotes.requisition(quote._id))
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.router.navigateByUrl(this.appService.routes.quotes.comparisionReviewDetailed(quote._id))
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openChoosePaymentMethodDialogComponent(quote)
                break;
            case AllowedQuoteStates.PLACEMENT:
                this.openRiskCoverLetterDialog(quote)
                break;
        }
    }

    openChoosePaymentMethodDialogComponent(quote: IQuoteSlip) {

        this.quoteService.get(quote._id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                this.quoteService.setQuote(dto.data.entity)
                // console.log(dto.data.entity)
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


    openQuoteForOperations(quote: IQuoteSlip) {
        switch (quote.quoteState) {
            // case AllowedQuoteStates.DRAFT:
            //     this.routerService.navigateByUrl(`/backend/quotes/${quote._id}`)
            //     break;
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
                this.router.navigateByUrl(this.appService.routes.quotes.requisition(quote._id))
                break;
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.openQuoteSlipDialog(quote)
                break;
            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                this.router.navigateByUrl(this.appService.routes.quotes.comparisionReviewDetailed(quote._id))
                break;
            case AllowedQuoteStates.PENDING_PAYMENT:
                this.openQuoteSlipDialog(quote)
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
                this.router.navigateByUrl(this.appService.routes.quotes.edit(quote._id))
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
                                // console.log(quote[`underWriter${index}Stage`]);
                                currentUnderwritterLevel = index;

                            }
                            // console.log(`underWriter${index}Stage`)
                        })

                        // console.log(currentUnderwritterLevel)
                        // console.log(this.user['underWriterLevel'])
                        // console.log(this.user['_id'])
                        // console.log(quote[`underWriter${currentUnderwritterLevel}`])

                        if (currentUnderwritterLevel == this.user['underWriterLevel'] && this.user['_id'] == quote[`underWriter${currentUnderwritterLevel}`]['_id']) {
                            // console.log('index', currentUnderwritterLevel);
                            // console.log('_id', this.user['_id']);
                            // console.log('underWriterLevel', this.user['underWriterLevel']);
                            // console.log(quote[`underWriter${currentUnderwritterLevel}Stage`]);
                            // console.log(quote[`underWriter${currentUnderwritterLevel}`]);

                            // if (dto.data.entity.brokerWiseQuotes) {
                            // alert('Found Multiple Quotes')
                            console.log(quote?.productId['productTemplate'])

                            if (quote?.productId['productTemplate'] == AllowedProductTemplate.FIRE) {
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
                                                // contentStyle: { "max-height": "400px", "overflow": "auto" },
                                                // baseZIndex: 10000
                                            });

                                            ref2.onClose.subscribe((selectedBrokers) => {

                                                // console.log()
                                                if (selectedBrokers) this.router.navigateByUrl(`/backend/quotes/${quote._id}/compare-and-analytics?${stringify({ selectedBrokerQuotes: JSON.stringify(selectedBrokers) })}`)
                                            })
                                        } else {
                                            this.router.navigateByUrl(this.appService.routes.quotes.edit(quote._id))
                                        }
                                    }
                                })
                            } else {
                                this.router.navigateByUrl(this.appService.routes.quotes.edit(quote._id))
                            }

                            // }


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



    openQuote(quoteId) {


        if (quoteId) {
            this.quoteService.get(quoteId, {
                allCovers: true,

            }).subscribe({
                next: (dto: IOneResponseDto<IQuoteSlip>) => {

                    const quote = dto.data.entity

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
            })

        }

    }
    selectedData(event) {
        if (this.basicData['labels'][event.element.index]) {
            let res = this.selectedProducts.filter((ele) => ele.label == this.basicData['labels'][event.element.index]).map(v => v.value);
            this.router.navigate(['/backend/quotes'], {
                queryParams: {
                    productId: JSON.stringify(res)
                }
            });

        }
    }
    clientWisePendingQuote(client: any) {
        const product = this.optionsProducts.map((ele) => ele.value);
        const clientId = this.clients.filter((res) => res.clientId == client['clientId']).map(v => v.clientId);
        const url = '/backend/quotes' +
            '?stage=' + encodeURIComponent(JSON.stringify([
                AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE,
            ])) +
            '&productId=' + encodeURIComponent(JSON.stringify(
                product
            )) +
            '&clientId=' + encodeURIComponent(JSON.stringify(
                clientId
            ));
        this.router.navigateByUrl(url);
    }

    createQuote() {

        const updatePayload = { ...this.quoteCreationForm?.value };
        if (this.user.partnerId["brokerModeStatus"] == true) {
            updatePayload["brokerModuleQuote"] = true // broker module
        } else {
            updatePayload["brokerModuleQuote"] = false // broker module
        }

        this.quoteService.create(updatePayload).subscribe({
            next: quote => {
                console.log(quote.data.entity._id)
                this.router.navigateByUrl(`backend/quotes/${quote.data.entity._id}`);
            },
            error: error => {
                console.log(error);
            }
        });
    }
}
