import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { IListOfValueMaster, OPTIONS_LIST_OF_VALUES, OPTIONS_LOV_REFERENCES } from '../list-of-value-master.model';
import { ListOfValueMasterService } from '../list-of-value-master.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from '../../user/user.model';

@Component({
    selector: 'app-list-of-value-master-form',
    templateUrl: './list-of-value-master-form.component.html',
    styleUrls: ['./list-of-value-master-form.component.scss']
})
export class ListOfValueMasterFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;
    optionsParentLovId: ILov[] = []

    optionsProducts: ILov[] = [];
    optionsPratnerId: ILov[] = [];


    optionsLovTypes: ILov[] = []
    optionsLovReference: ILov[] = []

    recordSingularName = "List Of Value Master";
    recordPluralName = "List Of Values Master";
    modulePath: string = "/backend/admin/list-of-value-master";
    listRoute: string = '';
    user: IUser;

    constructor(
        private recordService: ListOfValueMasterService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private partnerService: PartnerService,
        private accountService: AccountService,
        private messageService : MessageService

    ) {
        this.optionsLovTypes = OPTIONS_LIST_OF_VALUES;
        this.optionsLovReference = OPTIONS_LOV_REFERENCES;
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
                next: (dto: IOneResponseDto<IListOfValueMaster>) => {
                    /* this.breadcrumbService.setItems([
                      { label: "Pages" },
                      {
                        label: `${dto.data.entity.name}`,
                        routerLink: [`${this.modulePath}/new`]
                      }
                    ]); */

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
        if(this.listRoute == 'dropdown-list') {
            this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('BSC_'))
        }
    }

    createForm(item?: IListOfValueMaster) {

        console.log(item)

        const parent: IListOfValueMaster = item?.parentLovId as IListOfValueMaster;

        const product: IProduct = item?.productId as IProduct

        const partnerId = item?.partnerId as IPartner;
        console.log(item)
        console.log(product)

        this.recordForm = this.formBuilder.group({
            _id: [item?._id],
            partnerId: [partnerId ? { label: partnerId.name, value: partnerId._id } : null, [Validators.required]],

            // sequenceNumber: [item?.sequenceNumber],
            lovType: [item?.lovType, [Validators.required]],
            lovKey: [item?.lovKey, [Validators.required]],
            lovValue: [item?.lovValue, [Validators.min(0), Validators.max(100)]],
            // lovReference: [item?.lovReference, []],
            lovReferences: [item?.lovReferences, []],
            productId: [product ? { label: product.type, value: product._id } : null, []],
            // parentLovType: [item?.parentLovType],
            parentLovId: [parent ? { label: `${parent?.lovType} - ${parent?.lovKey}`, value: parent?._id } : null],
            // children: [item?.children]
            taskStatus : [{value : item?.taskStatus ?? null,disabled : true}] ,
            failedMessage : [{value : item?.failedMessage,disabled : true}],
            fromSI : [item?.fromSI ?? 0, (this.listRoute == 'dropdown-list') ? Validators.required : []],
            toSI : [item?.toSI ?? 0 ,(this.listRoute == 'dropdown-list') ? Validators.required : []],
            isRequired:[item?.isRequired ?? false],
            isRemark:[item?.isRemark ?? false],
            maxEmployeeNo : [item?.maxEmployeeNo ?? 0],
            EmployeeMinLimit: [item?.EmployeeMinLimit ?? 0],
            EmployeemaxLimit: [item?.EmployeemaxLimit ?? 0],
            // otcRangeFrom : [],
            // otcRangeTo : [],
            perEmployeeLimit : [item?.perEmployeeLimit ?? 0],
            active: [item?.active || false]

        });
    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        console.log(this.recordForm.value['fromSI'])
        console.log(this.listRoute)
        
        if (this.recordForm.value['fromSI'] >= this.recordForm.value['toSI'] && this.listRoute == 'dropdown-list') {
            this.messageService.add({
                // key: "error",
                severity: "error",
                summary: "Error",
                detail: `FromSI cannot be greater than equal to toSI`,
                life: 3000
            });
        } else {
            if (this.recordForm.valid) {
                console.log("Inside")
                const updatePayload = { ...this.recordForm.value };
                updatePayload['parentLovId'] = updatePayload?.parentLovId?.value;
                updatePayload['productId'] = updatePayload?.productId?.value;
                updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
                updatePayload["lovReferences"] = updatePayload["lovReferences"] ?? []

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
                }
            }
        }
    }

    searchoptionsParentLovId(e) {
        let  lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows:100,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                partnerId: [
                    {
                        value: this.recordForm.controls['partnerId']?.value?.value,
                        matchMode: "equals",
                        operator: "or"
                    },
                ],
                // Add productId filter
                // @ts-ignore
                productId: [
                    {
                        value: this.recordForm.controls['productId']?.value?.value,  // Replace with the actual value or variable
                        matchMode: "equals",  // Modify matchMode as needed
                        operator: "and"
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
