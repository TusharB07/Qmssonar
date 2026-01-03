import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { ProductService } from "src/app/features/service/productservice";
import { IProduct } from "../../product/product.model";
import { IBscCover, OPTIONS_BSC_TYPES } from "../bsc-cover.model";
import { BscCoverService } from "../bsc-cover.service";
import { LazyLoadEvent } from "primeng/api";
import { PartnerService } from "../../partner/partner.service";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";
import { AccountService } from "src/app/features/account/account.service";
import { IRole } from "../../role/role.model";
import { IUser } from "../../user/user.model";

@Component({
    selector: 'app-bsc-cover-form',
    templateUrl: './bsc-cover-form.component.html',
    styleUrls: ['./bsc-cover-form.component.scss']
})
export class BscCoverFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;

    recordSingularName = "BSC Cover";
    recordPluralName = "BSC Covers";
    modulePath: string = "/backend/admin/bsc-covers";

    optionsProducts: ILov[] = [];
    optionsBscTypes: ILov[];

    
    // To Show Options of partners
    optionsPartners: ILov[] = [];
    searchOptionsPartners  : any 

    user: IUser;

    constructor(
        private recordService: BscCoverService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        public partnerService: PartnerService,
        private accountService: AccountService,
    ) {
        this.optionsBscTypes = OPTIONS_BSC_TYPES;
        this.accountService.currentUser$.subscribe({
            next: (user) => {
                // this.role = user.roleId as IRole
                this.user = user
            }
        })
    }

    ngOnInit(): void {

        this.searchOptionsPartners = ($event) => this.partnerService.searchOptionsPartners($event).then((records) => {
            this.optionsPartners = records
            this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
        })
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IBscCover>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            label: `${dto.data.entity.bscType}`,
                            routerLink: [`${this.modulePath}/new`]
                        }
                    ]);

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
    }

    createForm(item?: IBscCover) {
        const product = item?.productId as IProduct;
        const partner = item?.partnerId as IPartner
        console.log(partner)

        console.log(item);


        this.recordForm = this.formBuilder.group({
            _id: [item?._id],           
            partnerId: [partner ? { label: partner.name, value: partner._id } : null],
            bscType: [{value: item?.bscType , disabled : this.mode == 'edit'}, [Validators.required]],
            productId: [product ? { label: product.type, value: product._id } : null, [Validators.required]],
            fromSI: [{value : item?.fromSI,disabled :this.mode == 'edit'}, [Validators.required]],
            toSI: [{value : item?.toSI,disabled :this.mode == 'edit'}, [Validators.required]],
            applicableFrom: [item?.applicableFrom ? String(item?.applicableFrom).split('T')[0] : null],
            applicableTo: [item?.applicableTo ? String(item?.applicableTo).split('T')[0] : null],
            ratePerMile: [item?.ratePerMile, [Validators.required, Validators.min(0)]],
            taskStatus : [{value : item?.taskStatus,disabled : true}] ,
            failedMessage : [{value : item?.failedMessage,disabled : true}],
            isZoneWiseRate: [item?.isZoneWiseRate ? item?.isZoneWiseRate : false],
            eqZone1: [item?.eqZone1, []],
            eqZone2: [item?.eqZone2, []],
            eqZone3: [item?.eqZone3, [] ],
            eqZone4: [item?.eqZone4, [] ],
            stfiRate: [item?.stfiRate , []],
            maxNstp: [item?.maxNstp, [Validators.required]]
        });

        console.log(this.recordForm.value['isZoneWiseRate'])

        if(!this.recordForm.value['isZoneWiseRate']){
            console.log("IN")
            this.recordForm.controls['eqZone1'].clearValidators()
            this.recordForm.controls['eqZone2'].clearValidators()
            this.recordForm.controls['eqZone2'].updateValueAndValidity();
            this.recordForm.controls['eqZone3'].clearValidators()
            this.recordForm.controls['eqZone3'].updateValueAndValidity();
            this.recordForm.controls['eqZone4'].clearValidators()
            this.recordForm.controls['eqZone4'].updateValueAndValidity();
            console.log(this.recordForm.controls)

        }else{
            this.recordForm.controls['eqZone1'].addValidators(Validators.required);
            this.recordForm.controls['eqZone1'].updateValueAndValidity();
            this.recordForm.controls['eqZone2'].addValidators(Validators.required);
            this.recordForm.controls['eqZone2'].updateValueAndValidity();
            this.recordForm.controls['eqZone3'].addValidators(Validators.required);
            this.recordForm.controls['eqZone3'].updateValueAndValidity();
            this.recordForm.controls['eqZone4'].addValidators(Validators.required);
            this.recordForm.controls['eqZone4'].updateValueAndValidity();
        }
    }

    addValidatonstoZone(e){
        console.log(e)
        if(e.checked){
            this.recordForm.get('eqZone1')?.clearValidators()
            this.recordForm.controls['eqZone1'].addValidators(Validators.required);
            this.recordForm.controls['eqZone1'].updateValueAndValidity();
            this.recordForm.get('eqZone2')?.clearValidators()
            this.recordForm.controls['eqZone2'].addValidators(Validators.required);
            this.recordForm.controls['eqZone2'].updateValueAndValidity();
            this.recordForm.get('eqZone3')?.clearValidators()
            this.recordForm.controls['eqZone3'].addValidators(Validators.required);
            this.recordForm.controls['eqZone3'].updateValueAndValidity();
            this.recordForm.get('eqZone4')?.clearValidators()
            this.recordForm.controls['eqZone4'].addValidators(Validators.required);
            this.recordForm.controls['eqZone4'].updateValueAndValidity();
        }else{
            this.recordForm.get('eqZone1')?.clearValidators()
            this.recordForm.controls['eqZone1'].updateValueAndValidity();
            this.recordForm.get('eqZone2')?.clearValidators()
            this.recordForm.controls['eqZone2'].updateValueAndValidity();
            this.recordForm.get('eqZone3')?.clearValidators()
            this.recordForm.controls['eqZone3'].updateValueAndValidity();
            this.recordForm.get('eqZone4')?.clearValidators()
            this.recordForm.controls['eqZone4'].updateValueAndValidity();
        }
        console.log(this.recordForm)
    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        // console.log(this.userForm.value);

        if (this.recordForm.valid) {

            const updatePayload = { ...this.recordForm.value };
            updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
            updatePayload["productId"] = this.recordForm.value["productId"].value;

            if (this.mode === "edit") {
                this.recordService.update(this.id, updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            if (this.mode === "new") {
                this.recordService.create(updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

    onCancel() {
        this.recordService.setFilterValueExist(true);
        this.router.navigateByUrl(`${this.modulePath}`);
    }

    searchOptionsProducts(event) {
        let  lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                type: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
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
                this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
            },
            error: e => { }
        });
    }
}
