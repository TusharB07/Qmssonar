import { formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, PrimeNGConfig, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { ClientLocationService } from 'src/app/features/admin/client-location/client-location.service';
import { IProductPartnerConfiguration } from 'src/app/features/admin/product-partner-configuration/product-partner-configuration.model';
import { ProductPartnerConfigurationService } from 'src/app/features/admin/product-partner-configuration/product-partner-configuration.service';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { ProductService } from 'src/app/features/admin/product/product.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteTypes, BasicDetailsAttachments, CGLTemplate, DANDOTemplate, EmployeeDemographic, FinalRater, GmcClaimExperience, GmcGradedSI, ICGLTemplate, IDANDOTemplate, IEandOTemplate, IEmployeesDemoSummary, IFileModel, IMarineTemplate, IProductLiabilityTemplate, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip, IWCTemplate, MarineSIData, MarineSISplit, OPTIONS_MARINE_POLICY_TYPE, OPTIONS_QUOTE_TYPES, ProductLiabilityTemplate, QuoteGmcTemplate, SubjectivityAndMajorExclusions, liabiltyAddOnCovers, liabiltyCGLAddOnCovers, liabiltyDeductibles, liabiltyEandOAddOnCovers, liabiltyProductAddOnCovers, GmcBasicDetails, GmcClaimDetails, GmcPolicyDetails, GpaGtlDetails, GpaGtlFormDetails, OPTIONS_PLAN_EB, OPTIONS_POLICY_TYPE_EB, WCTemplate, Installment, ICoBroker, IcoInsurers, GmcOtherDetails } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { CreateRiskLocationOccupancyDialogComponent } from 'src/app/features/broker/create-risk-location-occupancy-dialog/create-risk-location-occupancy-dialog.component';
import { ToWords } from 'to-words';
import { UploadStepWiseExcelForQuoteComponent } from '../../components/upload-step-wise-excel-for-quote/upload-step-wise-excel-for-quote.component';
import { GmcMasterService } from 'src/app/features/admin/gmc-master/gmc-master.service';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { SumInsuredService } from 'src/app/features/admin/sumInsured/suminsured.service';
import { GmEmloyeesService } from 'src/app/features/broker/quote-gmc-employeeview-dialog/gmc-employess-service';
import { environment } from 'src/environments/environment';
import { GmcGradedSiDialogComponent } from '../../components/gmc-graded-si-dialog/gmc-graded-si-dialog.component';
import { GmcCoverageDetailsDialogComponent } from 'src/app/features/broker/gmc-coverage-details-dialog/gmc-coverage-details-dialog.component';
import { QuoteGmcEmployeeviewDialogComponent } from 'src/app/features/broker/quote-gmc-employeeview-dialog/quote-gmc-employeeview-dialog.component';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { ClausesService } from 'src/app/features/admin/Marine/ClausesMaster/clauses.service';
import { IClauses } from 'src/app/features/admin/Marine/ClausesMaster/clauses.model';
import { QuotemarinetemplateService } from 'src/app/features/admin/Marine/quotemarinetemplate.service';
import { ICoverageType } from 'src/app/features/admin/coverageTypes/coveragetypes.model';
import { CoverageTypesService } from 'src/app/features/admin/coverageTypes/coveragetypes.service';
import { RadioButton } from 'primeng/radiobutton';
import { FileUpload } from 'primeng/fileupload';
import { WCRatesFileUploadService } from 'src/app/features/broker/quote-wc-ratesview-dialog/wc-ratesview-service';
import { WCRatesFileUploadDialogComponent } from 'src/app/features/broker/quote-wc-ratesview-dialog/quote-wc-ratesview-dialog.component';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IndicativePremiumCalcService } from '../../components/quote/quote-requisition-tabs/workmen-coverages-tab/indicativepremiumcalc.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';
import { ExpiredDetailsDialogFormService } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.service';
import { ExpiredDetailsDialogForm } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.component';
import { ISector } from 'src/app/features/admin/sector/sector.model';
import { IClient } from 'src/app/features/admin/client/client.model';
import { SectorService } from 'src/app/features/admin/sector/sector.service';
import { ClientService } from 'src/app/features/admin/client/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteLocationBreakupDialogComponent } from '../../components/quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { ProjectDetailsDialogComponent } from 'src/app/features/broker/project-details-dialog/project-details-dialog.component';
import { IProject } from 'src/app/features/broker/project-details-dialog/project-details-dialog.model';
import { ProjectDetailsService } from 'src/app/features/broker/project-details-dialog/project-details.service';
import { CreateClientComponent } from 'src/app/features/global/create-client/create-client.component';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};

@Component({
    selector: 'app-quote-draft-page',
    templateUrl: './quote-draft-page.component.html',
    styleUrls: ['./quote-draft-page.component.scss']
})
export class QuoteDraftPageComponent implements OnInit {

    id: string;
    quote: IQuoteSlip;
    categorySelected = false;
    productSelected = false;
    products: IProduct[] = []
    quoteOption: IQuoteOption

    location: IQuoteLocationOccupancy[];
    totalRecords: number;

    toWords = new ToWords();
    uploadHttpHeaders: HttpHeaders;
    uploadUrl: string;
    uploadAIDocUrl: string;
    uploadExpiryCopyUrl: string;
    importOptions: MenuItem[];

    riskStartDate;

    today: string = new Date().toISOString().split('T')[0];

    productCarouselArray = [];
    coveragesArray: ICoverageType[] = [];
    responsiveOptions;
    user: IUser
    productImgs: any
    imageObj: any = [
        { label: "Property", imageUrl: 'assets/icons/Property_icon.png' },
        { label: "People Solutions", imageUrl: 'assets/icons/EB_IconEB.png' },
        { label: "Liability", imageUrl: 'assets/icons/Liability_icon.png' },
        { label: "Marine", imageUrl: 'assets/icons/Marine_icon.png' }
    ]

    //Intergation-EB [Start]
    isFlatGraded: string = "flat";
    isPlanTypeIndividualfloater: string = "Floater";
    isTableTypeNamedUnnamed: string = "Named";
    isFileUploadTypeAggregate: string = 'Normal';

    isGraded: boolean = false;
    productCategoryId: [];
    filteredProducts: any[] = [];
    carouselProducts: any[] = [];
    siFlat: any;
    isEmpData: boolean = false;
    templateName: string = ""
    quoteGmcOptions: QuoteGmcTemplate = new QuoteGmcTemplate();
    quoteWCOptions: WCTemplate = new WCTemplate();
    claimExperienceLst: GmcClaimExperience[] = []
    optionsSumInsured: ILov[] = [];
    optionsSumInsuredmaster: ILov[] = [];
    slectedValueSI: any;
    isDemographyFileuploaded: boolean = false
    isRateFileuploaded: boolean = false
    gmcTemplate: IGMCTemplate[]
    marineCovers: IClauses[]
    quoteGmcOptionsLst: IQuoteGmcTemplate[];
    marinePolicyTypeLst: ILov[] = [];
    selectedCoverageType: ICoverageType
    totalSumAssured: any
    isRateData: boolean = false;
    productName = '';
    YesNoList: [{ label: "Yes", value: "No" }];
    categoryOptions: any[] = [];
    carouselCategory: any[] = [];

    productCategorySingleID: Array<{ label: any; value: any; }> = [];

    selectedCategory: string | { label: string, value: string } = '';
    selectedCategoryId: string = '';
    employeeInfo: IEmployeesDemoSummary[] = [];
    productType: string = ""

    policyTenureYears: any;

    optionsIndmenityPeriod: ILov[] = [];

    isError: boolean = false
    isMobile: boolean = false;

    optionsTurnOverThreshold: ILov[] = []
    selectedInsuredBusinessActivity: any;
    optionsInsuredBusinessActivity: ILov[] = []
    selectedPolicyTypeEandO: any;
    selectedCGLProductType: any;
    OptionEandOPoilcyTypes: ILov[] = []
    OptionCGLTypeOfProducts: ILov[] = []
    EandOCoversArray: liabiltyAddOnCovers[] = []

    selectedInsuredBusinessActivityCGL: any;
    optionsInsuredBusinessActivityCGL: ILov[] = []
    liabiltyCoversArrayCGL: liabiltyCGLAddOnCovers[] = []
    quoteCGLOptions: CGLTemplate = new CGLTemplate();


    selectedInsuredBusinessActivityProduct: any;
    optionsInsuredBusinessActivityProduct: ILov[] = []
    liabiltyCoversArrayProduct: liabiltyProductAddOnCovers[] = []
    quoteProductOptions: ProductLiabilityTemplate = new ProductLiabilityTemplate();


    liabiltyExclusions: SubjectivityAndMajorExclusions[] = []
    liabiltySubjectivities: SubjectivityAndMajorExclusions[] = []

    // New_Quote_Option
    quoteOptionId: string
    private currentPropertyQuoteOption: Subscription;
    quoteOptionData: IQuoteOption
    aiAttachment: BasicDetailsAttachments[] = []

    sectors: ISector[] = [];
    clients: IClient[] = [];
    optionsQuoteType: ILov[] = [];
    selectedData = {
        sectorId: '',
        clientId: '',
        quoteType: '',
        insuredBusiness: ''
    };
    expiredDetailsData: IExpiredDetails
    projectDetailsData: IProject;
    policyStartDate: string
    policyEndDate: string
    projectDate: string
    // expiredQuoteOption: boolean
    hideExpiredTermCheckbox: any

    OptionEBPoilcyTypes: ILov[] = [];
    OptionEBPlans: ILov[] = [];
    projectTenure: any;
    policyTenure: any;
    minStartDate: any;
    minEndDate: any;


    //LiabilityDrafttoTemplate
    insuredBusinessActivityId: string;
    insuredBusinessActivityOther: string = "";
    limitOfLiability: number = 0;
    isOfferIndication: boolean = false;
    categoryName: any;
    productNames: IQuoteSlip;
    typeOfProductId: string;
    //Intergation-EB [End]
    constructor(
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private primengConfig: PrimeNGConfig,
        private productService: ProductService,
        private productPartnerConfigurationService: ProductPartnerConfigurationService,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private router: Router,
        private appService: AppService,
        private accountService: AccountService,
        public messageService: MessageService,
        private clientLocationService: ClientLocationService,
        private gmcMasterService: GmcMasterService,
        private clausesService: ClausesService,
        private qoutegmctemplateserviceService: QoutegmctemplateserviceService,
        private quotemarinetemplateService: QuotemarinetemplateService,
        private quoteWcTemplateService: QuoteWcTemplateService,
        private employeeService: GmEmloyeesService,
        private sumInsuredService: SumInsuredService,
        private indicativePremiumCalcService: IndicativePremiumCalcService,
        private gmcQuoteTemplateService: QoutegmctemplateserviceService,
        private coverageTypesService: CoverageTypesService,
        private wcRatesFileUploadService: WCRatesFileUploadService,
        private deviceService: DeviceDetectorService,
        private wclistofmasterservice: WCListOfValueMasterService,
        private liabilityTemplateService: liabilityTemplateService,
        private liabilityCGLTemplateService: liabilityCGLTemplateService,
        private liabilityProductTemplateService: liabilityProductTemplateService,

        private addonCoverService: AddonCoverService,
        private liabilityEandOTemplateService: liabilityEandOTemplateService,
        private quoteOptionService: QuoteOptionService,
        private sectorService: SectorService,
        private clientService: ClientService,
        private fb: FormBuilder,
        private expiredDetailsDialogFormService: ExpiredDetailsDialogFormService,
        private projectDetailsService: ProjectDetailsService

    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
        // this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        if (!this.riskStartDate) {
            this.riskStartDate = this.today;
        }
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3,
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2,
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1,
            },
        ];

        this.accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
            }
        })

        this.optionsQuoteType = OPTIONS_QUOTE_TYPES;
        // New_Quote_Option
        // if (this.activatedRoute.snapshot.queryParams.quoteOptionId) {
        //     this.quoteOptionId = this.activatedRoute.snapshot.queryParams.quoteOptionId
        // } else {
        // this.getQuoteOptions(this.id)
        // }

    }

    ngOnInit(): void {
        this.loadSectorRecords()
        this.loadClientsRecords()
        this.isMobile = this.deviceService.isMobile();
        this.marinePolicyTypeLst = OPTIONS_MARINE_POLICY_TYPE
        this.OptionEBPlans = OPTIONS_PLAN_EB
        this.OptionEBPoilcyTypes = OPTIONS_POLICY_TYPE_EB
        //Intergation-EB [Start]
        this.uploadUrl = `${environment.apiUrl}/quotes/import-data/${this.id}`
        this.uploadAIDocUrl = this.quoteService.docforAIUploadUrl(this.id);

        //minStartDate
        const today = new Date();
        this.minEndDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
        this.minStartDate = oneMonthAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        this.quoteGmcOptions.siFlat = 0

        this.loadProductRecords();

        this.primengConfig.ripple = true;

        this.loadQuoteDetails(this.id);

        this.searchOptionsSumInsured("")

        this.quoteOptionId = this.activatedRoute.snapshot?.queryParams?.quoteOptionId;
        if (this.activatedRoute.snapshot?.queryParams?.quoteOptionId) {
            this.loadQuoteOption(this.quoteOptionId)
        }
        // this.getQuoteOptionsByQuoteId()


        this.uploadExpiryCopyUrl = this.quoteOptionService.expiryCopyUploadUrl(this.quoteOptionId);

        this.importOptions = [
            {
                label: 'Upload Risk Location Occupancies Excel', icon: 'pi pi-upload', command: () => {

                    // console.log(this.clientLocation)
                    this.dialogService.open(UploadStepWiseExcelForQuoteComponent, {
                        header: "Upload Risk Occupancy",
                        data: {
                            quote: this.quote,
                            quoteOption: this.quoteOptionId,
                            activeTab: "uploadLocationOccupancy"
                            // quoteId: this.quote._id,
                            // clientLocationId: this.clientLocation?._id,

                        },
                        width: '35%',
                        height: 'h-100',
                        styleClass: "flatPopup"
                    }).onClose.subscribe(() => {
                        this.quoteService.get(this.quote._id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                this.quoteService.setQuote(dto.data.entity)
                                this.quoteService.refresh()
                                this.loadQuoteDetails(dto.data.entity._id)
                                this.loadQuoteLocationOccupancyList(DEFAULT_RECORD_FILTER)
                                setTimeout(() => {
                                    this.loadQuoteOption(this.quoteOptionId)
                                }, 1000);
                            }
                        })
                    })

                }
            },
        ];
        this.productService.getACategoryProductMaster().subscribe(
            (response: any) => {
                const data = response.data;
                if (Array.isArray(data.entities)) {
                    this.categoryOptions = data.entities.map(item => ({ label: item.name, value: item._id, imgUrl: this.imageObj.find((ele) => ele.label == item.name)?.imageUrl }));
                    this.carouselCategory = this.divideArray(this.categoryOptions, this.categoryOptions.length, 4);
                    if (this.templateName == AllowedProductTemplate.GMC) {
                        let categoryOpt = this.categoryOptions.filter(x => x.label == 'People Solutions')[0]
                        this.onCategoryChange(categoryOpt.value);
                    }

                } else {
                    console.error('Invalid data received:', data);
                }
            },
            error => {
                console.error('Error fetching category names:', error);
            }
        );


        this.quoteService.getCategoryIdDetails(this.id).subscribe(
            (response: any) => {
                const data = response.data;
                if (data && data.entity && data.entity.productId?.categoryId) {
                    this.productCategorySingleID = [{ label: data.entity.productId.categoryId, value: data.entity.productId.categoryId }];

                    const matchedCategoryOption = this.categoryOptions.find(option => option.value === this.productCategorySingleID[0].value._id);
                    if (matchedCategoryOption) {
                        this.selectedCategory = matchedCategoryOption;
                        console.log(this.productCategorySingleID[0].value._id);

                        // @ts-ignore
                        this.selectedCategoryId = this.selectedCategory?.value;
                        this.filteredProducts = this.products.filter(product => product.categoryId === this.selectedCategoryId);
                        this.productImgs = this.categoryOptions.filter(item => item.value === this.selectedCategoryId).map(item => item.imgUrl);
                        this.carouselProducts = this.divideArray(this.filteredProducts, this.filteredProducts.length, 4);
                        this.categorySelected = true;

                    }
                } else {
                    console.error('Invalid data received:', data);
                }
            },
            error => {
                console.error('Error fetching category names:', error);
            }
        );
        this.isPaginatorVisible();
        this.getExpiredDetails();

    }

    divideArray(nums, K, N) {
        let ans = [];
        let temp = [];
        for (let i = 0; i < K; i++) {
            temp.push(nums[i]);
            if (((i + 1) % N) == 0) {
                ans.push(temp);
                temp = [];
            }
        }
        if (temp.length > 0) {
            ans.push(temp);
        }
        return ans;
    }

    onCategoryChange(id: any) {
        this.selectedCategoryId = id;
        this.templateName = '';
        const updatePayload = { ...this.quote }

        updatePayload['productId'] = null;
        this.quoteService.update(this.id, updatePayload).subscribe({
            next: quote => {

                this.productSelected = false;


                //Intergation-EB [End]
                this.quoteService.get(quote.data.entity._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quote = dto.data.entity;
                        // @ts-ignore
                        this.productName = this.quote.productId?.type
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            },
            error: error => {
                console.log(error);
            }
        });

        this.filteredProducts = this.products.filter(product => product.categoryId === this.selectedCategoryId);

        this.productImgs = this.categoryOptions.filter(item => item.value === this.selectedCategoryId).map(item => item.imgUrl);
        this.carouselProducts = this.divideArray(this.filteredProducts, this.filteredProducts.length, 4);

        this.categorySelected = true;
    }


    loadOptionsData(quoteOption: any[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }

    loadSelectedOption(quoteOption: any) {
        this.quoteService.setSelectedOptions(quoteOption)
    }
    //Intergation-EB [Start]
    getIndicativeQuoteGMC() {
        if (this.quote?.employeeDataId && this.quote?.productId) {
            this.quote.qcrVersion = this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1

            const updatePayload = { ...this.quote }

            this.quoteService.update(this.id, updatePayload).subscribe({
                next: quote => {

                    this.quoteService.generateQuoteNumber(this.id).subscribe({
                        next: quote => {
                            this.quoteService.get(quote.data.entity._id).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                    this.quote = dto.data.entity;
                                    this.quoteService.setQuote(dto.data.entity)
                                    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                                        next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                            this.loadOptionsData(dtoOption.data.entity);
                                            this.loadSelectedOption(dtoOption.data.entity[0])
                                            // if (this.quote.baseQuoteNo != undefined) {
                                            //     //Get base quote options and proceeds
                                            //     console.log("here" + this.quote.baseQuoteNo);
                                            //     this.quoteService.getQuoteByQuoteNo(this.quote.baseQuoteNo).subscribe({
                                            //         next: (dto: IOneResponseDto<IQuoteSlip>) => {

                                            //             if (dto.data.entity[0] != undefined) {
                                            //                 let baseQuoteId = dto.data.entity[0]._id
                                            //                 this.quoteService.getAllQuoteOptions(baseQuoteId).subscribe({
                                            //                     next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                            //                         const baseOption = dto.data.entity.find((x) => x.optionIndex === 1);
                                            //                         if (!baseOption) {
                                            //                             console.error("Base Option not found.");
                                            //                             return;
                                            //                         }
                                            //                         let selectedQuoteTemplate = dtoOption.data.entity[0]
                                            //                         // Replace the entire gmcTemplateData array in selectedQuoteTemplate
                                            //                         let selectedQuoteTemplates = {
                                            //                             ...selectedQuoteTemplate,
                                            //                             gmcTemplateData: baseOption.gmcTemplateData, // Replace all parentTabName values
                                            //                         };
                                            //                         selectedQuoteTemplate.quoteId = this.quote._id;
                                            //                         this.gmcQuoteTemplateService.updateArray(selectedQuoteTemplates._id, selectedQuoteTemplates).subscribe({
                                            //                             next: partner => {
                                            //                                 this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                                            //                                     next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                            //                                         this.loadOptionsData(dtoOption.data.entity);
                                            //                                         this.loadSelectedOption(dtoOption.data.entity[0])
                                            //                                         if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                                            //                                     },
                                            //                                     error: e => {
                                            //                                         console.log(e);
                                            //                                     }
                                            //                                 });
                                            //                                 this.messageService.add({
                                            //                                     severity: "success",
                                            //                                     summary: "Successful",
                                            //                                     detail: `Data fetched from base quote no` + this.quote.baseQuoteNo,
                                            //                                     life: 3000
                                            //                                 });
                                            //                             },
                                            //                             error: error => {
                                            //                                 console.log(error);
                                            //                             }
                                            //                         });
                                            //                     },
                                            //                     error: e => {
                                            //                         console.log(e);
                                            //                     }
                                            //                 });
                                            //             }
                                            //             else {
                                            //                 if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);

                                            //             }

                                            //         },
                                            //         error: e => {
                                            //             console.log(e);
                                            //         }
                                            //     });



                                            // }

                                            this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                                                next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                                    this.loadOptionsData(dtoOption.data.entity);
                                                    this.loadSelectedOption(dtoOption.data.entity[0])
                                                    if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });


                                            // if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
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
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                },
                error: error => {
                    console.log(error);
                }
            });


        } else {
            this.messageService.add({
                severity: "warn",
                summary: "Validation",
                detail: `Missing Required Fields.`,
                life: 3000
            })
        }
    }

    getAllGMCQuoteOptions() {
        this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
            next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                this.loadOptionsData(dtoOption.data.entity);
                this.loadSelectedOption(dtoOption.data.entity[0])
                //if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
            },
            error: e => {
                console.log(e);
            }
        });
    }
    //Update GMC Masters
    updateGMCMasters(quoteInfo: IQuoteSlip) {
        this.gmcMasterService.getPartnerwise(quoteInfo.partnerId['_id'], quoteInfo.productId['_id']).subscribe({
            next: records => {
                if (this.quoteGmcOptions._id == undefined) {
                    this.gmcTemplate = records.data.entities;
                    let gmcgradedlist: GmcGradedSI[] = []
                    const d = new Date();
                    let year = d.getFullYear();

                    let pastYear = year - 5;
                    for (let i = 0; i < 5; i++) {
                        let claim = new GmcClaimExperience();
                        claim.startYear = pastYear
                        claim.endYear = pastYear + 1;
                        pastYear = pastYear + 1
                        this.claimExperienceLst.push(claim);
                    }
                    let optString = "Option 1"
                    // if (this.quote.quoteType == AllowedQuoteTypes.NEW) {
                    //     optString = "Option 1"
                    // }
                    // else {
                    //     optString = "Expired Terms/Option 1"
                    // }

                    let gmcOtherDetails: GmcOtherDetails[] = []
                    gmcOtherDetails = [
                        { alignment: 'Cataract', sublimit: 0, description: "" },
                        { alignment: 'Harnia', sublimit: 0, description: "" },
                        { alignment: 'Total Knee Replacement', sublimit: 0, description: "" }]

                    let gmcBasicDetails = new GmcBasicDetails();
                    // Initialize policy details
                    gmcBasicDetails.gmcPolicyDetails = [
                        { name: 'Employee Count', inception: 0, asOnDate: 0, change: 0, proposed: 0 },
                        { name: 'Dependant Count', inception: 0, asOnDate: 0, change: 0, proposed: 0 },
                        { name: 'Total Lives', inception: 0, asOnDate: 0, change: 0, proposed: 0 },
                    ].map(item => {
                        let detail = new GmcPolicyDetails();
                        detail.name = item.name;
                        detail.inception = item.inception;
                        detail.asOnDate = item.asOnDate;
                        detail.change = item.change;
                        detail.proposed = item.proposed;
                        return detail;
                    });

                    // Initialize claim details
                    gmcBasicDetails.gmcClaimDetails = [
                        { name: 'Outstanding', count: 0, amount: 0 },
                        { name: 'Paid', count: 0, amount: 0 },
                        { name: 'Incurred', count: 0, amount: 0 },
                        { name: 'Closed', count: 0, amount: 0 },
                    ].map(item => {
                        let detail = new GmcClaimDetails();
                        detail.name = item.name;
                        detail.count = item.count;
                        detail.amount = item.amount;
                        return detail;
                    });

                    //GPA/GTL
                    // Create an instance of GpaGtlDetails
                    let gpaGtlFormDetails: GpaGtlFormDetails[] = [
                        new GpaGtlFormDetails('Total employees strength', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Total Sum Assured', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Total premium without gst', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Rates', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Number of claims reported', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Type of claim', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Reported claims count', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Reported claims amount', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Paid claims count', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Paid claims amount', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Outstanding claims count', new GpaGtlDetails()),
                        new GpaGtlFormDetails('Outstanding claims amount', new GpaGtlDetails()),
                    ];

                    //let gradedFormData.push({ grade: '', sumInsured: '', additionalColumn: '' });
                    let gradedFormData = [
                        { grade: '', sumInsured: '', additionalColumn: '' },
                        { grade: '', sumInsured: '', additionalColumn: '' },
                        { grade: '', sumInsured: '', additionalColumn: '' }
                    ];

                    let gradedFormDataMultiple = [
                        { grade: '', sumInsured: '', additionalColumn: '', roomEligible: '' },
                        { grade: '', sumInsured: '', additionalColumn: '', roomEligible: '' },
                        { grade: '', sumInsured: '', additionalColumn: '', roomEligible: '' }
                    ];
                    let otherDetailsInstallment: Installment[] = []

                    let icoInsurers: IcoInsurers[] = []
                    let coBrokers: ICoBroker[] = []

                    const record: any = {
                        quoteId: quoteInfo._id,
                        gmcTemplateData: this.gmcTemplate,
                        employeeDemographic: new EmployeeDemographic(),
                        finalRater: new FinalRater(),
                        claimExperience: this.claimExperienceLst,
                        gmcGradedSILst: gmcgradedlist,
                        siType: "Flat",
                        siFlat: 0,
                        isOptionSelected: true,
                        optionName: "Option 1",
                        selectedFromOptionNo: optString,
                        options: [optString],
                        optionIndex: 1,
                        isAccepted: "",
                        isQuoteOptionPlaced: false,
                        basicDeatilsQCRAttachments: [],
                        indicativePremium: 0,
                        totalFinalRater: 0,
                        brokarage: 0,
                        otherTerms: [],
                        otherTermText: "",
                        coverageTypeId: "",
                        coverageTypeName: "",
                        coverageInfo: "",
                        claimsDocument: new IFileModel(),
                        calculatedPremium: 0,
                        planType: this.isPlanTypeIndividualfloater,
                        fileUploadType: this.isFileUploadTypeAggregate,
                        dayCareFilePath: "",
                        dayCareFileName: "",
                        version: 1,
                        gmcBasicDetails: gmcBasicDetails,
                        gpaGtlFormDetails: gpaGtlFormDetails,
                        gmcOtherDetails: gmcOtherDetails,
                        gradedFormData: gradedFormData,
                        gradedFormDataMultiple: gradedFormDataMultiple,
                        otherDetailsInstallment: otherDetailsInstallment,
                        isExpired: false,
                        referenceNo: "",
                        chequeNo: "",
                        bankName: "",
                        paymentDate: "",
                        paymentAmount: "",
                        premiumDetails: "",
                        cgst: "",
                        sgst: "",
                        igst: "",
                        totalGST: "",
                        totalGSTAmount: "",
                        amountWithGST: "",

                        isCobroker: false,
                        isCoInsurer: false,
                        coInsurers: icoInsurers,
                        coBrokers: coBrokers,
                        policyStartDate: "",
                        policyEndDate: "",
                        projectDate: "",
                        rewards: "",
                        showClaimHistory: false,
                        originalQuoteOptionId: null,
                        topUpType: ""

                    };
                    let payload = {}
                    payload['record'] = record;
                    payload['quoteId'] = quoteInfo._id;
                    this.qoutegmctemplateserviceService.createAndUpdateOption(payload).subscribe({
                        next: quote => {
                            this.getOptions()
                            this.DemographyFileuploaded();
                            this.onPlanTypeChanged(null)
                            this.onFileUploadTypeChanged(null)

                        },
                        error: error => {
                            console.log(error);
                            this.getOptions()
                            this.DemographyFileuploaded();
                            this.onPlanTypeChanged(null)
                            this.onFileUploadTypeChanged(null)
                        }
                    });
                }
                else {
                    this.getOptions()
                    this.DemographyFileuploaded();
                }

            },
            error: e => {
                console.log(e);
                this.DemographyFileuploaded();
            }

        });
    }
    createWCData(quoteId) {
        let optString = "Option 1"
        if (this.quote.quoteType == AllowedQuoteTypes.NEW) {
            optString = "Option 1"
        }
        else {
            optString = "Expiry Terms/Option 1"
        }
        const record: any = {
            quoteId: quoteId,
            wcCoverAddOnCovers: [],
            medicalBenifits: false,
            medicalBenifitsAns: "Yes",
            medicalBenifitsAmount: 0,
            medicalBenifitsAmountId: "",
            allmedicalBenifitsYesNo: true,
            targetPremium: 0,
            adjustedPremium: 0,
            indicativePremium: 0,
            discountbasedonPremium: 0,
            addonCoversAmount: 0,
            totalPremiumAmt: 0,
            underWriteradjustedPremium: 0,
            underWriteraddonCoversAmount: 0,
            underWriterdiscountbasedonPremium: 0,
            underWriterindicativePremium: 0,
            underWritertargetPremium: 0,
            underWritertotalPremiumAmt: 0,
            safetyMeasures: "",
            wcDetails: [],
            basicDetailsAttchments: [],
            medicalBenifitsOption: "",
            isActual: false,
            underWritermedicalBenifitsAmount: 0,
            underWritermedicalBenifitsAmountId: "",
            underWritermedicalBenifitsOption: "",
            underWriterisActual: false,
            tableType: this.isTableTypeNamedUnnamed,
            //previousPolicyDetails:"",
            previousCompany: "",
            previousPolicyno: "",
            previousStartdate: null,
            previousEnddate: null,
            subjectivity: [],
            majorExclusions: [],
            deductibles: [],
            isOptionSelected: true,
            optionName: "Option 1",
            selectedFromOptionNo: optString,
            options: [optString],
            optionIndex: 1,
            isAccepted: "",
            isQuoteOptionPlaced: false,
            juridiction: "India Only",
            territory: "India Only",
            version: 1,
            referenceNo: "",
            chequeNo: "",
            bankName: "",
            paymentDate: "",
            paymentAmount: "",
            premiumDetails: [],
            coInsurers: [],
            insuredBusinessActivityId: null,
            insuredBusinessActivityOther: "",
            isOfferIndication: false,
            isExpired: false
        };
        let payload = {}
        payload['record'] = record;
        payload['quoteId'] = quoteId;
        this.quoteWcTemplateService.createAndUpdateOption(payload).subscribe({
            next: (option: any) => {
                // this.quoteOptionId = option.data.entity._id
                // //this.loadQuoteDetails(this.id);
                // this.quoteService.get(this.id).subscribe({
                //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
                //         this.quote = dto.data.entity;
                //     },
                //     error: error => {
                //         console.log(error);
                //     }
                // });
            },
            error: error => {
                console.log(error);
            }
        });
    }

    createDandOData(quoteId) {
        let optString = "Option 1"
        if (this.quote.quoteType == AllowedQuoteTypes.NEW) {
            optString = "Option 1"
        }
        else {
            optString = "Expired Terms/Option 1"
        }
        const record: any = {
            quoteId: quoteId,
            detailsOfBusinessActivity: "",
            typeOfPolicyId: null,
            natureOfBusinessId: null,
            ageOfCompanyId: null,
            retroactiveCoverId: null,
            dateOfIncorporation: new Date(),
            auditedReportFilePath: "",
            proposalFormFilePath: "",
            anyAdditionalInfoFilePath: "",
            totalPremiumAmt: 0,
            aoaAoyId: null,
            anyOneAccident: 0,
            inTheAggregate: 0,
            juridiction: "",
            territory: "",
            additionalInformation: "",

            //businessAsPerCompanyId: null,
            subJoinVentureDocsFilePath: "",
            subJoinVentureDocsFileName: "",
            subsidaryDetails: [],
            subjectivity: [],
            majorExclusions: [],
            liabiltyCovers: [],
            deductibles: [],
            basicDetailsAttchments: [],
            revenueDetails: null,
            //CL
            juridictionId: null,
            territoryId: null,
            employeesDetails: [],
            totalNumberOfEmployees: 0,
            isBreakupRevenueORTurnover: "Revenue",
            isOptionSelected: true,
            optionName: "Option 1",
            selectedFromOptionNo: optString,
            options: [optString],
            optionIndex: 1,
            isAccepted: "",
            isQuoteOptionPlaced: false,
            version: 1,
            referenceNo: "",
            chequeNo: "",
            bankName: "",
            paymentDate: "",
            paymentAmount: "",
            premiumDetails: [],
            coInsurers: [],
            insuredBusinessActivityId: null,
            insuredBusinessActivityOther: "",
            limitOfLiability: 0,
            isOfferIndication: false,
            isExpired: false

        };
        let payload = {}
        payload['record'] = record;
        payload['quoteId'] = quoteId;
        this.liabilityTemplateService.createAndUpdateOption(payload).subscribe({
            next: quote => {
            },
            error: error => {
                console.log(error);
            }
        });
    }

    createCGLData(quoteId) {
        let optString = "Option 1"
        if (this.quote.quoteType == AllowedQuoteTypes.NEW) {
            optString = "Option 1"
        }
        else {
            optString = "Expired Terms/Option 1"
        }
        const record: any = {
            quoteId: quoteId,
            detailsOfBusinessActivity: "",
            typeOfPolicyId: null,
            typeOfPolicy: "",//Public Liability
            detailsOfHazardousChemical: "",//Public Liability
            aoaAoyId: null,//Public Liability
            anyOneAccident: 0,//Public Liability
            inTheAggregate: 0,//Public Liability
            jurasdiction: "",//Public Liability
            territory: "",//Public Liability
            retroactiveCoverId: null,
            detailsOfProductAndUsage: "",
            retroactiveDate: new Date(),
            additionalInformation: "",

            totalPremiumAmt: 0,
            //territory & subsidiary details
            juridictionId: null,
            territoryId: null,

            subsidaryDetails: [],

            //Turn Over Details
            turnOverDetails: null,

            liabiltyCovers: [],
            basicDetailsAttchments: [],
            listOfLocations: [],
            subjectivity: [],
            majorExclusions: [],
            deductibles: [],
            isOptionSelected: true,
            optionName: "Option 1",
            selectedFromOptionNo: optString,
            options: [optString],
            optionIndex: 1,
            isAccepted: "",
            isQuoteOptionPlaced: false,
            isBreakupRevenueORTurnover: "Revenue",
            version: 1,
            referenceNo: "",
            chequeNo: "",
            bankName: "",
            paymentDate: "",
            paymentAmount: "",
            premiumDetails: [],
            coInsurers: [],
            typeOfProductId: null,
            insuredBusinessActivityId: null,
            insuredBusinessActivityOther: "",
            limitOfLiability: 0,
            isOfferIndication: false,
            isExpired: false
        };
        let payload = {}
        payload['record'] = record;
        payload['quoteId'] = quoteId;
        this.liabilityCGLTemplateService.createAndUpdateOption(payload).subscribe({
            next: quote => {
            },
            error: error => {
                console.log(error);
            }
        });
    }

    createProductData(quoteId) {
        let optString = "Option 1"
        if (this.quote.quoteType == AllowedQuoteTypes.NEW) {
            optString = "Option 1"
        }
        else {
            optString = "Expired Terms/Option 1"
        }
        const record: any = {
            quoteId: quoteId,
            detailsOfBusinessActivity: "",
            typeOfPolicyId: null,
            retroactiveCoverId: null,
            numberOfExperienceId: null,
            detailsOfProductAndUsage: "",
            retroactiveDate: new Date(),
            additionalInformation: "",

            totalPremiumAmt: 0,
            //territory & subsidiary details
            juridictionId: null,
            territoryId: null,
            juridiction: "Worldwide",
            territory: "Worldwide",
            subsidaryDetails: [],

            //Turn Over Details
            turnOverDetails: null,

            liabiltyCovers: [],
            basicDetailsAttchments: [],
            subjectivity: [],
            majorExclusions: [],
            //deductibles
            deductibles: [],
            isOptionSelected: true,
            optionName: "Option 1",
            selectedFromOptionNo: optString,
            options: [optString],
            optionIndex: 1,
            isAccepted: "",
            isQuoteOptionPlaced: false,
            isBreakupRevenueORTurnover: "Revenue",
            version: 1,
            referenceNo: "",
            chequeNo: "",
            bankName: "",
            paymentDate: "",
            paymentAmount: "",
            premiumDetails: [],
            coInsurers: [],
            insuredBusinessActivityId: null,
            insuredBusinessActivityOther: "",
            limitOfLiability: 0,
            isOfferIndication: false,
            isExpired: false
        };
        let payload = {}
        payload['record'] = record;
        payload['quoteId'] = quoteId;
        this.liabilityProductTemplateService.createAndUpdateOption(payload).subscribe({
            next: quote => {
            },
            error: error => {
                console.log(error);
            }
        });
    }

    createEandOData(quoteId) {
        let optString = "Option 1"
        if (this.quote.quoteType == AllowedQuoteTypes.NEW) {
            optString = "Option 1"
        }
        else {
            optString = "Expired Terms/Option 1"
        }
        const record: any = {
            quoteId: quoteId,
            detailsOfBusinessActivity: "",

            typeOfPolicy: "",
            numberOfExperienceId: null,
            retroactiveCoverId: null,
            retroactiveDate: new Date(),
            totalPremiumAmt: 0,
            additionalInformation: "",
            //territory & subsidiary details
            juridictionId: null,
            territoryId: null,
            subsidairyAnnualReportFilePath: "",
            subsidaryDetails: [],
            isOptionSelected: true,
            optionName: "Option 1",
            selectedFromOptionNo: optString,
            options: [optString],
            optionIndex: 1,
            isAccepted: "",
            isQuoteOptionPlaced: false,
            //Revenue Details
            revenueDetails: null,

            //Deductable
            deductibles: [],
            liabiltyCovers: [],
            basicDetailsAttchments: [],
            subjectivity: [],
            majorExclusions: [],
            isBreakupRevenueORTurnover: "Revenue",
            version: 1,
            referenceNo: "",
            chequeNo: "",
            bankName: "",
            paymentDate: "",
            paymentAmount: "",
            premiumDetails: [],
            coInsurers: [],
            insuredBusinessActivityId: null,
            insuredBusinessActivityOther: "",
            limitOfLiability: 0,
            isOfferIndication: false,
            isExpired: false
        };
        let payload = {}
        payload['record'] = record;
        payload['quoteId'] = quoteId;
        this.liabilityEandOTemplateService.createAndUpdateOption(payload).subscribe({
            next: quote => {
            },
            error: error => {
                console.log(error);
            }
        });
    }

    //Create Marine Data
    createMarineData(quoteId) {
        this.clausesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
            next: records => {
                this.marineCovers = records.data.entities;
                let marineSIData = new MarineSIData();
                marineSIData.transitType = null
                marineSIData.locationFrom = ""
                marineSIData.locationTo = ""
                marineSIData.selectedCountry = null
                marineSIData.conveyanveType = null;
                marineSIData.conveyanceList = []
                marineSIData.interest = null;
                marineSIData.packaging = null;
                marineSIData.transitType = null;
                marineSIData.interestList = []
                marineSIData.packagingList = []
                marineSIData.policyEndDate = new Date()
                marineSIData.policyStartDate = new Date()
                marineSIData.marineSISplit = new MarineSISplit();
                const payload: IMarineTemplate = {
                    quoteId: quoteId,
                    marineSIData: marineSIData,
                    marineCoverAddOnCovers: this.marineCovers,
                    indicativePremium: 0,
                    isQuoteOptionPlaced: false,
                    otherDetails: [],
                    otherDetails1: "",
                    otherDetails2: "",
                    otherDetails3: "",
                    otherDetails4: "",
                    otherDetails5: ""
                };
                this.quotemarinetemplateService.create(payload).subscribe({
                    next: quote => {
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onTableTypeChange(event: any) {
        if (!this.quote.wcRatesDataId) {
            if (this.quote.wcTemplateDataId['_id'] != undefined) {
                const updatePayload = this.quote.wcTemplateDataId
                updatePayload['tableType'] = this.isTableTypeNamedUnnamed
                this.quoteWcTemplateService.updateArray(this.quote.wcTemplateDataId['_id'], updatePayload).subscribe({
                    next: partner => {
                        //console.log("ttest");
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        } else {
            this.messageService.add({
                severity: "warn",
                summary: "Alert",
                detail: `Please remove the file before changing the Table type`,
                life: 3000
            })
            if (this.isTableTypeNamedUnnamed == 'Named') {
                this.isTableTypeNamedUnnamed = 'Unnamed'
            } else {
                this.isTableTypeNamedUnnamed = 'Named'
            }
        }
    }

    beforeUploadHandler(event: any) {
        // Perform actions before upload

        this.onPlanTypeChanged(null)
    }
    onPlanTypeChanged(event: any) {
        let baseUrl = environment.apiUrl;
        this.bulkImportProps.url = `${baseUrl}/${this.id}/${this.isPlanTypeIndividualfloater}/${this.isFileUploadTypeAggregate}/excel-upload-v2`
        if (this.isEmpData) {
            if (this.quote?.employeeDataId['planType'] != this.isPlanTypeIndividualfloater) {
                this.messageService.add({
                    key: "error", severity: 'error', summary: 'Error', detail: "Please remove uploaded demography file for plan type " + this.isPlanTypeIndividualfloater + " first and then upload new file for plan type for " + this.isPlanTypeIndividualfloater,
                    icon: 'pi-times', closable: false
                });

            }
            this.isPlanTypeIndividualfloater = ""
            this.isPlanTypeIndividualfloater = this.quote?.employeeDataId['planType']
            this.isFileUploadTypeAggregate = ""
            this.isFileUploadTypeAggregate = this.quote?.employeeDataId['fileUploadType']

        }
        else {
            this.bulkImportProps.url = `${baseUrl}/${this.id}/${this.isPlanTypeIndividualfloater}/${this.isFileUploadTypeAggregate}/excel-upload-v2`

            if (this.quoteGmcOptions._id != undefined) {
                const updatePayload = this.quoteGmcOptions
                updatePayload.planType = this.isPlanTypeIndividualfloater
                updatePayload.fileUploadType = this.isFileUploadTypeAggregate
                this.gmcQuoteTemplateService.updateArray(this.quoteGmcOptions._id, updatePayload).subscribe({
                    next: partner => {
                        //console.log("ttest");
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            // const updatePayload = this.quoteGmcOptions
            // updatePayload.planType = this.isPlanTypeIndividualfloater
            // updatePayload.fileUploadType = this.isFileUploadTypeAggregate
            // if (this.quoteGmcOptions._id != undefined) {
            //     this.gmcQuoteTemplateService.updateArray(this.quoteGmcOptions._id, updatePayload).subscribe({
            //         next: partner => {
            //             //console.log("ttest");
            //         },
            //         error: error => {
            //             console.log(error);
            //         }
            //     });
            // }
        }


    }

    addRow() {
        this.quoteGmcOptions.gradedFormData.push({ grade: '', sumInsured: '', additionalColumn: '' });
    }
    deleteRow(index: number) {
        this.quoteGmcOptions.gradedFormData.splice(index, 1);
    }
    onGradeFlatChange() {
        this.slectedValueSI = ""
        this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                const quoteGmcOptionsLst = dto.data.entity;
                if (quoteGmcOptionsLst.length > 0) {
                    this.quoteGmcOptions = quoteGmcOptionsLst.filter(x => x.optionName == 'Option 1')[0];
                    if (this.isFlatGraded == 'Flat') {
                        this.quoteGmcOptions.siType = 'Flat'
                    }
                    if (this.isFlatGraded == 'ctclinked') {
                        this.quoteGmcOptions.siType = 'CTC Linked'
                    }
                    if (this.isFlatGraded == 'graded') {
                        this.quoteGmcOptions.siType = 'Graded'

                    }
                    this.quoteGmcOptions.gmcGradedSILst = []
                    if (this.siFlat == undefined) {
                        this.quoteGmcOptions.siFlat = 0
                    }
                    else {
                        this.quoteGmcOptions.siFlat = +this.siFlat.label
                    }
                    const updatePayload = this.quoteGmcOptions
                    if (this.quoteGmcOptions._id != undefined) {
                        this.gmcQuoteTemplateService.updateArray(this.quoteGmcOptions._id, updatePayload).subscribe({
                            next: partner => {
                                //console.log("ttest");
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    }

                }
            },
            error: e => {
                console.log(e);
            }
        });




    }

    getOptions() {
        this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                this.quoteGmcOptions = dto.data.entity[0];
                this.isFlatGraded = this.quoteGmcOptions.siType.toLowerCase()
                if (this.isFlatGraded == 'flat') {
                    this.quoteGmcOptions.gmcGradedSILst = []
                    this.quoteGmcOptions.siFlat = 0
                }

                this.isPlanTypeIndividualfloater = this.quoteGmcOptions.planType;
                this.isFileUploadTypeAggregate = this.quoteGmcOptions.fileUploadType;
            },
            error: e => {
                console.log(e);
            }
        });
    }


    ConvertStringToNumber(input: any) {

        if (input != null && input != undefined) {
            if (input.label == null || input.label == undefined) {
                return 0;
            }
        }
        else {
            return 0;
        }

        if (input.label.trim().length == 0) {
            return 0;
        }
        this.quote.totalSumAssured = Number(input.label);
        return Number(input.label);
    }

    convertToWords(si: number) {
        let result = this.toWords.convert((si) ?? 0, {
            currency: true,
            ignoreZeroCurrency: true
        })
        return result;
    }

    searchOptionsSumInsured(event) {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                name: [
                    {
                        value: "",
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.sumInsuredService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsSumInsured = data.data.entities.sort((n1, n2) => +n1.sumInsured - +n2.sumInsured).map(entity => ({ label: '₹ ' + Intl.NumberFormat('en-IN').format(+entity.sumInsured).toString(), value: entity._id }));
            },
            error: e => { }
        });
    };

    onSISelect(event) {
        let label = event.value.label.replace(/\D/g, '');
        this.slectedValueSI = event.value;
        // let amt = event.label.replaceAll('₹', '');
        // let amount = amt.replaceAll(',','')
        let siamount = label.replace(/\D/g, '');
        const updatePayload = this.quoteGmcOptions
        updatePayload.siType = "Flat";
        updatePayload.siFlat = +siamount
        this.quoteGmcOptions.siFlat = +siamount

        this.gmcQuoteTemplateService.updateArray(this.quoteGmcOptions._id, updatePayload).subscribe({
            next: partner => {
                //console.log("ttest");
            },
            error: error => {
                console.log(error);
            }
        });
    }

    getEmpCoverageQuoteDialog() {
        const ref = this.dialogService.open(GmcCoverageDetailsDialogComponent, {
            header: "Family Definition and Demography",
            data: {
                quote_id: this.id,
                clientId: this.quote.clientId,
                fileUploadType: this.isFileUploadTypeAggregate,
                quote: this.quote,
            },
            width: "50vw",
            styleClass: "customPopup",
            contentStyle: { overflow: 'hidden' }
        }).onClose.subscribe(() => {
            this.loadQuoteDetails(this.id);
            this.slectedValueSI = 0
        })
    }

    getSelectedCoverageType() {
        this.coverageTypesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
            next: records => {

                this.coveragesArray = records.data.entities;
                if (this.coveragesArray.length > 0) {
                    if (this.quote?.employeeDataId != undefined && this.quote?.employeeDataId != null) {
                        if (this.quote?.employeeDataId['coverageTypeId'] != null && this.quote?.employeeDataId['coverageType'] != null) {
                            this.selectedCoverageType = this.coveragesArray.find(x => x._id == this.quote?.employeeDataId['coverageTypeId'] && x.abbreviation == this.quote?.employeeDataId['coverageType']);
                        }
                    }
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onFileUploadTypeChanged(event: any) {
        let baseUrl = environment.apiUrl;
        this.bulkImportProps.url = `${baseUrl}/${this.id}/${this.isPlanTypeIndividualfloater}/${this.isFileUploadTypeAggregate}/excel-upload-v2`
        if (this.isEmpData) {
            if (this.quote?.employeeDataId['fileUploadType'] != this.isFileUploadTypeAggregate) {
                this.messageService.add({
                    key: "error", severity: 'error', summary: 'Error', detail: "Please remove uploaded demography file for plan type " + this.isPlanTypeIndividualfloater + " first and then upload new file for plan type for " + this.isPlanTypeIndividualfloater,
                    icon: 'pi-times', closable: false
                });
            }
            this.isFileUploadTypeAggregate = ""
            this.isFileUploadTypeAggregate = this.quote?.employeeDataId['fileUploadType']
        }
        else {
            this.bulkImportProps.url = `${baseUrl}/${this.id}/${this.isPlanTypeIndividualfloater}/${this.isFileUploadTypeAggregate}/excel-upload-v2`


            const updatePayload = this.quoteGmcOptions
            updatePayload.planType = this.isPlanTypeIndividualfloater
            updatePayload.fileUploadType = this.isFileUploadTypeAggregate
            if (this.quoteGmcOptions._id != undefined) {
                this.gmcQuoteTemplateService.updateArray(this.quoteGmcOptions._id, updatePayload).subscribe({
                    next: partner => {
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }


    }

    onUploadExpiryPolicy() {

        // New_Quote_Option
        this.quoteOptionService.get(`${this.quoteOptionData._id}`).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionData = dto.data.entity;
                }
            },
            error: e => {
                console.log(e);
            }
        });

    }

    downloadExpiryCopy() {

        // New_Quote_Option
        this.quoteOptionService.expiryCopyDownload(this.quoteOptionId).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Expiry Copy';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);
                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }

    deleteExpiryCopy() {

        // New_Quote_Option
        this.quoteOptionService.expiryCopyDelete(this.quoteOptionId).subscribe({
            next: () => {
                this.quoteOptionService.get(`${this.quoteOptionData._id}`).subscribe({
                    next: (dto: IOneResponseDto<IQuoteOption>) => {
                        this.quoteOptionData = dto.data.entity;
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }


    DemographyFileuploaded() {
        if (this.quote != null && this.quote != undefined) {

            if (this.quote?.employeeDataId != null && this.quote?.employeeDataId != undefined) {
                this.isFileUploadTypeAggregate = this.quote?.employeeDataId['fileUploadType'];
                if (this.isFileUploadTypeAggregate == "Normal") {
                    if (this.quote?.employeeDataId['employeeData'].length > 0) {
                        this.isDemographyFileuploaded = true;
                        this.isEmpData = true;
                        this.quoteService.setQuote(this.quote)
                        this.templateName == this.quote?.productId['productTemplate']
                    }
                    else {
                        this.isDemographyFileuploaded = false;
                        this.isEmpData = false;
                        // this.isEmpData = true;
                    }
                }
                else {

                    if (this.quote?.employeeDataId['aggregateData'].length > 0) {
                        this.isDemographyFileuploaded = true;
                        this.isEmpData = true;
                        this.quoteService.setQuote(this.quote)
                        this.templateName == this.quote?.productId['productTemplate']
                    }
                    else {
                        this.isDemographyFileuploaded = false;
                        this.isEmpData = false;
                        // this.isEmpData = true;
                    }
                }
            }
            else {
                // this.isDemographyFileuploaded=false;
                // this.isEmpData = true;
                this.templateName == this.quote?.productId['productTemplate']
            }



        }
        else {
            this.isDemographyFileuploaded = false;
            this.isEmpData = true;
            this.templateName == this.quote?.productId['productTemplate']
        }
    }

    getGMCEmployeeViewDialog() {
        const ref = this.dialogService.open(QuoteGmcEmployeeviewDialogComponent, {
            header: "Details of Employees",
            data: {
                quote_id: this.id,
                clientId: this.quote.clientId,
                fileUploadType: this.isFileUploadTypeAggregate,
                quote: this.quote,
            },
            width: "50vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            this.loadQuoteDetails(this.id);
        })
    }


    GMCEmployeeRemoveFile() {
        const updatePayload = { ...this.quote }
        if (this.quote?.employeeDataId != undefined) {
            const emp_id = this.quote?.employeeDataId['_id'];
            this.employeeService.delete(emp_id)
                .subscribe({
                    next: res => {
                        updatePayload['employeeDataId'] = null;
                        this.quoteService.update(this.id, updatePayload).subscribe({
                            next: quote => {

                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quote = dto.data.entity;
                                        this.isDemographyFileuploaded = false;
                                        this.isEmpData = false
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    },
                    error: e => {
                        console.log(e.error);
                        //   this.messageService.add({
                        //     severity: "fail",
                        //     summary: "Fail",
                        //     detail: e.error.message,
                        //     life: 3000
                        //   });
                    }
                });
        }
    }

    WCRatesRemoveFile() {
        const updatePayload = { ...this.quote }
        if (this.quote?.wcRatesDataId != undefined) {
            const wcRates_id = this.quote?.wcRatesDataId['_id'];
            this.wcRatesFileUploadService.delete(wcRates_id)
                .subscribe({
                    next: res => {
                        updatePayload['wcRatesDataId'] = null;
                        this.quoteService.update(this.id, updatePayload).subscribe({
                            next: quote => {

                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quote = dto.data.entity;
                                        this.isRateFileuploaded = false;
                                        this.isRateData = false
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    },
                    error: e => {
                        console.log(e.error);

                    }
                });
        }
    }



    get bulkImportProps(): PFileUploadGetterProps {
        return this.quoteService.getBulkImportProps(this.id, this.isPlanTypeIndividualfloater, this.isFileUploadTypeAggregate, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                //window.location.reload();
                this.quoteService.get(this.id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quoteService.setQuote(dto.data.entity)
                        this.loadQuoteDetails(this.id);
                        //this.loadQuoteLocationOccupancyList(DEFAULT_RECORD_FILTER);
                    },
                    error: e => {
                        console.log(e);
                    }
                })
            } else {
                // this.messageService.add({
                //     severity: 'fail',
                //     summary: "Failed to Upload",
                //     detail: `${dto.data.entity?.errorMessage}`,
                // })
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }


        })
    }
    get wcRatesbulkImportProps(): PFileUploadGetterProps {
        return this.wcRatesFileUploadService.getBulkImportProps(this.id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                //window.location.reload();
                this.quoteService.get(this.id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.isRateFileuploaded = true;
                        this.quoteService.setQuote(dto.data.entity)
                        this.quote = dto.data.entity
                        //this.loadQuoteDetails(this.id);
                    },
                    error: e => {
                        console.log(e);
                    }
                })
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }


        })
    }


    downloadWCRatesDataSampleFile() {
        this.wcRatesFileUploadService.downloadWcRatesFileUploadDataExcel(this.quote._id).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }

    getWCRatesViewDialog() {
        const ref = this.dialogService.open(WCRatesFileUploadDialogComponent, {
            header: `Details of Rates - ${this.isTableTypeNamedUnnamed}`,
            data: {
                quote_id: this.id,
                quote: this.quote,
                tableType: this.isTableTypeNamedUnnamed
            },
            width: "80vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            //this.loadQuoteDetails(this.id);
        })
    }

    WCRatesFileuploaded() {
        if (this.quote != null && this.quote != undefined) {
            if (this.quote?.wcRatesDataId != null && this.quote?.wcRatesDataId != undefined) {
                if (this.quote?.wcRatesDataId['wcRatesData'].length > 0) {
                    this.isRateFileuploaded = true;
                    this.isRateData = true;
                    this.quoteService.setQuote(this.quote)
                    this.templateName == this.quote?.productId['productTemplate']
                }
                else {
                    this.isRateFileuploaded = false;
                    this.isRateData = false;
                }
            }
            else {
                this.templateName == this.quote?.productId['productTemplate']
            }
        }
        else {
            this.isRateFileuploaded = false;
            this.isRateData = true;
            this.templateName == this.quote?.productId['productTemplate']
        }
    }

    isDisableButton() {
        if (this.isPlanTypeIndividualfloater == "Floater") {
            let isFlatGraded: boolean = false;
            let isCoverageSelected: boolean = true;
            if (this.quoteGmcOptions != undefined) {
                if (this.quoteGmcOptions.siType == 'Flat') {
                    if (this.slectedValueSI != undefined) {
                        isFlatGraded = true;
                    }
                }
                else {
                    if (!this.quoteGmcOptions.gmcGradedSILst.some(x => x.siAmount.label == "")) {
                        isFlatGraded = true;
                    }
                }
            }
            if (this.quote.employeeDataId == undefined) {
                isCoverageSelected = false;
            }
            else {
                if (this.quote.employeeDataId["coverageType"] == undefined) {
                    isCoverageSelected = false;
                }
            }

            return !(isCoverageSelected && isFlatGraded && this.isEmpData && (this.quote?.productId ?? 0) && (this.riskStartDate ?? 0) && (this.quote?.ebPlan != undefined && this.quote?.ebPlan != ''))
        }
        else {
            let isCoverageSelected: boolean = true;
            if (this.quote.employeeDataId == undefined) {
                isCoverageSelected = false;
            }
            else {
                if (this.quote.employeeDataId["coverageType"] == undefined) {
                    isCoverageSelected = false;
                }
            }

            return !(isCoverageSelected && this.isEmpData && (this.quote?.productId ?? 0) && (this.riskStartDate ?? 0) && (this.quote?.ebPlan != undefined && this.quote?.ebPlan != ""))
        }


    }

    downloadEmpDataSampleFile() {
        this.quoteService.downloadQuoteEmpDataExcel(this.quote?._id, this.isPlanTypeIndividualfloater, this.isFileUploadTypeAggregate).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }
    //Intergation-EB [End]


    loadQuoteLocationOccupancyList(event: LazyLoadEvent) {
        // this.quoteOptionId = this.activatedRoute.snapshot?.queryParams?.quoteOptionId;
        if (this.quoteOptionId !== undefined) {
            // Old_Quote
            // event['filters'] = {
            //     quoteId: [
            //         {
            //             value: this.id,
            //             matchMode: "equals",
            //             operator: "and"
            //         }
            //     ] as any
            // };

            // New_Quote_Option
            event['filters'] = {
                quoteOptionId: [
                    {
                        value: this.quoteOptionId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ] as any,
                quoteId: [
                    {
                        value: this.id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ] as any
            };
            this.quoteLocationOccupancyService.getMany(event).subscribe({
                next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
                    this.location = dto.data.entities;
                    this.totalRecords = dto.results;
                    //this.totalSumAssured = this.location.map(item => item.sumAssured).reduce((sum, a) => sum + a, 0)
                    // this.totalSumAssured = this.quote.totalSumAssured;
                },
                error: e => {
                    console.log(e);
                }
            });
        }
    }

    getcombinedlength(locationName: string, pincode: string) {
        let combined = `${locationName} - ${pincode}`;
        const maxLength = 25;

        if (combined.length > maxLength) {
            combined = `${combined.slice(0, maxLength)}...`;
        }
        return combined;
    }

    loadQuoteDetails(qoute_id) {
        this.quoteService.get(qoute_id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quote = dto.data.entity;
                this.riskStartDate = this.quote?.riskStartDate ? formatDate(this.quote?.riskStartDate, 'yyyy-MM-dd', 'en') : ''
                //  to display data in fields 
                this.selectedData.sectorId = this.quote?.sectorId ? this.quote?.sectorId["_id"] : '';
                this.selectedData.clientId = this.quote?.clientId ? this.quote?.clientId["_id"] : '';
                this.selectedData.quoteType = this.quote?.quoteType || '';
                this.selectedData.insuredBusiness = this.quote?.insuredBusiness || '';
                this.riskStartDate = formatDate(this.quote?.riskStartDate, 'yyyy-MM-dd', 'en') || '';
                this.categoryName = this.quote?.productId['categoryId']['name'];
                this.productNames = this.quote.productId['type'];
                if (this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] != null && this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] != undefined && this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] != '') {
                    const years = this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] === "Y" ? Number(this.quote?.renewalPolicyPeriod.split(" ")[0]) / 12 : Number(this.quote?.renewalPolicyPeriod.split(" ")[0]);
                    this.policyTenureYears = this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] === "Y" ? { label: String(years) + ' Year', value: String(years) + ' Year' } : { label: String(years) + ' Months', value: String(years) + ' Months' }
                    // @ts-ignore
                    const maxoccupancyTenure = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId?.maxnumberOfYears
                    // @ts-ignore
                    const minoccupancyTenure = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId?.minnumberOfYears
                    // this.policyTenureYears = this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] === "Y" ? { label: String(years) + ' Year', value: String(years) + ' Year' } : { label: String(years) + ' Months', value: String(years) + ' Months' }
                    // // pending
                    // // @ts-ignore
                    // const maxoccupancyTenure = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId?.maxnumberOfYears
                    // // @ts-ignore
                    // const minoccupancyTenure = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId?.minnumberOfYears

                    if (years > maxoccupancyTenure || minoccupancyTenure > years) {
                        this.isError = true
                    }
                }

                // @ts-ignore
                this.productName = this.quote.productId?.type
                this.riskStartDate = this.quote?.riskStartDate ? formatDate(this.quote?.riskStartDate, 'yyyy-MM-dd', 'en') : ''
                if (this.quote.productId != undefined) {
                    this.templateName = this.quote.productId['productTemplate']
                }
                if (this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CGL ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CRIME ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CYBER ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_EANDO ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PUBLIC ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY ||
                    this.quote.productId["productTemplate"] == AllowedProductTemplate.WORKMENSCOMPENSATION
                ) {
                    if (this.productName != null && this.productName != undefined && this.productName != '') {
                        let cateId = this.quote.productId["categoryId"]
                        this.onCategoryChange(cateId["_id"])
                        this.updateQuoteProduct(this.quote.productId["_id"], 1);
                        this.setDraftTemplateDataforLiability(this.templateName, this.quote)
                        if (this.quote.wcTemplateDataId) {
                            this.isTableTypeNamedUnnamed = this.quote.wcTemplateDataId['tableType'];
                        }
                    }
                }
                //Intergation-EB [Start]
                if (AllowedProductTemplate.GMC == this.templateName) {
                    this.productService.getACategoryProductMaster().subscribe(
                        (response: any) => {
                            const data = response.data;
                            if (Array.isArray(data.entities)) {
                                this.categoryOptions = data.entities.map(item => ({ label: item.name, value: item._id }));
                            } else {
                                console.error('Invalid data received:', data);
                            }
                        },
                        error => {
                            console.error('Error fetching category names:', error);
                        }
                    );
                    this.DemographyFileuploaded();
                    this.getOptions();
                    this.getSelectedCoverageType();
                }

                if (AllowedProductTemplate.WORKMENSCOMPENSATION == this.templateName) {
                    this.WCRatesFileuploaded();
                }
                if (AllowedProductTemplate.LIABILITY_EANDO == this.templateName) {
                    this.loadEandOPolicyTypes();
                }
                this.loadInsuredBusinessActivity();
                //Intergation-EB [End]
                if (this.quote.productId != undefined) {
                    this.productSelected = true;
                } else {
                    this.productSelected = false;
                }

            },
            error: e => {
                console.log(e);
            }
        });
    }

    setDraftTemplateDataforLiability(templateName: any, quote: any): void {
        if (templateName === AllowedProductTemplate.LIABILITY || templateName === AllowedProductTemplate.LIABILITY_CRIME) {
            this.insuredBusinessActivityId = quote.liabilityTemplateDataId?.insuredBusinessActivityId;
            this.insuredBusinessActivityOther = quote.liabilityTemplateDataId?.insuredBusinessActivityOther;
            this.limitOfLiability = quote.liabilityTemplateDataId?.limitOfLiability;
            this.policyStartDate = quote.liabilityTemplateDataId?.policyStartDate;
            this.policyEndDate = quote.liabilityTemplateDataId?.policyEndDate;
            this.isOfferIndication = quote.liabilityTemplateDataId?.isOfferIndication;
        } else if (templateName === AllowedProductTemplate.LIABILITY_CYBER || templateName === AllowedProductTemplate.LIABILITY_PRODUCT) {
            this.insuredBusinessActivityId = quote.liabilityProductTemplateDataId?.insuredBusinessActivityId;
            this.insuredBusinessActivityOther = quote.liabilityProductTemplateDataId?.insuredBusinessActivityOther;
            this.limitOfLiability = quote.liabilityProductTemplateDataId?.limitOfLiability;
            this.policyStartDate = quote.liabilityProductTemplateDataId?.policyStartDate;
            this.policyEndDate = quote.liabilityProductTemplateDataId?.policyEndDate;
            this.isOfferIndication = quote.liabilityProductTemplateDataId?.isOfferIndication;
        } else if (templateName === AllowedProductTemplate.LIABILITY_CGL || templateName === AllowedProductTemplate.LIABILITY_PUBLIC) {
            this.insuredBusinessActivityId = quote.liabilityCGLTemplateDataId?.insuredBusinessActivityId;
            this.insuredBusinessActivityOther = quote.liabilityCGLTemplateDataId?.insuredBusinessActivityOther;
            this.limitOfLiability = quote.liabilityCGLTemplateDataId?.limitOfLiability;
            this.policyStartDate = quote.liabilityCGLTemplateDataId?.policyStartDate;
            this.policyEndDate = quote.liabilityCGLTemplateDataId?.policyEndDate;
            this.isOfferIndication = quote.liabilityCGLTemplateDataId?.isOfferIndication;
            this.typeOfProductId = quote.liabilityCGLTemplateDataId?.typeOfProductId;
        } else if (templateName === AllowedProductTemplate.LIABILITY_EANDO) {
            this.insuredBusinessActivityId = quote.liabilityEandOTemplateDataId?.insuredBusinessActivityId;
            this.insuredBusinessActivityOther = quote.liabilityEandOTemplateDataId?.insuredBusinessActivityOther;
            this.limitOfLiability = quote.liabilityEandOTemplateDataId?.limitOfLiability;
            this.policyStartDate = quote.liabilityEandOTemplateDataId?.policyStartDate;
            this.policyEndDate = quote.liabilityEandOTemplateDataId?.policyEndDate;
            this.isOfferIndication = quote.liabilityEandOTemplateDataId?.isOfferIndication;
        } else {
            this.insuredBusinessActivityId = quote.wcTemplateDataId?.insuredBusinessActivityId;
            this.insuredBusinessActivityOther = quote.wcTemplateDataId?.insuredBusinessActivityOther;
            this.policyStartDate = quote.wcTemplateDataId?.policyStartDate;
            this.policyEndDate = quote.wcTemplateDataId?.policyEndDate;
            this.isOfferIndication = quote.wcTemplateDataId?.isOfferIndication;
        }
    }

    updateQuoteProduct(product_id, i) {
        let arr;
        arr = this.productCarouselArray[0].filter(item => item?._id == product_id)
        this.templateName = arr[0].productTemplate;
        this.productType = arr[0].type
        const updatePayload = { ...this.quote }

        updatePayload['productId'] = product_id;

        this.quoteService.update(this.id, updatePayload).subscribe({
            next: quote => {
                //Intergation-EB [Start]
                if (this.templateName == AllowedProductTemplate.GMC) {
                    //Create option 1 here and save template
                    this.getSelectedCoverageType();
                    this.updateGMCMasters(quote.data.entity)
                }
                else if (this.templateName == AllowedProductTemplate.MARINE) {
                    //Save MArine Template
                    this.createMarineData(quote.data.entity._id)
                }

                else if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                    //Save WC Option 1
                    if (!quote.data.entity.wcTemplateDataId) {
                        this.createWCData(quote.data.entity._id)
                    }
                    // this.createWCData(quote.data.entity._id)
                    //Save WC Template
                    // this.loadWCSubjectivityAndExclusions(quote.data.entity._id, quote.data.entity.productId)
                } else {
                    // New_Quote_Option
                    if (!this.quoteOptionId) {
                        this.createQuoteOption(this.id)
                    }
                }

                if (this.templateName == AllowedProductTemplate.LIABILITY || this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
                    if (!quote.data.entity.liabilityTemplateDataId) {
                        this.createDandOData(quote.data.entity._id)
                    }
                }


                if (this.templateName == AllowedProductTemplate.LIABILITY_CGL || this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC) {
                    if (!quote.data.entity.liabilityCGLTemplateDataId) {
                        this.createCGLData(quote.data.entity._id)
                    }
                    this.loadCGLPolicyTypeOfProducts();
                }

                if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT || this.templateName == AllowedProductTemplate.LIABILITY_CYBER) {
                    if (!quote.data.entity.liabilityProductTemplateDataId) {
                        this.createProductData(quote.data.entity._id);
                    }
                }

                if (this.templateName == AllowedProductTemplate.LIABILITY_EANDO) {
                    if (!quote.data.entity.liabilityEandOTemplateDataId) {
                        this.createEandOData(quote.data.entity._id);
                    }
                    this.loadEandOPolicyTypes();
                }

                //Liability
                this.loadInsuredBusinessActivity();

                this.productSelected = true;

                //Intergation-EB [End]
                this.quoteService.get(quote.data.entity._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        // if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION && dto.data.entity.wcTemplateDataId === undefined) {
                        //     this.quoteService.refresh()
                        // }
                        this.quote = dto.data.entity;
                        // @ts-ignore
                        this.productName = this.quote.productId?.type
                        this.productSelected = true;
                        //Intergation-EB [Start]
                        if (this.templateName == AllowedProductTemplate.GMC) {
                            this.DemographyFileuploaded();
                        }

                        if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                            this.WCRatesFileuploaded();
                        }
                        if (this.showLiabilityTenure()) {
                            this.optionsIndmenityPeriod = this.getAllYearsOrMonthsOptions();
                            if (this.optionsIndmenityPeriod.length > 0) {
                                this.compute(this.optionsIndmenityPeriod[0]);
                                this.policyTenureYears = this.optionsIndmenityPeriod[0].label;
                            }
                        }

                        //Intergation-EB [End]
                        // console.log(this.quote)
                    },
                    error: e => {
                        console.log(e);
                        //this.DemographyFileuploaded();
                    }
                });
                //   this.router.navigateByUrl(`${this.modulePath}`);
                // this.quote =
            },
            error: error => {
                console.log(error);
            }
        });
    }

    showLiabilityTenure() {
        if (
            this.productSelected &&
            (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION ||
                this.templateName == AllowedProductTemplate.LIABILITY ||
                this.templateName == AllowedProductTemplate.LIABILITY_EANDO ||
                this.templateName == AllowedProductTemplate.LIABILITY_CGL ||
                this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT ||
                this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC ||
                this.templateName == AllowedProductTemplate.LIABILITY_CYBER ||
                this.templateName == AllowedProductTemplate.LIABILITY_CRIME)
        ) {
            if (this.quote.productId['renewalPolicyPeriodinMonthsoryears'] != null) {
                return true;
            }
        }
        return false;
    }


    onDropdownInsuredBusinessActivityChange(event: any) {
        const selectedObject = this.optionsInsuredBusinessActivity.find(option => option.value === event.value);
        this.selectedInsuredBusinessActivity = selectedObject
    }


    onDropdownPolicyTypeEandOChange(event: any) {
        const selectedObject = this.OptionEandOPoilcyTypes.find(option => option.value === event.value);
        this.selectedPolicyTypeEandO = selectedObject
    }

    onDropdownProductTypeCGLChange(event: any) {
        const selectedObject = this.OptionCGLTypeOfProducts.find(option => option.value === event.value);
        this.selectedCGLProductType = selectedObject
    }

    loadInsuredBusinessActivity() {
        const lovTypeMapping = {
            [AllowedProductTemplate.WORKMENSCOMPENSATION]: WCAllowedListOfValuesMasters.WC_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY]: WCAllowedListOfValuesMasters.LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_EANDO]: WCAllowedListOfValuesMasters.EANDO_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_CRIME]: WCAllowedListOfValuesMasters.CRIME_LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_CGL]: WCAllowedListOfValuesMasters.CGL_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_PUBLIC]: WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_PRODUCT]: WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_INSURED_BUSINESS_ACTIVITY,
            [AllowedProductTemplate.LIABILITY_CYBER]: WCAllowedListOfValuesMasters.CYBER_LIABILITY_INSURED_BUSINESS_ACTIVITY,
        };
        const lovType = lovTypeMapping[this.templateName] || "";
        if (lovType != "") {
            this.wclistofmasterservice.current(lovType).subscribe({
                next: records => {
                    if (records.data.entities.length > 0) {
                        records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
                    }
                    this.optionsInsuredBusinessActivity = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
                    if (this.insuredBusinessActivityId != undefined && this.insuredBusinessActivityOther != '') {
                        const selectedObject = this.optionsInsuredBusinessActivity.find(option => option.value === this.insuredBusinessActivityId);
                        this.selectedInsuredBusinessActivity = selectedObject
                    }
                },
                error: e => {
                    console.log(e);
                }
            });
        }
    }

    loadCGLPolicyTypeOfProducts() {
        this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_TYPE_OF_PRODUCT).subscribe({
            next: records => {
                if (records.data.entities.length > 0) {
                    records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
                }
                this.OptionCGLTypeOfProducts = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
            },
            error: e => {
                console.log(e);
            }
        });
    }

    loadEandOPolicyTypes() {
        this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_TYPE_OF_POLICY).subscribe({
            next: records => {
                if (records.data.entities.length > 0) {
                    records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
                }
                this.OptionEandOPoilcyTypes = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
            },
            error: e => {
                console.log(e);
            }
        });
    }

    getAnsFromAI() {

    }

    downloadaiDoc() {
        this.quoteService.aiDocDownload(this.quote._id).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);

                // a.href = objectUrl
                // a.download = fileName;
                // a.click();

                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }
    loadProductRecords() {
        this.productService.getAllProductsForLoggedInBroker().subscribe({
            next: (dto: IManyResponseDto<IProduct>) => {
                dto.data.entities.map((product: IProduct) => {
                    this.products.push(product)
                });

                let j = 0;
                this.productCarouselArray[j] = [];
                for (let i = 0; i < this.products.length; i++) {

                    this.productCarouselArray[j].push(this.products[i])
                }
            }
        })
    }

    openRiskLocationOccupancyDialog(quoteLocationOccupancyId?: string) {
        const ref = this.dialogService.open(CreateRiskLocationOccupancyDialogComponent, {
            header: quoteLocationOccupancyId ? "Edit Risk Location Occupancy" : "Add Risk Location Occupancy",
            data: {
                quote_id: this.id,
                clientId: this.quote.clientId,
                quoteLocationOccupancyId: quoteLocationOccupancyId,
                quote: this.quote,
                totalRecords: this.totalRecords,
                allowedLocationCount: this.user.partnerId['locationCount'],
                productName: this.productName,
                quoteOptionId: this.quoteOptionId
            },
            width: this.isMobile ? '98vw' : "50vw",
            styleClass: "customPopup"
        });
        const popStateListener = () => {
            ref.close();
        };
        window.addEventListener('popstate', popStateListener);
        ref.onClose.subscribe(() => {
            window.removeEventListener('popstate', popStateListener);
            this.quoteService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                    this.quoteService.setQuote(dto.data.entity)
                    this.loadQuoteDetails(this.id);
                    setTimeout(() => {
                        this.loadQuoteOption(this.quoteOptionId)
                    }, 2000);
                    this.loadQuoteLocationOccupancyList(DEFAULT_RECORD_FILTER);
                },
                error: e => {
                    console.log(e);
                }
            })
        });
    }

    delete(quoteLocationOccupancyId?: string) {
        this.quoteLocationOccupancyService.delete(quoteLocationOccupancyId).subscribe({
            next: res => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Risk Location Occupancy Deleted`,
                    life: 3000
                });
                // g
                this.loadQuoteDetails(this.id);
                this.loadQuoteLocationOccupancyList(DEFAULT_RECORD_FILTER);
                setTimeout(() => {
                    this.loadQuoteOption(this.quoteOptionId)
                }, 2000);

                // call the api to fetch the data form user tabel after delete
            },
            error: e => {
                console.log(e)
            }
        });
    }


    getIndicativeQuoteMarine() {
        if (this.quote.totalSumAssured && this.quote.marinePolicyType != undefined && this.quote?.productId) {
            this.quoteService.generateQuoteNumber(this.id).subscribe({
                next: quote => {

                    this.quoteService.update(quote.data.entity._id, { totalSumAssured: this.quote.totalSumAssured }).subscribe({
                        next: (dto: IOneResponseDto<IQuoteSlip>) => {

                            this.quoteService.get(quote.data.entity._id).subscribe({
                                next: (dto: IOneResponseDto<IQuoteSlip>) => {

                                    this.quote = dto.data.entity;
                                    this.quoteService.setQuote(dto.data.entity)
                                    if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                                    // console.log(this.quote)
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                            // console.log(this.quote)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });


                    //   this.router.navigateByUrl(`${this.modulePath}`);
                    // this.quote =
                },
                error: error => {
                    console.log(error);
                }
            });
        } else {
            this.messageService.add({
                severity: "warn",
                summary: "Validation",
                detail: `Missing Required Fields.`,
                life: 3000
            })
        }
    }

    isAllowedProductLiability(quote: any): boolean {
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

    validateLiabilityGetIndicativeQuote(): boolean {
        // Check if it's Workmen's Compensation or Liability CGL
        const isWorkmensCompensation = this.templateName === AllowedProductTemplate.WORKMENSCOMPENSATION;
        const isLiabilityCGL = this.templateName === AllowedProductTemplate.LIABILITY_CGL;

        // Basic validation checks
        if (!this.insuredBusinessActivityId?.trim()) {
            return false;
        }

        // Special validation for Liability CGL
        if (isLiabilityCGL && !this.typeOfProductId?.trim()) {
            return false;
        }

        // Validate limit and offer for Workmen's Compensation
        if (!this.isOfferIndication) {
            return false;
        }

        // Validate limit and offer for non-Workmen's Compensation
        if (!isWorkmensCompensation && (this.limitOfLiability === 0)) {
            return false;
        }

        // Check if "Others" is selected
        const isOthersSelected = this.selectedInsuredBusinessActivity?.label.includes('Others');
        if (isOthersSelected) {
            return !!this.insuredBusinessActivityOther?.trim();
        }

        return true;
    }




    checkIfInsuredBusinessActivityOtherAndNotEmpty(): boolean {
        if (this.selectedInsuredBusinessActivity != undefined && this.selectedInsuredBusinessActivity != null) {
            if (this.selectedInsuredBusinessActivity?.label.includes('Others')) {
                if (this.insuredBusinessActivityOther != null && this.insuredBusinessActivityOther != '' && this.insuredBusinessActivityOther != undefined) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }


    checkIfInsuredBusinessActivityOtherAndNotEmptyCGL(): boolean {
        if (this.selectedInsuredBusinessActivity != undefined && this.selectedInsuredBusinessActivity != null) {
            if (this.selectedInsuredBusinessActivity?.label.includes('Others')) {
                if (this.insuredBusinessActivityOther != null && this.insuredBusinessActivityOther != '' && this.insuredBusinessActivityOther != undefined) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }


    checkIfInsuredBusinessActivityOtherAndNotEmptyProductLiability(): boolean {
        if (this.selectedInsuredBusinessActivity != undefined && this.selectedInsuredBusinessActivity != null) {
            if (this.selectedInsuredBusinessActivity?.label.includes('Others')) {
                if (this.insuredBusinessActivityOther != null && this.insuredBusinessActivityOther != '' && this.insuredBusinessActivityOther != undefined) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

    checkIfInsuredBusinessActivityOtherAndNotEmptyProduct(): boolean {
        if (this.selectedInsuredBusinessActivity != undefined && this.selectedInsuredBusinessActivity != null) {
            if (this.selectedInsuredBusinessActivity?.label.includes('Others')) {
                if (this.insuredBusinessActivityOther != null && this.insuredBusinessActivityOther != '' && this.insuredBusinessActivityOther != undefined) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }


    getIndicativeQuoteLiability() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                let breachedValue = "";
                const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
                const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;
                const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH)
                if (isConfigurationOfTypeBoth) {
                    let selectedoptionsInsuredBusinessActivity = this.optionsInsuredBusinessActivity.filter(x => x.value == this.insuredBusinessActivityId)[0]
                    if (selectedoptionsInsuredBusinessActivity.label.includes("Others")) {
                        breachedValue += `Business activity is Other. Your quote has been referred to NON-OTC,`
                        this.quote.otcType = AllowedOtcTypes.NONOTC;
                        this.quote.isOtc = false;
                    }
                    this.quote.nonOtcBreachedValue = breachedValue;
                }
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        const totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.limitOfLiability)
                        this.liabilityTemplateService.update(quote.data.entity.liabilityTemplateDataId, { totalPremiumAmt: totalPremiumAmt, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate, limitOfLiability: this.limitOfLiability, isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther }).subscribe({
                            next: lib_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                                                // if (this.quote.quoteNo) this.router.navigate([`/backend/quotes/${this.id}/requisition`], {
                                                //     queryParams: { quoteOptionId: quoteOptionsLst[0]?._id }
                                                // });
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
                            },
                            error: error => {
                                console.log(error);
                            }
                        });

                    },
                    error: e => {
                        console.log(e);
                    }
                });
            },
            error: error => {
                console.log(error);
            }
        });
    }

    getIndicativeQuoteCrimeLiability() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        const totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.limitOfLiability)
                        this.liabilityTemplateService.update(quote.data.entity.liabilityTemplateDataId, { isOfferIndication: this.isOfferIndication, limitOfLiability: this.limitOfLiability, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, totalPremiumAmt: totalPremiumAmt, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: lib_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                        // console.log(this.quote)
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                                // console.log(this.quote)
                            },
                            error: error => {
                                console.log(error);
                            }
                        });

                    },
                    error: e => {
                        console.log(e);
                    }
                });
            },
            error: error => {
                console.log(error);
            }
        });

    }

    getIndicativeQuoteLiabilityCGL() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        const totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.limitOfLiability)
                        this.liabilityCGLTemplateService.update(quote.data.entity.liabilityCGLTemplateDataId, { limitOfLiability: this.limitOfLiability, isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, typeOfProductId: this.typeOfProductId, totalPremiumAmt: totalPremiumAmt, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: cgl_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
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
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    },
                    error: e => {
                        console.log(e);
                    }
                });

            },
            error: error => {
                console.log(error);
            }
        });

    }

    getIndicativeQuoteLiabilityPublicLiability() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        const totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.limitOfLiability)
                        this.liabilityCGLTemplateService.update(quote.data.entity.liabilityCGLTemplateDataId, { limitOfLiability: this.limitOfLiability, isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, totalPremiumAmt: totalPremiumAmt, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: cgl_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
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
                                // console.log(this.quote)
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    },
                    error: e => {
                        console.log(e);
                    }
                });

            },
            error: error => {
                console.log(error);
            }
        });

    }


    getIndicativeQuoteLiabilityProductLiability() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        let totalPremiumAmt = 0
                        if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT) {
                            totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.limitOfLiability)
                        }
                        else {
                            totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.limitOfLiability)
                        }
                        this.liabilityProductTemplateService.update(quote.data.entity.liabilityProductTemplateDataId, { limitOfLiability: this.limitOfLiability, isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, totalPremiumAmt: totalPremiumAmt, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: pl_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
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
                                // console.log(this.quote)
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    },
                    error: e => {
                        console.log(e);
                    }
                });

            },
            error: error => {
                console.log(error);
            }
        });
    }



    getIndicativeQuoteLiabilityProduct() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.liabilityProductTemplateService.update(quote.data.entity.liabilityProductTemplateDataId, { limitOfLiability: this.limitOfLiability, isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: temp => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
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
            },
            error: error => {
                console.log(error);
            }
        });
    }

    getIndicativeQuoteLiabilityEandO() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { nonOtcBreachedValue: this.quote.nonOtcBreachedValue, otcType: this.quote.otcType, isOtc: this.quote.isOtc, dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        const totalPremiumAmt = this.indicativePremiumCalcService.CalculateEandOPremium(this.limitOfLiability)
                        this.liabilityEandOTemplateService.update(quote.data.entity.liabilityEandOTemplateDataId, { isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, limitOfLiability: this.limitOfLiability, totalPremiumAmt: totalPremiumAmt, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: eno_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                                            },
                                            error: e => {
                                                console.log(e);
                                            }
                                        });
                                        // console.log(this.quote)
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                                // console.log(this.quote)
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                        // console.log(this.quote)
                    },
                    error: e => {
                        console.log(e);
                    }
                });


                //   this.router.navigateByUrl(`${this.modulePath}`);
                // this.quote =
            },
            error: error => {
                console.log(error);
            }
        });

    }


    getIndicativeQuoteWorkMan() {
        this.quoteService.generateQuoteNumber(this.id).subscribe({
            next: quote => {
                this.quoteService.update(quote.data.entity._id, { dollarRate: 1, selectedCurrency: '₹ Rupee', qcrVersion: this.quote.qcrVersion !== undefined ? (this.quote.qcrVersion === 0 ? 1 : this.quote.qcrVersion) : 1 }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quoteWcTemplateService.update(quote.data.entity.wcTemplateDataId, { isOfferIndication: this.isOfferIndication, insuredBusinessActivityId: this.insuredBusinessActivityId, insuredBusinessActivityOther: this.insuredBusinessActivityOther, policyStartDate: this.policyStartDate, policyEndDate: this.policyEndDate }).subscribe({
                            next: cgl_quote => {
                                this.quoteService.get(quote.data.entity._id).subscribe({
                                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                        this.quoteService.setQuote(dto.data.entity)
                                        this.quote = dto.data.entity;
                                        this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                            next: (dto: IOneResponseDto<any[]>) => {
                                                let quoteOptionsLst
                                                quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                                                this.loadOptionsData(quoteOptionsLst);
                                                this.loadSelectedOption(quoteOptionsLst[0])
                                                if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
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
                //   this.router.navigateByUrl(`${this.modulePath}`);
                // this.quote =
            },
            error: error => {
                console.log(error);
            }
        });

    }

    getIndicativeQuote() {

        if (this.quote.productPartnerConfiguration['locationCount'] == null || this.quote.productPartnerConfiguration['locationCount'] == 0 || this.location?.length <= this.quote.productPartnerConfiguration['locationCount']) {
            if (this.quote?.totalSumAssured && this.location?.length > 0 && this.quote?.productId) {
                // this.router.navigateByUrl(`/backend/broker/quotes/${this.id}/sum-insured-details`);

                // Old_Quote

                // this.quoteService.generateQuoteNumber(this.id).subscribe({
                //     next: quote => {
                //         // this.quote = quote.data.entity;
                //         // console.log(this.quote)
                //         this.quoteService.get(quote.data.entity._id).subscribe({
                //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
                //                 this.quote = dto.data.entity;
                //                 if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/quotes/${this.id}/requisition`);
                //                 // console.log(this.quote)
                //             },
                //             error: e => {
                //                 console.log(e);
                //             }
                //         });
                //         //   this.router.navigateByUrl(`${this.modulePath}`);
                //         // this.quote =
                //     },
                //     error: error => {
                //         console.log(error);
                //     }
                // });

                // New_Quote_Option
                this.quoteOptionService.generateQuoteOptionNumber(this.quoteOptionId).subscribe({
                    next: quoteOption => {
                        this.quoteOptionService.get(quoteOption.data.entity._id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteOption>) => {
                                if (dto.data.entity?.quoteId["quoteNo"]) {
                                    this.router.navigate([`/backend/quotes/${this.id}/requisition`], {
                                        queryParams: { quoteOptionId: dto.data.entity?._id }
                                    });
                                }
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            } else {
                this.messageService.add({
                    severity: "warn",
                    summary: "Validation",
                    detail: `Missing Required Fields.`,
                    life: 3000
                })

            }
        } else {
            if (this.location?.length > this.quote.productPartnerConfiguration['locationCount']) {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: `Risk Occupancy Location should not be greater than ` + this.quote.productPartnerConfiguration['locationCount'],
                    life: 3000
                })
            }
        }
    }

    onUpdateRiskStartDate(value) {

        const updatePayload = { ...this.quote }

        updatePayload['riskStartDate'] = value;

        // if (!this.quote?.productId) {


        this.quoteService.update(this.id, updatePayload).subscribe({
            next: quote => {
                // this.quote = quote.data.entity;
                // console.log(this.quote)
                this.quoteService.get(quote.data.entity._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quote = dto.data.entity;
                        // console.log(this.quote)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
                //   this.router.navigateByUrl(`${this.modulePath}`);
                // this.quote =
            },
            error: error => {
                console.log(error);
            }
        });
    }

    errorHandler(e, uploader: FileUpload) {
        uploader.remove(e, 0)
    }

    onUploadSAIDocFile() {
        this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `File Upoladed Successfully`,
                    life: 3000
                });
                this.quoteService.setQuote(dto.data.entity)
            },
            error: e => {
                console.log(e);
            }
        });
    }

    getAllYearsOrMonthsOptions() {
        let temp = []
        if (this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] === "Y") {
            // @ts-ignore
            const length = this.quote?.productId?.numberOfYears;
            for (let i = 1; i <= length; i++) {
                let obj = {};
                if (i === 1) {
                    obj['label'] = i + ' Year';
                    obj['value'] = i + ' Year';
                } else {
                    obj['label'] = i + ' Years';
                    obj['value'] = i + ' Years';
                }
                temp.push(obj);
            }
        }
        if (this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] === "M") {
            // @ts-ignore
            const length = this.quote?.productId?.numberOfMonths
            for (let i = 3; i <= length; i += 3) {
                let obj = {};
                if (i === 1) {
                    obj['label'] = i + ' Month';
                    obj['value'] = i + ' Month';
                } else {
                    obj['label'] = i + ' Months';
                    obj['value'] = i + ' Months';
                }
                temp.push(obj)
            }
        }
        return temp;
    }

    searchOptionsMandY(e) {
        this.optionsIndmenityPeriod = []
        this.optionsIndmenityPeriod = this.getAllYearsOrMonthsOptions();
    }

    compute(e) {
        // @ts-ignore
        const maxoccupancyTenure = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId?.maxnumberOfYears
        // @ts-ignore
        const minoccupancyTenure = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.occupancyId?.minnumberOfYears
        const years = Number(e.value.split(" ")[0])
        if (this.quote?.productId['isOccupancywiseTenure'] && (years > maxoccupancyTenure || minoccupancyTenure > years)) {
            this.isError = true
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Occupancy Tenure out of range.`,
                life: 3000
            })
        } else {
            const months = this.quote?.productId["renewalPolicyPeriodinMonthsoryears"] === "Y" ? years * 12 : years
            let updatePayload = {}
            updatePayload['renewalPolicyPeriod'] = String(months) + ' Months'
            this.quoteService.update(this.quote._id, updatePayload).subscribe({
                next: quote => {
                    this.isError = false
                    //   this.router.navigateByUrl(`${this.modulePath}`);
                    // this.ref.close();
                    this.quoteService.get(quote.data.entity._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                            this.quote = dto.data.entity;
                            // console.log(this.quote)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });

                },

                error: error => {
                    console.log(error);
                }
            });
        }
    }

    // New_Quote_Option
    createQuoteOption(quoteId) {
        const payload = {
            quoteId: quoteId,
            quoteOption: "Option_1",
        };
        //@ts-ignore
        this.quoteOptionService.create(payload).subscribe({
            next: quoteOption => {
                this.quoteOption = quoteOption.data.entity
                this.quoteOptionId = quoteOption.data.entity._id
                this.router.navigate([`/backend/quotes/${this.id}`], {
                    queryParams: { quoteOptionId: this.quoteOptionId }
                });
                this.loadQuoteLocationOccupancyList(DEFAULT_RECORD_FILTER);
            },
            error: error => {
                console.log(error);
            }
        });
    }

    // loadQuoteOption(quoteOptionId) {
    //     this.quoteOptionService.get(quoteOptionId).subscribe({
    //         next: (dto: IOneResponseDto<IQuoteOption>) => {
    //             this.quoteOptionData = dto.data.entity
    //         },
    //         error: e => {
    //             console.log(e);
    //         }
    //     });
    // }

    isPaginatorVisible() {
        if (this.totalRecords == 0) {
            return false;
        } else {
            return true;
        }
    }

    loadSectorRecords() {
        let filter = { ...DEFAULT_RECORD_FILTER }
        filter.filters = {}
        this.sectorService.getMany(filter).subscribe({
            next: records => {
                this.sectors = records["data"]["entities"].filter(item => item.isActive == true)
            },
            error: e => {
                console.log(e);
            }
        });
    }

    loadClientsRecords() {
        let filter = { ...DEFAULT_RECORD_FILTER }
        filter.filters = {}
        this.clientService.getMany(filter).subscribe({
            next: data => {
                this.clients = data.data.entities.filter((client => client.active == true));
            },
            error: e => {
                console.log(e);
            }
        });
    }


    updateQuoteWise(field: string, event: any) {

        const selectedValue = event;

        const payload: any = {};
        payload[field] = selectedValue;

        this.quoteService.update(this.id, payload).subscribe({
            next: quote => {
                this.quote = quote.data.entity
                // this.messageService.add({
                //     severity: "success",
                //     summary: "Success",
                //     detail: `Quote Updated Successfully.`,
                //     life: 3000
                // })
            },
            error: error => {
                console.log(error);
            }
        });
    }

    expiredDetails() {
        const ref = this.dialogService.open(ExpiredDetailsDialogForm, {
            header: "Expired Details",
            data: {
                quote: this.quote,
                quoteOptionId: this.quoteOptionId,
            },
            width: "40vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            // this.loadQuoteDetails(this.id);
        })
    }

    getExpiredDetails() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.expiredDetailsDialogFormService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IOneResponseDto<IExpiredDetails>) => {
                if (dto.data?.entities[0]?._id) {
                    this.expiredDetailsData = dto.data?.entities
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    isProductLiability() {
        const isTemplateAllowed = [
            AllowedProductTemplate.LIABILITY_CGL,
            AllowedProductTemplate.LIABILITY_PUBLIC,
            AllowedProductTemplate.LIABILITY,
            AllowedProductTemplate.LIABILITY_EANDO,
            AllowedProductTemplate.LIABILITY_CRIME,
            AllowedProductTemplate.LIABILITY_PRODUCT,
            AllowedProductTemplate.WORKMENSCOMPENSATION,
            AllowedProductTemplate.LIABILITY_CYBER
        ].includes(this.quote.productId['productTemplate'])


        return isTemplateAllowed;
    }
    updatequote() {
        const payload: any = {};
        payload['ebPlan'] = this.quote.ebPlan;
        payload['ebPolicyType'] = this.quote.ebPolicyType;

        this.quoteService.update(this.id, payload).subscribe({
            next: quote => {
                this.quote = quote.data.entity            
            },
            error: error => {
                console.log(error);
            }
        });

    }
    updateQuoteOptionWise(event) {


        if (!this.isProductLiability()) {
            const updatePayload = {}
            updatePayload['policyStartDate'] = event.policyStartDate;
            updatePayload['policyEndDate'] = event.policyEndDate;
            // updatePayload['expiredQuoteOption'] = event.expiredQuoteOption;
            updatePayload['policyTenure'] = this.calculateMonthYearDifference();
            // updatePayload['projectDate'] = event.projectDate;
            // updatePayload['projectDate'] = event.projectDate;
            if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
                this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                        const quoteGmcOptionsLst = dto.data.entity;
                        if (quoteGmcOptionsLst.length > 0) {
                            this.quoteGmcOptions = quoteGmcOptionsLst.filter(x => x.optionName == 'Option 1')[0];
                            this.quoteGmcOptions.policyStartDate = event.policyStartDate
                            this.quoteGmcOptions.policyEndDate = event.policyEndDate
                            const updatePayload = this.quoteGmcOptions
                            if (this.quoteGmcOptions._id != undefined) {
                                this.gmcQuoteTemplateService.updateArray(this.quoteGmcOptions._id, updatePayload).subscribe({
                                    next: partner => {
                                        //console.log("ttest");
                                    },
                                    error: error => {
                                        console.log(error);
                                    }
                                });
                            }

                        }
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
            else {
                this.quoteOptionService.update(this.quoteOptionId, updatePayload).subscribe({
                    next: quote => {
                        this.quoteOptionService.get(quote.data.entity._id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteOption>) => {
                                this.quoteOptionData = dto.data.entity
                                this.policyTenure = dto.data.entity?.policyTenure;
                                this.policyStartDate = dto.data.entity?.policyStartDate
                                this.policyEndDate = dto.data.entity?.policyEndDate
                                this.projectDate = dto.data.entity?.projectDate
                                // this.expiredQuoteOption = dto.data.entity?.expiredQuoteOption    
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }

        }
    }

    loadQuoteOption(quoteOptionId) {
        this.quoteOptionService.get(quoteOptionId).subscribe({
            next: (dto) => {
                this.quoteOptionData = dto.data.entity
                this.policyStartDate = dto.data.entity?.policyStartDate
                this.policyEndDate = dto.data.entity?.policyEndDate
                this.policyTenure = dto.data.entity?.policyTenure;
                // this.projectDate = dto.data.entity?.projectDate
                this.projectDate = dto.data.entity?.projectDate
                // this.expiredQuoteOption = dto.data.entity?.expiredQuoteOption

            }
        })
    }

    // getQuoteOptionsByQuoteId() {
    //     let lazyLoadEvent: LazyLoadEvent = {
    //         first: 0,
    //         rows: 20,
    //         sortField: null,
    //         sortOrder: 1,
    //         filters: {
    //             // @ts-ignore
    //             quoteId: [
    //                 {
    //                     value: this.id,
    //                     matchMode: "equals",
    //                     operator: "and"
    //                 }
    //             ]
    //         },
    //         globalFilter: null,
    //         multiSortMeta: null
    //     };

    //     this.quoteOptionService.getMany(lazyLoadEvent).subscribe({
    //         next: (dto: IManyResponseDto<IQuoteOption>) => {
    //             this.hideExpiredTermCheckbox = dto.data.entities.filter(val => val.expiredQuoteOption === true)
    //         },
    //         error: e => {
    //             console.log(e);
    //         }
    //     });
    // }

    openSumInsuredSplitDialog() {

        const ref = this.dialogService.open(QuoteLocationBreakupDialogComponent, {
            header: "Edit Sum Insured Split",
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData,
                selectedLocation: this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy            // New_Quote_Option
            },
            width: this.isMobile ? '98vw' : '1200px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe(() => {

        });
    }
    projectDetails() {
        const ref = this.dialogService.open(ProjectDetailsDialogComponent, {
            header: "Project Details",
            data: {
                quote: this.quote,
                quoteOptionId: this.quoteOptionId,
            },
            width: "60vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            // this.loadQuoteDetails(this.id);
            this.getProjectDetails();
        })
    }
    getProjectDetails() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.projectDetailsService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IOneResponseDto<IExpiredDetails>) => {
                this.projectDetailsData = dto.data?.entities;
                console.log(dto.data.entities);
                this.projectTenure = dto.data.entities[0].projectTenure;
                console.log(this.projectTenure);
            },
            error: e => {
                console.log(e);
            }
        });
    }

    //calculate month year difference
    calculateMonthYearDifference(): string {
        const startDate = this.policyStartDate;
        const endDate = this.policyEndDate;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();

            // Adjust months if negative
            if (months < 0) {
                years -= 1;
                months += 12;
            }
            if (months == 0) {
                return `${years} years`;
            }
            return `${years} years and ${months} months`;
        }
        return ``;
    }

    createClientDialogue() {
        const ref = this.dialogService.open(CreateClientComponent, {
            header: "Create Client Master",
            width: this.isMobile ? '98vw' : "50vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            this.loadClientsRecords()
        })
    }
}

