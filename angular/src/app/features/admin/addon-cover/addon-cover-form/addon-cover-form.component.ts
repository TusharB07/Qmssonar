import { ISector } from "../../sector/sector.model";
import { SectorService } from "../../sector/sector.service";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadEvent } from "primeng/api";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { AllowedProductTemplate, IProduct } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { IAddOnCover, OPTIONS_ADDON_COVER_CATEGORIES, OPTIONS_ADDON_COVER_LIMIT_TYPE, OPTIONS_ADDON_COVER_RATE_TYPE, OPTIONS_ADDON_COVER_TYPE_FLAGS } from "../addon-cover.model";
import { AddonCoverService } from "../addon-cover.service";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";
import { PartnerService } from "../../partner/partner.service";
import { AccountService } from "src/app/features/account/account.service";
import { OccupancyRateService } from "../../occupancy-rate/occupancy-rate.service";
import { IUser } from "../../user/user.model";
import { AddOnCoverOptionsService } from "../../add-ons-covers-ddl-options/add-ons-covers-ddl-options.service";
import { IOccupancyRate } from "../../occupancy-rate/occupancy-rate.model";
import { WCAllowedListOfValuesMasters } from "../../list-of-value-master/list-of-value-master.model";
import { WCListOfValueMasterService } from "../../list-of-value-master/wc-list-of-value-master.service";
import { IQuoteSlip } from "../../quote/quote.model";


@Component({
    selector: "app-addon-cover-form",
    templateUrl: "./addon-cover-form.component.html",
    styleUrls: ["./addon-cover-form.component.scss"]
})
export class AddonCoverFormComponent implements OnInit {
    quote: IQuoteSlip;
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    templateName: string = ""
    submitted: boolean = false;
    isHide: boolean = true;
    isHideBulidingandContent: boolean = false;
    rateLimit: FormArray;

    optionsProducts: ILov[] = [];
    optionsAddonCategories: ILov[] = [];
    optionsAddonTypeFlags: ILov[] = [];
    optionsAddonRateTypes: ILov[] = [];
    optionsRatelimits: ILov[] = [];


    recordSingularName = "Addon Cover";
    recordPluralName = "Addon Cover";
    modulePath: string = "/backend/admin/addon-covers";

    // To Show Options of partners
    optionsPartners: ILov[] = [];
    searchOptionsPartners: any
    optionsSectors: ILov[] = [];
    optionOccupancy: ILov[] = [];

    user: IUser;
    optionsCategoryOfImportance = [
        { label: 'Could Have', value: 'Could Have' },
        { label: 'Good to Have', value: 'Good to Have' },
        { label: 'Must Have', value: 'Must Have' }
    ];

    //Liability
    selectedAddonCoverOptions: ILov[] = []
    selectedTypeOfProduct: ILov[] = []
    selectedInsuredBusinessActivity: ILov[] = []
    optionsAddOncovers: ILov[] = []
    optionsIBusinessActivity: ILov[] = []
    optionITypeOfProduct: ILov[] = [];
    optionsProductsList: IProduct[] = []
    productTemplate: string = ""
    isLiabilityProduct: boolean = false;
    isLiabilityProductCGL: boolean = false;
    AllowedProductTemplate: AllowedProductTemplate
    selectedPartnerId: string = ""
    hideLimit: any
    hide: boolean

    optionSILimit = [
        { label: 'SI above 100cr', value: true },
        { label: 'SI below 100cr', value: false },
    ]
    carProduct: boolean = false;

    newAddonApprovedData: any;

    constructor(
        private recordService: AddonCoverService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        public partnerService: PartnerService,
        private accountService: AccountService,
        private sectorService: SectorService,
        private addonCoversOptionsService: AddOnCoverOptionsService,
        private occupancyRateService: OccupancyRateService,
        private wclistofmasterservice: WCListOfValueMasterService,
    ) {

        this.optionsAddonCategories = OPTIONS_ADDON_COVER_CATEGORIES
        this.optionsAddonTypeFlags = OPTIONS_ADDON_COVER_TYPE_FLAGS
        this.optionsAddonRateTypes = OPTIONS_ADDON_COVER_RATE_TYPE
        this.optionsRatelimits = OPTIONS_ADDON_COVER_LIMIT_TYPE

        this.accountService.currentUser$.subscribe({
            next: (user) => {
                // this.role = user.roleId as IRole
                this.user = user
            }
        })

        if (history.state) {
            this.searchOptionsOccupancy(history.state)
        }
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
                next: (dto: IOneResponseDto<IAddOnCover>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            label: `${dto.data.entity.name}`,
                            routerLink: [`${this.modulePath}/new`]
                        }
                    ]);

                    this.createForm(dto.data.entity);
                    // This is only for Griha Lite Start
                    const product = dto.data.entity?.productId as IProduct
                    this.hideRate({ label: product.type, value: product._id, shortName: product.shortName, isBuildingAndContent: product.isBuildingAndContentWiseRate });
                    if (product.type === 'Contractors All Risk') {
                        this.carProduct = true
                        this.addRateLimit();
                    } else {
                        this.carProduct = false
                        this.deleteRateLimit(1)
                    }
                    // This is only for Griha Lite End
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

        //Liability
        this.addonCoversOptionsService.searchOptionsAddOnCovers().then((response) => {
            //this.selectedAddonCoverOptions = response
            this.optionsAddOncovers = response
        });

        // mode: New
        this.createForm();
    }

    loadTypeOfProductsCGL() {
        this.templateName = this.productTemplate;
        const lovTypeMapping = {
            [AllowedProductTemplate.LIABILITY_CGL]: WCAllowedListOfValuesMasters.CGL_TYPE_OF_PRODUCT
        }
        const lovType = lovTypeMapping[this.templateName] || "";
        if (lovType != "") {
            this.wclistofmasterservice.current(lovType).subscribe({
                next: records => {
                    if (records.data.entities.length > 0) {
                        const partnerId = this.selectedPartnerId != "" ? this.selectedPartnerId : this.user?.partnerId["_id"]
                        records.data.entities = records.data.entities.filter(x => x.partnerId == partnerId);
                        records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
                    }
                    this.optionITypeOfProduct = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
                },
                error: e => {
                    console.log(e);
                }
            });
        }
    }

    loadInsuredBusinessActivity() {
        this.templateName = this.productTemplate;
        const lovTypeMapping = {
            [AllowedProductTemplate.LIABILITY]: WCAllowedListOfValuesMasters.LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_CRIME]: WCAllowedListOfValuesMasters.CRIME_LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_EANDO]: WCAllowedListOfValuesMasters.EANDO_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.WORKMENSCOMPENSATION]: WCAllowedListOfValuesMasters.WC_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_PUBLIC]: WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_PRODUCT]: WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_CYBER]: WCAllowedListOfValuesMasters.CYBER_LIABILITY_INSURED_BUSINESS_ACTIVITY,
        };
        const lovType = lovTypeMapping[this.templateName] || "";
        if (lovType != "") {
            this.wclistofmasterservice.current(lovType).subscribe({
                next: records => {
                    if (records.data.entities.length > 0) {
                        const partnerId = this.selectedPartnerId != "" ? this.selectedPartnerId : this.user?.partnerId["_id"]
                        records.data.entities = records.data.entities.filter(x => x.partnerId == partnerId);
                        records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
                    }
                    this.optionsIBusinessActivity = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
                },
                error: e => {
                    console.log(e);
                }
            });
        }
    }

    createForm(addonCover?: IAddOnCover) {
        const product = addonCover?.productId as IProduct
        const partner = addonCover?.partnerId as IPartner
        const sector = addonCover?.sectorId as ISector

        this.selectedPartnerId = partner ? partner._id : ""
        //Liability
        if (addonCover) {
            if (product) {
                const selectedProductTempalte = product.productTemplate;
                if (selectedProductTempalte) {
                    this.productTemplate = selectedProductTempalte;
                    if (this.productTemplate == AllowedProductTemplate.LIABILITY || this.productTemplate == AllowedProductTemplate.LIABILITY_EANDO ||
                        this.productTemplate == AllowedProductTemplate.LIABILITY_PRODUCT || this.productTemplate == AllowedProductTemplate.LIABILITY_PUBLIC || this.productTemplate == AllowedProductTemplate.LIABILITY_CYBER ||
                        this.productTemplate == AllowedProductTemplate.LIABILITY_CRIME || this.productTemplate == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                        this.isLiabilityProduct = true;
                        this.loadInsuredBusinessActivity();
                        this.addonCoversOptionsService.searchOptionsAddOnCovers().then((response) => {
                            //this.selectedAddonCoverOptions = response
                            this.optionsAddOncovers = response
                        });
                    } else if (this.productTemplate == AllowedProductTemplate.LIABILITY_CGL) {
                        this.isLiabilityProductCGL = true;
                        this.loadTypeOfProductsCGL()
                        this.addonCoversOptionsService.searchOptionsAddOnCovers().then((response) => {
                            //this.selectedAddonCoverOptions = response
                            this.optionsAddOncovers = response
                        });
                    }
                    else {
                        this.isLiabilityProductCGL = false;
                        this.isLiabilityProduct = false;
                        this.selectedTypeOfProduct = []
                        this.selectedInsuredBusinessActivity = []
                        this.selectedAddonCoverOptions = []
                    }
                }
            }
            this.selectedAddonCoverOptions = this.isLiabilityProduct || this.isLiabilityProductCGL ? addonCover.addonCoverOptions : [];
            this.selectedInsuredBusinessActivity = this.isLiabilityProduct ? addonCover.insuredBusinessActivityOptions : []
            this.selectedTypeOfProduct = this.isLiabilityProductCGL ? addonCover.typeOfProductOptions : [];
        }


        const occupancy = addonCover?.occupancyId as IOccupancyRate;

        this.recordForm = this.formBuilder.group({
            _id: [addonCover?._id],
            name: [this.newAddonApprovedData?._id ?
                this.newAddonApprovedData?.name :
                { value: addonCover?.name, disabled: this.mode == 'edit' }, [Validators.required]],
            partnerId: this.newAddonApprovedData?._id ?
                [{ label: this.newAddonApprovedData?.partnerId?.name, value: this.newAddonApprovedData?.partnerId?._id }] :
                [partner ? { label: partner.name, value: partner._id } : null],
            freeUpToText: [this.newAddonApprovedData?._id ?
                this.newAddonApprovedData?.freeUpToText :
                addonCover?.freeUpToText, []],
            productId: this.newAddonApprovedData?._id ?
                [{ label: this.newAddonApprovedData?.productId?.type, value: this.newAddonApprovedData?.productId?._id }] :
                [product ? { label: product.type, value: product._id } : null],
            sectorId: this.newAddonApprovedData?._id ?
                [{ label: this.newAddonApprovedData?.quoteId["sectorId"]?.name, value: this.newAddonApprovedData?.quoteId["sectorId"]?._id }] :
                [sector ? { label: sector.name, value: sector._id } : null],
            // occupancyId: this.newAddonApprovedData?._id ?
            //     [{ label: this.newAddonApprovedData?.quoteLocationOccupancyId["occupancyId"]?.occupancyType, value: this.newAddonApprovedData?.quoteLocationOccupancyId["occupancyId"]?._id }] : [occupancy ? { label: occupancy.occupancyType, value: occupancy._id } : null],
            occupancyId: [occupancy ? { label: occupancy.occupancyType, value: occupancy._id } : null],
            category: [addonCover?.category],
            rate: [addonCover?.rate, Validators.max(50)],
            addonTypeFlag: [{ value: addonCover?.addonTypeFlag, disabled: this.mode == 'edit' }],
            categoryOfImportance: [addonCover?.categoryOfImportance],
            rateType: [{ value: addonCover?.rateType, disabled: this.mode == 'edit' }],
            description: [addonCover?.description, []],
            freeUpToNumber: [addonCover?.freeUpToNumber],
            applicableTo: [addonCover?.applicableTo ? String(addonCover?.applicableTo).split('T')[0] : null],
            applicableFrom: [addonCover?.applicableFrom ? String(addonCover?.applicableFrom).split('T')[0] : null],
            taskStatus: [{ value: addonCover?.taskStatus, disabled: true }],
            failedMessage: [{ value: addonCover?.failedMessage, disabled: true }],
            //Liability
            addonCoverOptions: [this.isLiabilityProduct || this.isLiabilityProductCGL ? this.selectedAddonCoverOptions : []],
            insuredBusinessActivityOptions: [this.isLiabilityProduct ? this.selectedInsuredBusinessActivity : []],
            isAbv100cr: [addonCover?.isAbv100cr],
            rateLimit: this.formBuilder.array([]),
            typeOfProductOptions: [this.isLiabilityProductCGL ? this.selectedTypeOfProduct : []],

            // taskStatus: [{ value: addonCover?.taskStatus, disabled: true }],
            // failedMessage: [{ value: addonCover?.failedMessage, disabled: true }],
            // sectorId: [sector ? { label: sector.name, value: sector._id } : null],
            //   calculatedIndicativePremium: [addonCover?.calculatedIndicativePremium],
            //   rateParameter: [addonCover?.rateParameter],
            //   freeUpToFlag: [addonCover?.freeUpToFlag],
            //   freeUpToParameter: [addonCover?.freeUpToParameter],

            //   subCategory: [addonCover?.subCategory],
            //   isFree: [addonCover?.isFree],
            //   isTariff: [addonCover?.isTariff],
            //   claimClause: [addonCover?.claimClause],
            //   monthOrDays: [addonCover?.monthOrDays],
            //   siLimit: [addonCover?.siLimit],
            // rate: [addonCover?.rate , [Validators.required,Validators.max(50)]],
            // tenurewiseRate: [addonCover?.tenurewiseRate],
            //   categoryOfImportance: [addonCover?.categoryOfImportance, [Validators.required]],
            //   sequenceNo: [addonCover?.sequenceNo],
            //   policyType: [addonCover?.policyType],
            //   sumInsured: [addonCover?.sumInsured],
            //   isAddonSelected: [addonCover?.isAddonSelected],
            // failedMessage: [{ value: addonCover?.failedMessage, disabled: true}],
            // sectorId:[sector ? { label: sector.name, value: sector._id } : null],
            // buildingRateType:[addonCover?.buildingRateType,[Validators.required]],
            // buildingRate:[addonCover?.buildingRate, [Validators.required,Validators.max(50)]],
            // buildingTenurewiseRate:[addonCover?.buildingTenurewiseRate],
            // contentRateType:[addonCover?.contentRateType,[Validators.required]],
            // contentRate:[addonCover?.contentRate, [Validators.required,Validators.max(50)]],
            // contentTenurewiseRate:[addonCover?.contentTenurewiseRate],
            //Liability

            // taskStatus: [{ value: addonCover?.taskStatus, disabled: true }],
            // failedMessage: [{ value: addonCover?.failedMessage, disabled: true }],
            // sectorId: [sector ? { label: sector.name, value: sector._id } : null],
        });
        this.rateLimit = this.recordForm.get('rateLimit') as FormArray;
    }


    addRateLimit() {
        const rateGroup = this.formBuilder.group({
            limits: [null],
            rate: [null]
        });
        this.rateLimit.push(rateGroup);
    }

    deleteRateLimit(index: number) {
        this.rateLimit.removeAt(index);
    }


    onProductSelect(event: any) {

        if (event.value === '66614f79a94dda81eee44f0c') {
            this.carProduct = true
            this.addRateLimit();
        }
        else {
            this.carProduct = false
            this.deleteRateLimit(1)
        }
        // console.log('Selected Product:', event.value);
    }


    //Liability
    addonsOptionsWiseFilterChanged(value: any) {
        this.selectedAddonCoverOptions = value;
    }

    insuredBusinessActivityChange(value: any) {
        this.selectedInsuredBusinessActivity = value
    }

    insuredTypeOfProduct(value: any) {
        this.selectedTypeOfProduct = value
    }


    saveRecord() {
        this.recordService.setFilterValueExist(true);

        if (this.recordForm.valid) {
            const updatePayload = { ...this.recordForm.value };
            updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
            updatePayload["productId"] = this.recordForm.value["productId"].value;
            updatePayload["sectorId"] = this.recordForm.value["sectorId"] != null ? this.recordForm.value["sectorId"].value : null;
            updatePayload["quoteLocationAddonCoverId"] = this.newAddonApprovedData._id;
            updatePayload["quoteLocationAddonCoverPartnerId"] = this.newAddonApprovedData?.partnerId?._id;

            //Liability
            if (this.isLiabilityProduct) {
                updatePayload["addonCoverOptions"] = this.selectedAddonCoverOptions;
                updatePayload["insuredBusinessActivityOptions"] = this.selectedInsuredBusinessActivity;

            }
            else if (this.isLiabilityProductCGL) {
                updatePayload["addonCoverOptions"] = this.selectedAddonCoverOptions;
                updatePayload["typeOfProductOptions"] = this.selectedTypeOfProduct;
            }
            else {
                updatePayload["addonCoverOptions"] = []
                updatePayload["insuredBusinessActivityOptions"] = []
                updatePayload["typeOfProductOptions"] = []
            }
            updatePayload["occupancyId"] = this.recordForm.value["occupancyId"]?.value;
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

    //Liability
    handleOnproductChange(event: any) {
        const selectedProduct = event;
        const selectedProductId = selectedProduct ? selectedProduct.value : null;
        if (selectedProductId) {
            const selectedProductTempalte = this.optionsProductsList.find(product => product._id === selectedProductId).productTemplate;
            if (selectedProductTempalte) {
                this.productTemplate = selectedProductTempalte;
                if (this.productTemplate == AllowedProductTemplate.LIABILITY || this.productTemplate == AllowedProductTemplate.LIABILITY_EANDO ||
                    this.productTemplate == AllowedProductTemplate.LIABILITY_PRODUCT || this.productTemplate == AllowedProductTemplate.LIABILITY_PUBLIC || this.productTemplate == AllowedProductTemplate.LIABILITY_CYBER ||
                    this.productTemplate == AllowedProductTemplate.LIABILITY_CRIME || this.productTemplate == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                    this.isLiabilityProduct = true;
                    this.loadInsuredBusinessActivity();
                    this.addonCoversOptionsService.searchOptionsAddOnCovers().then((response) => {
                        //this.selectedAddonCoverOptions = response
                        this.optionsAddOncovers = response
                    });
                } else if (this.productTemplate == AllowedProductTemplate.LIABILITY_CGL) {
                    this.isLiabilityProductCGL = true;
                    this.loadTypeOfProductsCGL()
                    this.addonCoversOptionsService.searchOptionsAddOnCovers().then((response) => {
                        //this.selectedAddonCoverOptions = response
                        this.optionsAddOncovers = response
                    });
                }
                else {
                    this.isLiabilityProductCGL = false;
                    this.isLiabilityProduct = false;
                    this.selectedTypeOfProduct = []
                    this.selectedInsuredBusinessActivity = []
                    this.selectedAddonCoverOptions = []
                }
            }
            if (event.label === 'Contractors All Risk') {
                this.carProduct = true
                this.addRateLimit();
            }
            else {
                this.carProduct = false
                this.deleteRateLimit(1)
            }
        }
    }

    handleOnPartnerChange(event: any) {
        const selectedPartner = event;
        const selectedPartnerId = selectedPartner ? selectedPartner.value : "";
        this.selectedPartnerId = selectedPartnerId
    }

    addField() {
        const rateLimitGroup = this.formBuilder.group({
            limits: [null, [Validators.required, Validators.min(0)]],
            rate: [null, [Validators.required, Validators.max(50)]]
        });
        this.recordForm.setControl('rateLimit', rateLimitGroup);
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
                //this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id, shortName:entity.shortName, isBuildingAndContent:entity.isBuildingAndContentWiseRate }));
                //Liability
                this.optionsProductsList = data.data.entities;
                this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
                this.hideLimit = this.optionsProducts.filter((ele) => {
                    if (ele.label == "Contractors All Risk") {
                        this.hide = true;
                    } else {
                        this.hide = false;
                    }
                })
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
                        value: event?.isExternal ? event?.quoteLocationOccupancyId["occupancyId"]?.occupancyType : event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    },
                ],
                // @ts-ignore
                partnerId: [
                    {
                        value: event?.isExternal ? this.user.partnerId["_id"] : this.recordForm?.controls['partnerId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                // @ts-ignore
                productId: [
                    {
                        value: event?.isExternal ? event?.productId?._id : this.recordForm?.controls['productId'].value?.value,
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
                this.optionOccupancy = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));
                if (history.state) {
                    this.newAddonApprovedData = history.state;
                    this.newAddonApprovedData.quoteLocationOccupancyId["occupancyId"] = data.data.entities[0]
                    this.createForm()
                }

            },
            error: e => { }
        });
    }

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
    // This is only for Griha Lite Start
    hideRate(val: any) {
        if (val.isBuildingAndContent == true) {
            this.isHide = false;
            this.isHideBulidingandContent = true;
            this.recordForm.get(['rateType']).clearValidators();
            this.recordForm.get(['rate']).clearValidators();
            // this.recordForm.get(['tenurewiseRate']).clearValidators();
            // this.recordForm.get(['buildingRateType']).setValidators([Validators.required]);
            // this.recordForm.get(['buildingRate']).setValidators([Validators.required]);
            // this.recordForm.get(['buildingTenurewiseRate']).setValidators([Validators.required]);
            // this.recordForm.get(['contentRateType']).setValidators([Validators.required]);
            // this.recordForm.get(['contentRate']).setValidators([Validators.required]);
            // this.recordForm.get(['contentTenurewiseRate']).setValidators([Validators.required]);
        } else {
            this.isHide = true;
            this.isHideBulidingandContent = false;
            this.recordForm.get(['rateType']).setValidators([Validators.required]);
            this.recordForm.get(['rate']).setValidators([Validators.required]);
            // this.recordForm.get(['tenurewiseRate']).clearValidators();
            // this.recordForm.get(['buildingRateType']).clearValidators();
            // this.recordForm.get(['buildingRate']).clearValidators();
            // this.recordForm.get(['buildingTenurewiseRate']).clearValidators();
            // this.recordForm.get(['contentRateType']).clearValidators();
            // this.recordForm.get(['contentRate']).clearValidators();
            // this.recordForm.get(['contentTenurewiseRate']).clearValidators();
        }
        this.recordForm.get(['rateType']).updateValueAndValidity();
        this.recordForm.get(['rate']).updateValueAndValidity();
        // this.recordForm.get(['tenurewiseRate']).updateValueAndValidity();
        // this.recordForm.get(['buildingRateType']).updateValueAndValidity();
        // this.recordForm.get(['buildingRate']).updateValueAndValidity();
        // this.recordForm.get(['buildingTenurewiseRate']).updateValueAndValidity();
        // this.recordForm.get(['contentRateType']).updateValueAndValidity();
        // this.recordForm.get(['contentRate']).updateValueAndValidity();
        // this.recordForm.get(['contentTenurewiseRate']).updateValueAndValidity();
    }

    get rateType() {
        return this.recordForm.get('rateType');
    }
    get rate() {
        return this.recordForm.get('rate');
    }
    // get tenurewiseRate(){
    //     return this.recordForm.get('tenurewiseRate');
    // }
    // get buildingRateType(){
    //     return this.recordForm.get('buildingRateType');
    // }
    // get buildingRate(){
    //     return this.recordForm.get('buildingRate');
    // }
    // get buildingTenurewiseRate(){
    //     return this.recordForm.get('buildingTenurewiseRate');
    // }
    // get contentRateType(){
    //     return this.recordForm.get('contentRateType');
    // }
    // get contentRate(){
    //     return this.recordForm.get('contentRate');
    // }
    // get contentTenurewiseRate(){
    //     return this.recordForm.get('contentTenurewiseRate');
    // }
    // This is only for Griha Lite End
}
