import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IIndustryType } from "../../industry-type/industry-type.model";
import { IndustryTypeService } from "../../industry-type/industry-type.service";
import { OPTIONS_EARTHQUAKE_ZONES } from "../../pincode/pincode.model";
import { IProduct } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { IBranchMaster } from "../branch-master.model";
import { BranchMasterService } from "../branch-master.service";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "src/app/features/account/account.service";
import { IUser } from "../../user/user.model";
import { PartnerService } from "../../partner/partner.service";
import { IRole, AllowedRoles } from "../../role/role.model";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";

@Component({
    selector: "app-branch-master-form",
    templateUrl: "./branch-master-form.component.html",
    styleUrls: ["./branch-master-form.component.scss"]
})
export class BranchMasterFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;

    recordSingularName = "Branch Master";
    recordPluralName = "Branch Master";
    modulePath: string = "/backend/admin/branch-master";

    optionsProducts: ILov[] = [];
    optionsIndustryType: ILov[] = [];
    optionsEarthquakeZones: ILov[] = [];

    role: IRole
    AllowedRoles = AllowedRoles
    user: IUser;
    zoneOptions: any[] = [
        { label: 'I' },
        { label: 'II'},
        { label: 'III' },
        { label: 'IV' }
    ];
    // To Show Options of partners
    optionsPartners: ILov[] = [];
    constructor(
        private recordService: BranchMasterService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private industryTypeService: IndustryTypeService,
        private productService: ProductService,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        public partnerService: PartnerService,
    ) {
        this.optionsEarthquakeZones = OPTIONS_EARTHQUAKE_ZONES;

        this.accountService.currentUser$.subscribe({
            next: (user) => {
                this.role = user.roleId as IRole
                this.user = user
                console.log(this.user)
            }
        })
    }




    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        this.createForm();
        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IBranchMaster>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" }
                        // {
                        //     label: `${dto.data.entity.name}`,
                        //     routerLink: [`${this.modulePath}/new`],
                        // },
                    ]);

                    this.createForm(dto.data.entity);
                    console.log(this.recordForm)
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
    }

    createForm(BranchMaster?: IBranchMaster) {
        // const product = BranchMaster?.productId as IProduct
        const partner = BranchMaster?.partnerId as IPartner
        // const industryType = BranchMaster?.industryTypeId as IIndustryType

        console.log(BranchMaster);

        this.recordForm = this.formBuilder.group({
            partnerId: [partner ? { label: partner.name, value: partner._id } : null],
            _id: [BranchMaster?._id],
            zone:[BranchMaster?.zone ? {label : BranchMaster?.zone} : null],
            name: [BranchMaster?.name],
            code: [BranchMaster?.code],
        });
    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        // console.log(this.userForm.value);

        if (this.recordForm.valid) {
            const updatePayload = { ...this.recordForm.value };
            updatePayload["zone"] = this.recordForm.value["zone"]?.label ?? '';
            updatePayload["name"] = this.recordForm.value["name"];
            updatePayload["code"] = this.recordForm.value["code"];
            updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
            console.log(updatePayload);

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

    searchOptionsPartners(event) {
        event = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                //@ts-ignore  
                name: [
                    {
                        //@ts-ignore  
                        value: this.user?.partnerId?.partnerType == 'self' ? '' : this.user.partnerId['name'],
                        //@ts-ignore  
                        matchMode: this.user?.partnerId?.partnerType == 'self' ? "startsWith" :"equals",
                        //@ts-ignore  
                        operator: this.user?.partnerId?.partnerType == 'self' ? "or" : "or"
                    }
                ],
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.partnerService.getMany(event).subscribe({
            next: data => {
                this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
            },
            error: e => { }
        });
    }

    searchOptionsProducts(event) {
        let lazyLoadEvent: LazyLoadEvent = {
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

    searchOptionsIndustryType(event) {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                industryTypeName: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.industryTypeService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsIndustryType = data.data.entities.map(entity => ({ label: entity.industryTypeName, value: entity._id }));
            },
            error: e => { }
        });
    }
}
