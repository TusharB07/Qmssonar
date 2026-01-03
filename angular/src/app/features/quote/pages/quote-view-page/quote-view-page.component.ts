import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedQuoteStates } from 'src/app/features/admin/quote/quote.model';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { KanbanStages } from './sub-view-kanban/sub-view-kanban.component';
import { ProductService } from 'src/app/features/admin/product/product.service';
import { LazyLoadEvent } from 'primeng/api';
import { ClientService } from 'src/app/features/admin/client/client.service';
import { ILov, IManyResponseDto } from 'src/app/app.model';
import { IProduct } from 'src/app/features/admin/product/product.model';
import { IClient } from 'src/app/features/admin/client/client.model';
import { UserService } from 'src/app/features/admin/user/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormGroup } from '@angular/forms';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

export enum AllowedQuoteView {
    KANBAN = 'kanban',
    TABLE = 'table',
    FLIP = 'flip',
}

export enum AllowedBreakup {
    REVENUE = 'Revenue',
    TURNOVER = 'Turnover',
}

@Component({
    selector: 'app-quote-view-page',
    templateUrl: './quote-view-page.component.html',
    styleUrls: ['./quote-view-page.component.scss']
})
export class QuoteViewPageComponent implements OnInit {

    selectedViewType: AllowedQuoteView

    isAllowedCreateQuote: boolean
    isAllowedUserFilter: boolean
    dateToday = new Date();
    oneMonthsFromToday = new Date();
    dateRange = [];
    queryParam;
    isQueryParamActive: boolean = false;
    isMobile: boolean = false;
    displayFilters: boolean = false;

    paramsValue: any;

    optionsViewTypes = [
        { label: 'Kanban', code: AllowedQuoteView.KANBAN, icon: 'pi pi-list' },
        { label: 'Table', code: AllowedQuoteView.TABLE, icon: 'pi pi-table' },
    ];

    optionsQuoteStages: AllowedQuoteStates[]
    optionsUsers: IUser[]
    optionsProducts: ILov[] = []
    optionsClients: IClient[]

    selectedQuoteStages: AllowedQuoteStates[]
    selectedUsers: any[]
    selectedProducts: any[]
    selectedClients: any[]

    user: IUser
    role: IRole
    quoteCreationForm: FormGroup;
    unSelectedQuoteStages: AllowedQuoteStates[];
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private productService: ProductService,
        private clientService: ClientService,
        private userService: UserService,
        private deviceService: DeviceDetectorService,
        private quoteService: QuoteService,

    ) {

        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                this.role = user.roleId as IRole;

                if ([
                    // AllowedRoles.BROKER_ADMIN,
                    // AllowedRoles.BROKER_APPROVER,
                    AllowedRoles.BROKER_CREATOR,
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                    AllowedRoles.AGENT_CREATOR,
                    AllowedRoles.AGENT_CREATOR_AND_APPROVER,
                    AllowedRoles.BANCA_CREATOR,
                    AllowedRoles.BANCA_APPROVER,
                    AllowedRoles.BANCA_CREATOR_AND_APPROVER,
                    AllowedRoles.SALES_CREATOR,
                    AllowedRoles.SALES_CREATOR_AND_APPROVER,
                    // AllowedRoles.PLACEMENT_CREATOR,
                    // AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
                ].includes(this.role.name)) {
                    this.isAllowedCreateQuote = true
                }

                if ([
                    AllowedRoles.BROKER_APPROVER,
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                    AllowedRoles.BANCA_CREATOR,
                    AllowedRoles.BANCA_APPROVER,
                    AllowedRoles.BANCA_CREATOR_AND_APPROVER,
                    AllowedRoles.INSURER_UNDERWRITER,
                    AllowedRoles.SALES_APPROVER,
                    AllowedRoles.SALES_CREATOR_AND_APPROVER,
                    AllowedRoles.PLACEMENT_APPROVER,
                    AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
                    // AllowedRoles.INSURER_ADMIN,
                    // AllowedRoles.BANCA_ADMIN,
                ].includes(this.role.name)) {
                    this.isAllowedUserFilter = true
                }

            }
        })

        if (localStorage.getItem('DaterangeSelected')) {
            const storedArrayString = localStorage.getItem('DaterangeSelected');
            const storedArray = JSON.parse(storedArrayString).map(item => new Date(item.split('/').reverse().join('-')))
            this.dateRange = [
                storedArray[0],
                storedArray[1]
            ]
        } else {
            this.oneMonthsFromToday.setDate(this.dateToday.getDate() - 7);
            this.dateRange = [
                this.oneMonthsFromToday,
                this.dateToday,
            ]
        }


        this.activatedRoute.queryParamMap.subscribe({
            next: (params) => {
                this.setView(params.get('view'))
            }
        })

        this.activatedRoute.queryParamMap.subscribe({
            next: (params) => {

                const stages = JSON.parse(params.get('stage') ?? '[]');
                const products = JSON.parse(params.get('productId') ?? '[]');
                const clients = JSON.parse(params.get('clientId') ?? '[]');
                const users = JSON.parse(params.get('userId') ?? '[]');
                const date = JSON.parse(params.get('date')) ?? [this.dateRange[0].toLocaleDateString('en-UK'), this.dateRange[1].toLocaleDateString('en-UK')];
                this.dateRange = [
                    new Date(date[0].split('/').reverse().join('-')),
                    new Date(date[1].split('/').reverse().join('-'))
                ]
                this.selectedQuoteStages = stages.length > 0 ? stages : Object.values(AllowedQuoteStates);
                if (this.selectedQuoteStages.length == 10 && stages.length != 10) {
                    this.selectedQuoteStages.splice(8, 1);
                }
                this.selectedProducts = products.length > 0 ? products : [];
                this.selectedClients = clients.length > 0 ? clients : [];
                this.selectedUsers = users.length > 0 ? users : [];

                this.isQueryParamActive = (stages.length > 0 || products.length > 0 || clients.length > 0 || users.length > 0) ? true : false;
                if (!this.isQueryParamActive) {
                    this.isAllowedUserFilter ? this.getAllUsers() : null;
                    this.getAllClients();
                    this.getAllProducts();
                }

                this.queryParam = {
                    view: this.selectedViewType,
                    stage: JSON.stringify(this.selectedQuoteStages),
                    productId: JSON.stringify(this.selectedProducts),
                    userId: JSON.stringify(this.selectedUsers),
                    clientId: JSON.stringify(this.selectedClients),
                    date: JSON.stringify(date),
                }
            }
        })
        this.activatedRoute.queryParamMap.subscribe((data) => {
            this.paramsValue = data['params']['product'];
        });

    }

    AllowedQuoteView = AllowedQuoteView
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
        this.isMobile = this.deviceService.isMobile();
        this.optionsQuoteStages = Object.values(AllowedQuoteStates)

        this.setView(this.activatedRoute.snapshot.queryParams.view);

        const stages = JSON.parse(this.activatedRoute.snapshot.queryParams.stage ?? '[]');
        this.unSelectedQuoteStages = stages.length > 0 ? stages : [];
        this.selectedQuoteStages = stages.length > 0 ? stages : Object.values(AllowedQuoteStates);
        if (this.selectedQuoteStages.length == 10 && stages.length != 10) {
            this.selectedQuoteStages.splice(8, 1);
        }
        if (this.isQueryParamActive) {
            this.isAllowedUserFilter ? this.getAllUsers() : null;
            this.getAllClients();
            this.getAllProducts();
        }
    }

    getAllProducts() {
        this.productService.searchOptionsProducts().then(response => {
            this.optionsProducts = response;
            if (!this.isQueryParamActive) {
                // this.selectedProducts = this.optionsProducts.map(item => item.value);
                this.queryParam.productId = JSON.stringify(this.selectedProducts);
            }
        })
    }

    getAllUsers() {
        this.userService.getMany(this.lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IUser>) => {
                this.optionsUsers = dto.data.entities;
                if (!this.isQueryParamActive) {
                    // this.selectedUsers = this.optionsUsers.map(item => item._id);
                    this.queryParam.userId = JSON.stringify(this.selectedUsers);
                }
            }
        })
    }

    getAllClients() {
        this.clientService.getMany(this.lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IClient>) => {
                this.optionsClients = dto.data.entities;
                if (!this.isQueryParamActive) {
                    // this.selectedClients = this.optionsClients.map(item => item._id);
                    this.queryParam.clientId = JSON.stringify(this.selectedClients);
                }
            }
        })
    }

    changeView($event) {
        this.queryParam.view = $event
        this.queryParam.stage = JSON.stringify(this.selectedQuoteStages);
        this.router.navigate([], {
            queryParams: { ...this.queryParam }
        });
    }

    setView(view) {
        switch (view) {
            case AllowedQuoteView.KANBAN:
                this.selectedViewType = AllowedQuoteView.KANBAN;
                break;
            case AllowedQuoteView.TABLE:
                this.selectedViewType = AllowedQuoteView.TABLE;
                break;
            default:
                this.selectedViewType = AllowedQuoteView.KANBAN;
        }
    }


    updateQuoteStages($event, filterName: string) {
        switch (filterName) {
            case 'Stage':
                this.queryParam.stage = JSON.stringify($event);
                this.unSelectedQuoteStages = $event;
                break;
            case 'Product':
                this.queryParam.productId = JSON.stringify($event);
                this.selectedProducts = $event;
                break;
            case 'User':
                this.queryParam.userId = JSON.stringify($event);
                this.selectedUsers = $event;
                break;
            case 'Client':
                this.queryParam.clientId = JSON.stringify($event);
                this.selectedClients = $event;
                break;
        }
    
        this.router.navigate([], {
            queryParams: { ...this.queryParam }
        });
    }    

    // openCreateQuote() {
    //     this.router.navigateByUrl("/backend/quotes/new")
    // }

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

    rangeChanged($event) {
        if (this.dateRange[1] != null) {
            const filterDate = [this.dateRange[0].toLocaleDateString('en-UK'), this.dateRange[1].toLocaleDateString('en-UK')];
            this.queryParam.date = JSON.stringify(filterDate);
            this.router.navigate([], {
                queryParams: { ...this.queryParam }
            });
        }
        /* this.prepareDashboard({
            startDate: $event[0],
            endDate: $event[1],
        }) */
    }
}
