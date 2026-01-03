 import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';
import { AllowedProductTemplate, IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { IWCListOfValueMaster,WC_OPTIONS_LIST_OF_VALUES } from '../list-of-value-master.model';
import { WCListOfValueMasterService } from '../wc-list-of-value-master.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from '../../user/user.model';
import { AllowedOtcTypes, OPTIONS_ALLOWED_TYPES } from '../../product-partner-ic-configuration/product-partner-ic-configuration.model';
@Component({
    selector: 'app-wc-list-of-value-master-form',
    templateUrl: './wc-list-of-value-master-form.component.html',
    styleUrls: ['./wc-list-of-value-master-form.component.scss']
})
export class WCListOfValueMasterFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;
    optionsParentLovId: ILov[] = []

    optionsProducts: ILov[] = [];
    optionsPratnerId: ILov[] = [];
    optionsOtcType: ILov[] = [];

    optionsProductsList: IProduct[] = []
    productTemplate: string = ""
    AllowedProductTemplate: AllowedProductTemplate
    optionsLovTypes: ILov[] = []
    optionsLovReference: ILov[] = []

    recordSingularName = "List Of Value Master";
    recordPluralName = "List Of Values Master";
    modulePath: string = "/backend/admin/list-of-value-master";
    listRoute: string = '';
    user: IUser;

    constructor(
        private recordService: WCListOfValueMasterService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private partnerService: PartnerService,
        private accountService: AccountService,
        private messageService : MessageService

    ) {
        this.optionsOtcType = OPTIONS_ALLOWED_TYPES;
        this.optionsLovTypes = WC_OPTIONS_LIST_OF_VALUES;
        this.optionsLovReference = [];
        if(localStorage.getItem('prevRoute')) {
            this.listRoute = localStorage.getItem('prevRoute');
        }
    }

    ngOnInit(): void {

        this.accountService.currentUser$.subscribe({
            next: (user: IUser) => {
              this.user = user;
              console.log(this.user)
            }
          })
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IWCListOfValueMaster>) => {
                    
                    this.createForm(dto.data.entity);
                },
                error: e => {
                    console.log(e);
                }
            });
        } else {
            this.breadcrumbService.setItems([
                { label: "Pages" },
                {
                    label: `Add new ${this.recordSingularName}`,
                    routerLink: [`${this.modulePath}/new`]
                }
            ]);
        }

        // mode: New
        this.createForm();
        this.recordService.routeSource$.subscribe(prevRoute => {
            this.listRoute = prevRoute;
            console.log(this.listRoute)
            localStorage.setItem("prevRoute", this.listRoute);
        })
        if(this.listRoute == 'wc-dropdown-list') {
            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('WC_') || item.label.includes('D&O_') || item.label.includes('E&O_') || item.label.includes('CGL_')|| item.label.includes('PRODUCT_') || item.label.includes('CYBER_') || item.label.includes('PUBLIC_') || item.label.includes('CRIME_'))
        }
    }

    createForm(item?: IWCListOfValueMaster) {

        console.log(item)


        const product: IProduct = item?.productId as IProduct

        const partnerId = item?.partnerId as IPartner;
        console.log(item)
        console.log(product)
        const defaultOtcType =   { label: 'OTC', value: AllowedOtcTypes.OTC };
        const otcType = this.optionsOtcType.find((type) => type.value == item?.otcType)

        if (item) {
            if (product) {
                this.optionsLovTypes = WC_OPTIONS_LIST_OF_VALUES;

                const selectedProductTempalte = product.productTemplate;
                if (selectedProductTempalte) {
                    this.productTemplate = selectedProductTempalte;
                    switch (this.productTemplate) {
                        case AllowedProductTemplate.LIABILITY:
                            // Filter logic for LIABILITY
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('D&O_') );
                            break;
                    
                        case AllowedProductTemplate.LIABILITY_EANDO:
                            // Filter logic for LIABILITY_EANDO (D&O or E&O)
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('E&O_'));
                            break;
                    
                        case AllowedProductTemplate.LIABILITY_CGL:
                            // Filter logic for LIABILITY_CGL
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CGL_'));
                            break;
                    
                        case AllowedProductTemplate.LIABILITY_PRODUCT:
                            // Filter logic for LIABILITY_PRODUCT
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('PRODUCT_'));
                            break;
                    
                        case AllowedProductTemplate.LIABILITY_PUBLIC:
                            // Filter logic for LIABILITY_PUBLIC
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('PUBLIC_'));
                            break;
                    
                        case AllowedProductTemplate.LIABILITY_CYBER:
                            // Filter logic for LIABILITY_CYBER
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CYBER_'));
                            break;
                    
                        case AllowedProductTemplate.LIABILITY_CRIME:
                            // Filter logic for LIABILITY_CRIME
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CRIME_'));
                            break;
                    
                        case AllowedProductTemplate.WORKMENSCOMPENSATION:
                            // Filter logic for WORKMENSCOMPENSATION (WC)
                            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('WC_'));
                            break;
                    
                        default:
                            // Default or fallback logic if no specific case is matched
                            break;
                    }
                }
            }   
        }


        this.recordForm = this.formBuilder.group({
            _id: [item?._id],
            partnerId: [partnerId ? { label: partnerId.name, value: partnerId._id } : null, [Validators.required]],

            lovType: [item?.lovType, [Validators.required]],
            lovKey: [item?.lovKey, [Validators.required]],
            lovValue: [item?.lovValue],
            productId: [product ? { label: product.type, value: product._id } : null, []],
            taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
            failedMessage : [{value : item?.failedMessage,disabled : true}],
            fromSI : [item?.fromSI ?? 0],
            toSI : [item?.toSI ?? 0 ],
            EmployeeMinLimit: [item?.EmployeeMinLimit ?? 0],
            EmployeemaxLimit: [item?.EmployeemaxLimit ?? 0],
            perEmployeeLimit : [item?.perEmployeeLimit ?? 0],
            otcType: [otcType ? { label: otcType.label, value: otcType.value } : defaultOtcType, [Validators.required]],
        });
    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        console.log(this.recordForm.value['fromSI'])
        console.log(this.listRoute)
        
        // if (this.recordForm.value['fromSI'] >= this.recordForm.value['toSI'] && this.listRoute == 'wc-dropdown-list') {
        //     this.messageService.add({
        //         // key: "error",
        //         severity: "error",
        //         summary: "Error",
        //         detail: `FromSI cannot be greater than equal to toSI`,
        //         life: 3000
        //     });
        // } else {
            if (this.recordForm.valid) {
                console.log("Inside")
                const updatePayload = { ...this.recordForm.value };
                updatePayload['parentLovId'] = updatePayload?.parentLovId?.value;
                updatePayload['productId'] = updatePayload?.productId?.value;
                updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
                updatePayload["lovReferences"] = updatePayload["lovReferences"] ?? []
                updatePayload["otcType"] = updatePayload["otcType"].value;
                if (this.mode === "edit") {
                    this.recordService.update(this.id, updatePayload).subscribe({
                        next: partner => {
                            localStorage.removeItem('prevRoute');
                            this.router.navigateByUrl(`${this.modulePath}/${this.listRoute}`);
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                if (this.mode === "new") {
                    this.recordService.create(updatePayload).subscribe({
                        next: partner => {
                            localStorage.removeItem('prevRoute');
                            this.router.navigateByUrl(`${this.modulePath}/${this.listRoute}`);
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                //}
            }
        }
    }

    searchoptionsParentLovId(e) {
        let  lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                lovT: [
                    {
                        value: this.recordForm.controls['partnerId']?.value?.value,
                        matchMode: "startsWith",
                        operator: "or"
                    },
                ],

            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.recordService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsParentLovId = data.data.entities.map(entity => ({ label: `${entity.lovType} - ${entity.lovKey}`, value: entity._id }));
            },
            error: e => { }
        });
    }

    handleOnproductChange(event: any) {
        const selectedProduct = event;
        const selectedProductId = selectedProduct ? selectedProduct.value : null;
        if (selectedProductId) {
            this.optionsLovTypes = WC_OPTIONS_LIST_OF_VALUES;
            const selectedProductTempalte = this.optionsProductsList.find(product => product._id === selectedProductId).productTemplate;
            if (selectedProductTempalte) {
                this.productTemplate = selectedProductTempalte;


                switch (this.productTemplate) {
                    case AllowedProductTemplate.LIABILITY:
                        // Filter logic for LIABILITY
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('D&O_') );
                        break;
                
                    case AllowedProductTemplate.LIABILITY_EANDO:
                        // Filter logic for LIABILITY_EANDO (D&O or E&O)
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('E&O_'));
                        break;
                
                    case AllowedProductTemplate.LIABILITY_CGL:
                        // Filter logic for LIABILITY_CGL
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CGL_'));
                        break;
                
                    case AllowedProductTemplate.LIABILITY_PRODUCT:
                        // Filter logic for LIABILITY_PRODUCT
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('PRODUCT_'));
                        break;
                
                    case AllowedProductTemplate.LIABILITY_PUBLIC:
                        // Filter logic for LIABILITY_PUBLIC
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('PUBLIC_'));
                        break;
                
                    case AllowedProductTemplate.LIABILITY_CYBER:
                        // Filter logic for LIABILITY_CYBER
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CYBER_'));
                        break;
                
                    case AllowedProductTemplate.LIABILITY_CRIME:
                        // Filter logic for LIABILITY_CRIME
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CRIME_'));
                        break;
                
                    case AllowedProductTemplate.WORKMENSCOMPENSATION:
                        // Filter logic for WORKMENSCOMPENSATION (WC)
                        this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('WC_'));
                        break;
                
                    default:
                        // Default or fallback logic if no specific case is matched
                        break;
                }
                
                
            }
          
        }
    }


    searchOptionsProducts(event) {


        let  lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                type: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    },
                ],
                // @ts-ignore
                status: [
                    {
                        value: true,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]

            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.productService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsProductsList = data.data.entities;
                // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
                this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));

            },
            error: e => { }
        });
    }

    searchOptionsPartnerId(event) {


        event = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                // name: [
                //     {
                //         value: event.query,
                //         matchMode: "startsWith",
                //         operator: "and"
                //     }
                // ],
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.partnerService.getMany(event).subscribe({
            next: data => {
                this.optionsPratnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id , partnerType : entity.partnerType}));
                this.optionsPratnerId = this.optionsPratnerId.filter(item => item.partnerType == AllowedPartnerTypes.self)
            },
            error: e => { }
        });
    }

    onCancel() {
        this.recordService.setFilterValueExist(true);
        localStorage.removeItem('prevRoute');
        this.router.navigateByUrl(`${this.modulePath}/${this.listRoute}`);
    }

}
