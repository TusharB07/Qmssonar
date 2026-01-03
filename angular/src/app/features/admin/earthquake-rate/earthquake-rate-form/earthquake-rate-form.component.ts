import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IIndustryType } from "../../industry-type/industry-type.model";
import { IndustryTypeService } from "../../industry-type/industry-type.service";
import { OPTIONS_EARTHQUAKE_ZONES } from "../../pincode/pincode.model";
import { IProduct } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { IEarthquakeRate } from "../earthquake-rate.model";
import { EarthquakeRateService } from "../earthquake-rate.service";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "src/app/features/account/account.service";
import { IUser } from "../../user/user.model";
import { PartnerService } from "../../partner/partner.service";
import { IRole, AllowedRoles } from "../../role/role.model";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";
import { IOccupancyRate } from "../../occupancy-rate/occupancy-rate.model";
import { OccupancyRateService } from "../../occupancy-rate/occupancy-rate.service";
import { SectorService } from "../../sector/sector.service";
import { ISector } from "../../sector/sector.model";

@Component({
    selector: "app-earthquake-rate-form",
    templateUrl: "./earthquake-rate-form.component.html",
    styleUrls: ["./earthquake-rate-form.component.scss"]
})
export class EarthquakeRateFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;
    isHide:boolean = true;
    isHideBulidingandContent:boolean = false;
    recordSingularName = "Earthquake Rate";
    recordPluralName = "Earthquake Rates";
    modulePath: string = "/backend/admin/earthquake-rates";

    optionsProducts: ILov[] = [];
    optionsIndustryType: ILov[] = [];
    optionOccupancy: ILov[] = [];
    optionsEarthquakeZones: ILov[] = [];

    role: IRole
    AllowedRoles = AllowedRoles
    user: IUser;

    // To Show Options of partners
    optionsPartners: ILov[] = [];
    searchOptionsPartners: any
    optionsSectors: ILov[] = [];

    minSelectableDate: Date;

    constructor(
        private recordService: EarthquakeRateService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private industryTypeService: IndustryTypeService,
        private productService: ProductService,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private occupancyRateService: OccupancyRateService,
        public partnerService: PartnerService,
        private sectorService: SectorService,
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

        this.minSelectableDate = new Date();


        this.searchOptionsPartners = ($event) => this.partnerService.searchOptionsPartners($event).then((records) => {
            this.optionsPartners = records
            console.log(this.optionsPartners)
            this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
        })
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        this.createForm();
        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IEarthquakeRate>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" }
                        // {
                        //     label: `${dto.data.entity.name}`,
                        //     routerLink: [`${this.modulePath}/new`],
                        // },
                    ]);

                    this.createForm(dto.data.entity);
                    console.log(this.recordForm);
                    // <!--This is for only for Griha Lite Start-->
                    const product = dto.data.entity?.productId as IProduct
                    this.hideRate({ label: product.type, value: product._id,shortName:product.shortName,isBuildingAndContent:product.isBuildingAndContentWiseRate });
                    // <!--This is for only for Griha Lite End-->
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

    createForm(earthquakeRate?: IEarthquakeRate) {
        const product = earthquakeRate?.productId as IProduct
        const partner = earthquakeRate?.partnerId as IPartner
        // const industryType = earthquakeRate?.industryTypeId as IIndustryType
        const occupancy = earthquakeRate?.occupancyId as IOccupancyRate
        const sector = earthquakeRate?.sectorId as ISector

        console.log(earthquakeRate);

        this.recordForm = this.formBuilder.group({
            partnerId: [partner ? { label: partner.name, value: partner._id } : null],
            _id: [earthquakeRate?._id],
            zone: [earthquakeRate?.zone],
            rate: [earthquakeRate?.rate,[Validators.required]],
            tenurewiseRate: [earthquakeRate?.tenurewiseRate],
            buildingRate: [earthquakeRate?.buildingRate,[Validators.required]],
            buildingTenurewiseRate: [earthquakeRate?.buildingTenurewiseRate],
            contentRate: [earthquakeRate?.contentRate,[Validators.required]],
            contentTenurewiseRate: [earthquakeRate?.contentTenurewiseRate],
            sectorId: [sector ? { label: sector.name, value: sector._id } : null],
            occupancyId: [occupancy ? { label: occupancy?.occupancyType, value: occupancy?._id } : null],
            productId: [product ? { label: product.type, value: product._id } : null],
            applicableFrom: [earthquakeRate?.applicableFrom ? String(earthquakeRate?.applicableFrom).split('T')[0] : new Date],
            applicableTo: [earthquakeRate?.applicableTo ? String(earthquakeRate?.applicableTo).split('T')[0] : null],
            taskStatus: [{ value: earthquakeRate?.taskStatus ?? null, disabled: true }],
            failedMessage: [{ value: earthquakeRate?.failedMessage, disabled: true }]
        });
    }
    get rate() {
        return this.recordForm.get('rate');
      }
    get buildingRate() {
        return this.recordForm.get('buildingRate');
      } 
    get contentRate() {
        return this.recordForm.get('contentRate');
      }  
    saveRecord() {
        console.log(this.recordForm.value);
        this.recordService.setFilterValueExist(true);
        console.log(this.recordForm);

        if (this.recordForm.valid) {
            const updatePayload = { ...this.recordForm.value };
            updatePayload["industryTypeId"] = this.recordForm.value["industryTypeId"].value;
            updatePayload["productId"] = this.recordForm.value["productId"].value;
            updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
            if(this.recordForm.value["occupancyId"]!=null) updatePayload["occupancyId"] = this.recordForm.value["occupancyId"].value;

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
                this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id, shortName:entity.shortName, isBuildingAndContent:entity.isBuildingAndContentWiseRate }));
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
                ],
                // @ts-ignore
                active: [
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
        this.industryTypeService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsIndustryType = data.data.entities.map(entity => ({ label: entity.industryTypeName, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsOccupancy(event) {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                occupancyType: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    },
                ],
                // @ts-ignore
                partnerId: [
                    {
                        value: this.recordForm.controls['partnerId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                // @ts-ignore
                productId: [
                    {
                        value: this.recordForm.controls['productId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                 // @ts-ignore
                 active: [
                    {
                        value: true,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.occupancyRateService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
                this.optionOccupancy = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));

            },
            error: e => { }
        });
    }
    // <!--This is for only for Griha Lite Start-->
    hideRate(val:any){
        if(val.isBuildingAndContent == true){
            this.isHide = false;
            this.isHideBulidingandContent = true;
            this.recordForm.get(['rate']).clearValidators();
            this.recordForm.get(['buildingRate']).setValidators([Validators.required]);
            this.recordForm.get(['contentRate']).setValidators([Validators.required]);
        }else{
                this.isHide = true;
                this.isHideBulidingandContent = false;
                this.recordForm.get(['rate']).setValidators([Validators.required]);
                this.recordForm.get(['buildingRate']).clearValidators();
                this.recordForm.get(['contentRate']).clearValidators();
            }   
            this.recordForm.get(['rate']).updateValueAndValidity();
            this.recordForm.get(['buildingRate']).updateValueAndValidity();
            this.recordForm.get(['contentRate']).updateValueAndValidity();
    }
    // <!--This is for only for Griha Lite End-->
    searchOptionsSector(event) {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                name: [
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
        this.sectorService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsSectors = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

}   
