import { AllowedPartnerTypes } from './../../../admin/partner/partner.model';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'; import { DeviceDetectorService } from 'ngx-device-detector';
import { Children } from 'preact/compat';
import { LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PermissionType, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { BscFireLossOfProfitService } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.service';
import { AllowedListOfValuesMasters, AllowedLovReferences, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IMachineryELectricalBreakDownCover } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.model';
import { MachineryElectricalBreakdownCoverService } from 'src/app/features/admin/machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.service';
import { MachineryLossOfProfitCoverService } from 'src/app/features/admin/machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.service';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { IQuoteLocaitonBreakupMaster } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { environment } from 'src/environments/environment';
import { ToWords } from 'to-words';


interface TreeData {
    [s: string]: {
        rowId?: string,
        value: string | number,
        type: "plainText" | "inputText" | "string",
        readonly?: boolean,
        isRequired?: boolean,
        maxStockSI?: number;
        fieldName?: string;
    }
}

@Component({
    selector: 'app-quote-location-breakup',
    templateUrl: './quote-location-breakup.component.html',
    styleUrls: ['./quote-location-breakup.component.scss']
})
export class QuoteLocationBreakupComponent implements OnInit {


    @Input() quote: IQuoteSlip
    private currentQuote: Subscription;

    @Input() selectedLocation: any

    @Input() permissions: PermissionType[] = []

    @Output() onSaved = new EventEmitter<void>()

    currentUser$: Observable<IUser>;

    uploadUrl: string;

    uploadHttpHeaders: HttpHeaders;
    isMobile: boolean = false;
    uploadAttachmentUrl: string;
    data: any;

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    allLocationBreakup: any

    isLockton: boolean = environment.isLokton
    splitData: any[] = [];
    totals: number[] = [];
    fireLov = [
        // { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
        // { description: '(A) Material Damage Section', isHeader: true, amounts: [] },
        // { description: 'Building & Plinth', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE", "BMA"], isHeader: false, amounts: [] },
        // { description: 'Stocks', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE", "FLOATER_ADDON_STOCKS"], isHeader: false, amounts: [] },
        // { description: 'Other Items', lovKey: "row3", lovReferences: ["BSC_BURGLARY_AND_HOUSEBREAKING_OTHER_CONTENTS", "PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Personal Effects', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Valuables, Painting, Jewellery', lovKey: "row5", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Section II: Machinery (PD)', isHeader: true, amounts: [] },
        // { description: '(B) Machinery/Electrical', isHeader: true, amounts: [] },
        // { description: 'Sum Insured', lovKey: "row6", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },

        { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
        { description: '(A) Property Damage', isHeader: true, amounts: [] },
        { description: 'Building & Improvements', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE", "BMA"], isHeader: false, amounts: [] },
        { description: 'Plinth & Foundation, roads and bridges, etc.', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Plant & Machinery', lovKey: "row3", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Office Equipment, Furnitures & Fixtures, Electrical installantion and other contents', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Stocks consisting of Raw materials, finished goods, stores & spares, consumables and other type of stocks pertaining to insureds trade', lovKey: "row5", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Stocks in Process', lovKey: "row6", lovReferences: ["PROPERTY_DAMAGE", "FLOATER_ADDON_STOCKS"], isHeader: false, amounts: [] },
        { description: 'Any other (description specified in annexure)', lovKey: "row7", lovReferences: ["PROPERTY_DAMAGE", "BSC_BURGLARY_AND_HOUSEBREAKING_OTHER_CONTENTS"], isHeader: false, amounts: [] },
        // { description: 'Property Damage Total Sum Insured', lovKey: "row8", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    ];

    blusLov = [
        { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
        { description: '(A) Property Damage', isHeader: true, amounts: [] },
        { description: 'Building & Improvements', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE", "BMA"], isHeader: false, amounts: [] },
        { description: 'Plinth & Foundation, roads and bridges, etc.', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Plant & Machinery', lovKey: "row3", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Office Equipment, Furnitures & Fixtures, Electrical installantion and other contents', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Stocks consisting of Raw materials, finished goods, stores & spares, consumables and other type of stocks pertaining to insureds trade', lovKey: "row5", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Stocks in Process', lovKey: "row6", lovReferences: ["PROPERTY_DAMAGE", "BSC_BURGLARY_AND_HOUSEBREAKING_STOCKS"], isHeader: false, amounts: [] },
        { description: 'Any other (description specified in annexure)', lovKey: "row7", lovReferences: ["PROPERTY_DAMAGE", "BSC_BURGLARY_AND_HOUSEBREAKING_OTHER_CONTENTS"], isHeader: false, amounts: [] },
        // { description: 'Property Damage Total Sum Insured', lovKey: "row8", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Personal Effects', lovKey: "row9", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Valuables, Painting, Jewellery, if any', lovKey: "row10", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Other Misc Items', lovKey: "row11", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: '(B) Machinery/Electrical', isHeader: true, amounts: [] },
        // { description: 'Sum Insured', lovKey: "row12", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    ];

    iarLov = [
        { description: 'Section I: Property Damage (PD)', isHeader: true, amounts: [] },
        { description: '(A) Property Damage', isHeader: true, amounts: [] },
        { description: 'Building & Improvements', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Plinth & Foundation, roads and bridges, etc.', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: '(B) Machinery Breakdown', isHeader: true, amounts: [] },
        { description: 'Machinary', lovKey: "row3", lovReferences: ["MACHINERY_BREAKDOWN"], isHeader: false, amounts: [], required: true },
        { description: 'Section II: Business Interruption (BI)', isHeader: true, amounts: [] },
        { description: 'FLOP', lovKey: "row4", lovReferences: ["BUSINESS_INTERRUPTION"], isHeader: false, amounts: [], disabled: true },
        { description: 'MBLOP', lovKey: "row5", lovReferences: ["BUSINESS_INTERRUPTION"], isHeader: false, amounts: [], disabled: true },
        // { description: 'Other Assets', lovKey: "row3", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        // { description: 'Stocks of all kind', lovKey: "row4", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
    ];

    carLov = [
        { description: 'Section I: Material Damage (MD)', isHeader: true, amounts: [] },
        { description: 'Building & Improvements', lovKey: "row1", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Plinth & Foundation, roads and bridges, etc.', lovKey: "row2", lovReferences: ["PROPERTY_DAMAGE"], isHeader: false, amounts: [] },
        { description: 'Machinary', lovKey: "row3", lovReferences: ["MACHINERY_BREAKDOWN"], isHeader: false, amounts: [] },
        { description: 'Section II: Third Party Liability', isHeader: true, amounts: [] },
        { description: 'FLOP', lovKey: "row4", isHeader: false, amounts: [] },
        { description: 'MBLOP', lovKey: "row5", isHeader: false, amounts: [] },
    ];

    constructor(
        // private ref: DynamicDialogRef,
        private listOfValuesMasterService: ListOfValueMasterService,
        private formBuilder: FormBuilder,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private quoteService: QuoteService,
        private listOfValuesService: ListOfValueMasterService,
        private messageService: MessageService,
        private accountService: AccountService,
        private appService: AppService,
        private deviceService: DeviceDetectorService,
        private bscFireLossOfProfitService: BscFireLossOfProfitService,
        private machineryLossOfProfitService: MachineryLossOfProfitCoverService,
        private quoteOptionService: QuoteOptionService,
        private machineryElectricalBreakdownCoverService: MachineryElectricalBreakdownCoverService,
    ) {
        this.currentUser$ = this.accountService.currentUser$

        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
            }
        })

    }


    recordForm: FormGroup;

    count: number = 0;

    cols = []

    sales: TreeNode[] = []

    model = []

    quoteLocationOccupancies: IQuoteLocationOccupancy[]
    user: IUser

    toWords = new ToWords;

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        // Old_Quote
        // this.uploadUrl = this.quoteLocationBreakupService.uploadQuoteLocationBreakupExcelUrl(this.quote?._id)
        // this.uploadAttachmentUrl = this.quoteService.attachmentUploadUrl(this.quote?._id);                   

        // New_Quote_Option
        this.uploadUrl = this.quoteLocationBreakupService.uploadQuoteLocationBreakupExcelUrl(this.quoteOptionData?._id)
        this.uploadAttachmentUrl = this.quoteOptionService.attachmentUploadUrl(this.quoteOptionData?._id);

        this.currentUser$.subscribe({
            next: user => {
                this.user = user;
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })
        // this.prepare()
        this.prepareNewSISplit()
    }

    onUploadAttachment() {
        // Old_Quote
        // this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //         if (dto.status == 'success') {
        //             this.messageService.add({
        //                 summary: "Success",
        //                 detail: 'Saved',
        //                 severity: 'success'
        //             })
        //             this.quoteService.setQuote(dto.data.entity)
        //             this.quote = dto.data.entity;
        //         }
        //     },
        //     error: e => {
        //         console.log(e);
        //     }
        // });

        // New_Quote_Option
        this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption>) => {
                if (dto.status == 'success') {
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    this.quoteOptionData = dto.data.entity;
                }
            },
            error: e => {
                console.log(e);
            }
        });
    }

    downloadFile(filePath) {
        // Old_Quote
        // this.quoteService.downloadAttachment(filePath).subscribe(res => {
        // let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? `Quoteslip_${this.quote?._id}_Attachment`;

        // New_Quote_Option
        this.quoteOptionService.downloadAttachment(filePath).subscribe(res => {

            let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? `QuoteOption_${this.quoteOptionData?._id}_Attachment`;

            const a = document.createElement('a')
            const blob = new Blob([res.body], { type: res.headers.get('content-type') });
            const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
            const objectUrl = window.URL.createObjectURL(file);

            a.href = objectUrl
            a.download = fileName;
            a.click();

            URL.revokeObjectURL(objectUrl);
        })
    }

    deletefile(filePath) {
        let payload = {}
        payload['filePath'] = filePath;

        // Old_Quote
        // this.quoteService.deleteAttachmentFile(this.quote?._id, payload).subscribe(res => {
        //     this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //         next: (dto: IOneResponseDto<IQuoteSlip>) => {

        //             this.messageService.add({
        //                 summary: "Success",
        //                 detail: 'Attachment deleted successfully',
        //                 severity: 'success'
        //             })
        //             this.quoteService.setQuote(dto.data.entity)
        //             this.quote = dto.data.entity;
        //         },
        //         error: e => {
        //             console.log(e);
        //         }
        //     });

        // })

        // New_Quote_Option
        this.quoteOptionService.deleteAttachmentFile(this.quoteOptionData?._id, payload).subscribe(res => {
            this.quoteOptionService.get(`${this.quoteOptionData._id}`, { 'quoteLocationOccupancyId': this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
                next: (dto: IOneResponseDto<IQuoteOption>) => {

                    this.messageService.add({
                        summary: "Success",
                        detail: 'Attachment deleted successfully',
                        severity: 'success'
                    })
                    this.quoteOptionService.setQuoteOptionForProperty(dto.data.entity)
                    this.quoteOptionData = dto.data.entity;
                },
                error: e => {
                    console.log(e);
                }
            });

        })
    }

    async prepare() {
        const listOfValues = await this.getListOfValues()
        const quoteLocationOccupancies = await this.getQuoteLocationOccupancies()
        this.quoteLocationOccupancies = quoteLocationOccupancies

        const quoteLocationBreakups = await this.getQuoteLocationBreakup()
        this.allLocationBreakup = quoteLocationBreakups;
        if (this.user.partnerId['brokerModeStatus'] == true) {
            if (this.user.partnerId['partnerType'] != AllowedPartnerTypes.broker) {
                const selectedLocationIndex = this.quoteLocationOccupancies.findIndex(item => item._id === this.selectedLocation._id)
                const object = this.quoteLocationOccupancies[selectedLocationIndex]
                if (selectedLocationIndex !== -1 || selectedLocationIndex !== undefined) {
                    // Remove the object from its current position
                    this.quoteLocationOccupancies.splice(selectedLocationIndex, 1);

                    // Insert the object at the beginning of the array
                    this.quoteLocationOccupancies.unshift(object);
                }
            }
        }
        else {
            if (this.user.partnerId['partnerType'] != AllowedPartnerTypes.insurer) {
                const selectedLocationIndex = this.quoteLocationOccupancies.findIndex(item => item._id === this.selectedLocation._id)
                const object = this.quoteLocationOccupancies[selectedLocationIndex]
                if (selectedLocationIndex !== -1 || selectedLocationIndex !== undefined) {
                    // Remove the object from its current position
                    this.quoteLocationOccupancies.splice(selectedLocationIndex, 1);

                    // Insert the object at the beginning of the array
                    this.quoteLocationOccupancies.unshift(object);
                }
            }
        }

        // 1. Prepare the headers
        this.cols.push({ field: 'key', header: '' })
        for (let quoteLocationOccupancy of quoteLocationOccupancies) {
            this.cols.push({
                field: quoteLocationOccupancy?._id,
                header: `${quoteLocationOccupancy?.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,
                quoteLocationOccupancy: quoteLocationOccupancy
            })
            this.model[quoteLocationOccupancy._id] = []
        }
        // this.model['total'] = []
        // this.cols.push({ field: 'total', header: 'Total' })

        let model = this.model

        // 2. Prepare tree table and set Breakup Values
        this.sales = []


        function parseLovForTreeTable(listOfValues: IListOfValueMaster[]): TreeNode<TreeData>[] {
            return listOfValues.map((listOfValue) => {

                if (listOfValue.children.length > 0) {

                    return {
                        data: {
                            key: { value: listOfValue?.lovKey ?? '', type: 'plainText', rowId: listOfValue?.lovKey, bold: true },
                        },
                        children: parseLovForTreeTable(listOfValue.children),
                        expanded: true
                    }
                } else {

                    let output: TreeData = {
                        'key': { value: listOfValue?.lovKey ?? '', type: 'plainText', rowId: listOfValue?.lovKey, isRequired: listOfValue.isRequired ?? false },
                    }

                    for (let quoteLocationOccupancy of quoteLocationOccupancies) {

                        let quoteLocationBreakup = quoteLocationBreakups.find((item) => item.quoteLocationOccupancyId == quoteLocationOccupancy._id && item.lovId == listOfValue._id);

                        model[quoteLocationOccupancy._id][listOfValue._id] = quoteLocationBreakup?.value

                        if (listOfValue?.isRemark) {
                            output[quoteLocationOccupancy._id] = ({ value: quoteLocationBreakup?.value == undefined ? '-' : quoteLocationBreakup?.value, type: 'string', rowId: listOfValue._id })
                        } else {
                            if (listOfValue?.lovKey == 'Stocks') {
                                let maxStockSI;
                                if (quoteLocationOccupancy?.occupancyId['maxStockSI'] && quoteLocationOccupancy?.occupancyId['maxStockSI'] > 0) {
                                    maxStockSI = quoteLocationOccupancy?.occupancyId['maxStockSI']
                                } else {
                                    maxStockSI = quoteLocationOccupancy?.sumAssured
                                }
                                output[quoteLocationOccupancy._id] = ({ value: quoteLocationBreakup?.value ?? 0, type: 'inputText', rowId: listOfValue._id, maxStockSI: maxStockSI, fieldName: listOfValue?.lovKey })
                            } else {
                                output[quoteLocationOccupancy._id] = ({ value: quoteLocationBreakup?.value ?? 0, type: 'inputText', rowId: listOfValue._id })
                            }
                        }



                    }

                    return { data: output }
                }


            })

        }
        // this.model = []
        this.sales = parseLovForTreeTable(listOfValues)

        // Model will come from parse value

        // Now Add Total in Model
        let output = []
        output['key'] = { value: 'Total', type: 'plainText', rowId: 'total' }
        for (let quoteLocationOccupancy of quoteLocationOccupancies) {

            let total = 0

            let selectedLocationData = Object.entries(this.model).find(([key, value]) => key == quoteLocationOccupancy._id)

            for (let record of Object.values(selectedLocationData[1])) {
                if (record) total = total + (typeof (record) == 'number' ? Number(record) : 0);
            }

            output[quoteLocationOccupancy._id] = { value: total, type: 'inputText', readonly: true, rowId: 'total' }
            model[quoteLocationOccupancy._id]['total'] = total
        }

        this.model = model

        this.sales.push({ data: output })

    }

    async getListOfValues() {
        let response = await this.listOfValuesMasterService.current(AllowedListOfValuesMasters.QUOTE_LOCATION_BREAKUP_L1, this.quote.productId['_id']).toPromise()
        if (this.user.partnerId['brokerModeStatus'] == true) {
            return response.data.entities.filter(val => val.partnerId == this.quote.partnerId)
        } else {
            return response.data.entities
        }

    }

    async getQuoteLocationOccupancies() {
        // Old_Quote
        // let event: LazyLoadEvent = {
        //     first: 0,
        //     rows: 4,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.quote._id,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }

        //         ],
        //     },
        // }

        // New_Quote_Option
        let event: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionData?._id,
                        matchMode: "equals",
                        operator: "and"
                    }

                ],
            },
        }

        let response = await this.quoteLocationOccupancyService.getMany(event).toPromise()

        return response.data.entities

    }
    async getQuoteLocationBreakup() {
        // Old_Quote
        // let event: LazyLoadEvent = {
        //     first: 0,
        //     rows: 5000,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.quote._id,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }

        //         ],
        //     },
        // }

        // New_Quote_Option
        let event: LazyLoadEvent = {
            first: 0,
            rows: 1000,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionData?._id,
                        matchMode: "equals",
                        operator: "and"
                    }

                ],
            },
        }

        let response = await this.quoteLocationBreakupService.getMany(event).toPromise()

        return response.data.entities

    }

    checkForStockValidation(listOfValues) {

        let fieldname = ''
        let temparray = []
        listOfValues.map((listOfValue) => {
            if (listOfValue.children && listOfValue.children.length > 0) {
                this.checkForStockValidation(listOfValue.children)
            } else {
                const selectedLocationData = Object.entries(listOfValue.data)
                selectedLocationData.map(lov => {
                    if (lov[1]['fieldName'] == 'Stocks' && lov[1]['maxStockSI']) {
                        if (this.model[lov[0]][lov[1]['rowId']] > lov[1]['maxStockSI']) {
                            this.count++;
                            temparray.push({ name: 'Stocks', flag: 'equal' })
                        }
                    }
                    else {
                        fieldname = lov[1]['value']
                    }
                })
            }
        })
        temparray.map(item => {
            if (item.flag == 'equal') {
                this.messageService.add({
                    severity: 'error',
                    summary: "Fail",
                    detail: `Stocks must be less than maxStp`,
                })
            }
        })
    }

    parseForRequiredLov(listOfValues) {

        let fieldname = ''
        let temparray = []
        listOfValues.map((listOfValue) => {
            if (listOfValue.children && listOfValue.children.length > 0) {
                this.parseForRequiredLov(listOfValue.children)
            } else {
                if (listOfValue?.data?.key.isRequired) {
                    const selectedLocationData = Object.entries(listOfValue.data)
                    selectedLocationData.map(lov => {
                        if (lov[0] != "key") {
                            if (this.model[lov[0]][lov[1]['rowId']] == this.model[lov[0]]['total']) {
                                this.count++;
                                temparray.push({ name: fieldname, flag: 'equal' })
                            }
                            if (this.model[lov[0]][lov[1]['rowId']] <= 0 || this.model[lov[0]][lov[1]['rowId']] == undefined) {
                                this.count++;
                                temparray.push({ name: fieldname, flag: 'not-equal' })
                            }
                        }
                        else {
                            fieldname = lov[1]['value']
                        }
                    })
                }
            }
        })
        temparray.map(item => {
            if (item.flag == 'equal') {
                this.messageService.add({
                    severity: 'error',
                    summary: "Fail",
                    detail: `${item.name} must be less than sum insured`,
                })
            } if (item.flag == 'not-equal') {
                this.messageService.add({
                    severity: 'error',
                    summary: "Fail",
                    detail: `${item.name} is required`,
                })
            }
        })
    }

    createForm() {
        this.recordForm = this.formBuilder.group({
            quoteLocationOccupancyArray: this.formBuilder.array([])
        })
    }

    updated($event, quoteLocationOccupancyId, a) {

        this.model[quoteLocationOccupancyId][a] = $event;

        const quoteLocationOccupancy = this.quoteLocationOccupancies.find((item) => item._id == quoteLocationOccupancyId)

        let total = 0

        let selectedLocationData = Object.entries(this.model).filter(([key, value]) => key != 'total').find(([key, value]) => key == quoteLocationOccupancyId)
        for (let [key, value] of Object.entries(selectedLocationData[1])) {
            if (key != 'total' && value && typeof (value) == 'number') total = total + Number(value);
        }
        // $event

        // TODO: Needs to move logic on save button
        // if (total < 0) {
        //     alert('Total cannot be less than 0')
        //     $event.target.value = 0
        //     return
        // }
        // if (total > quoteLocationOccupancy.sumAssured) {
        //     alert(`Total cannot be more than ${quoteLocationOccupancy.sumAssured}`)

        //     $event.target.value = 0

        //     return
        // }

        this.model[quoteLocationOccupancyId]['total'] = total

    }

    save({ IS_FETCH_FROM_AI = false }: { IS_FETCH_FROM_AI?: boolean }) {
        this.count = 0;

        // Loop Around all the records and prepare the total
        for (const quoteLocationOccupancy of this.quoteLocationOccupancies) {

            let total = 0

            const selectedLocationData = Object.entries(this.model).filter(([key, value]) => key != 'total').find(([key, value]) => key == quoteLocationOccupancy._id)

            this.data = selectedLocationData;

            for (let [key, value] of Object.entries(selectedLocationData[1])) {
                if (key != 'total' && value && typeof (value) == "number") total = total + Number(value);
            }

            if (total < 0) {
                this.messageService.add({
                    summary: 'Error',
                    detail: `Total for ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']} cannot be less than 0`,
                    severity: 'error'
                })
                return
            }
            // if (total > quoteLocationOccupancy.sumAssured) {
            //     // alert(`Total for ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']} cannot be more than ${quoteLocationOccupancy.sumAssured.toLocaleString('en-IN')}`)

            //     this.messageService.add({
            //         summary: 'Error',
            //         detail: `Total for ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']} cannot be more than ${quoteLocationOccupancy.sumAssured.toLocaleString('en-IN')}`,
            //         severity: 'error'
            //     })
            //     // $event.target.value = 0

            //     return
            // }
            if (!IS_FETCH_FROM_AI && total != quoteLocationOccupancy.sumAssured) {
                // alert(`Total for ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']} cannot be more than ${quoteLocationOccupancy.sumAssured.toLocaleString('en-IN')}`)

                this.messageService.add({
                    summary: 'Error',
                    detail: `Sum Insured for ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']} should be equal to ${quoteLocationOccupancy.sumAssured.toLocaleString('en-IN')}`,
                    severity: 'error'
                })
                // $event.target.value = 0

                return
            }
            this.quoteService.refresh();
            this.quoteOptionService.refreshQuoteOption()
            // this.ref.close(() => {
            //     this.quoteService.refresh();
            //     this.quoteOptionService.refreshQuoteOption()
            // })


        }



        // Loop Around all the records and prepare the payload
        let quoteLocationBreakups: Partial<IQuoteLocaitonBreakupMaster>[] = []

        this.checkForStockValidation(this.sales)

        if (this.quote.productId['is_validation_check']) {
            this.parseForRequiredLov(this.sales)
        }

        if (this.count > 0) {
            return
        }


        for (let [quoteLocationOccupancyId, locationWiseLov] of Object.entries(this.model)) {

            for (let [lovId, lovValue] of Object.entries(locationWiseLov)) {

                if (lovId != 'total') {
                    quoteLocationBreakups.push({
                        quoteLocationOccupancyId: quoteLocationOccupancyId,
                        lovId: lovId,
                        value: typeof (lovValue) == 'number' ? Number(lovValue ?? 0) : (typeof (lovValue) == 'string' ? String(lovValue == '' ? '-' : lovValue) : null)
                    })
                }
            }
        }


        // Api Call to Upsert
        // Old_Quote
        // this.quoteLocationBreakupService.batchUpsert(this.quote._id, {
        //     quoteLocationBreakups: quoteLocationBreakups
        // }).subscribe({
        //     next: (dto: IManyResponseDto<any>) => {
        //         this.quoteService.refresh((quote) => {

        //             this.onSaved.emit()

        //             this.messageService.add({
        //                 summary: "Success",
        //                 detail: 'Saved',
        //                 severity: 'success'
        //             })

        //         })

        //     }
        // })

        // New_Quote_Option
        // this.quoteLocationBreakupService.quoteOptionBatchUpsert(this.quoteOptionData._id, {
        //     quoteLocationBreakups: quoteLocationBreakups
        // }).subscribe({
        //     next: (dto: IManyResponseDto<any>) => {
        //         this.quoteOptionService.refreshQuoteOption((quote) => {

        //             this.onSaved.emit()


        //             this.messageService.add({
        //                 summary: "Success",
        //                 detail: 'Saved!',
        //                 severity: 'success'
        //             })

        //         })

        //     }
        // })


        const upsertMethod = IS_FETCH_FROM_AI
            ? this.quoteLocationBreakupService.batchUpsertWithAi.bind(this.quoteLocationBreakupService)
            // Old_Quote
            // : this.quoteLocationBreakupService.batchUpsert.bind(this.quoteLocationBreakupService);

            // New_Quote_option
            : this.quoteLocationBreakupService.quoteOptionBatchUpsert.bind(this.quoteLocationBreakupService);

        // Old_Quote
        // upsertMethod(this.quote._id, {

        // New_Quote_option
        upsertMethod(this.quoteOptionData._id, {
            quoteLocationBreakups: quoteLocationBreakups
        }).subscribe({
            next: (dto: IManyResponseDto<any>) => {
                const res: any = dto.data.entities;
                // if(this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR){
                if (res.filter((ele) => ele.lovKey == "Fire & Allied Perils").map((v) => v.value) != 0) {
                    const grossProfitFire = res.filter((ele) => ele.lovKey == "Fire & Allied Perils").map((v) => v.value)
                    const payload = {}
                    payload['quoteId'] = this.quote._id;
                    payload['quoteOptionId'] = this.quoteOptionData._id;                                    // New_Quote_option
                    payload['indmenityPeriod'] = '12 Months';
                    // Old_Quote
                    // payload['terrorism'] = this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;

                    // New_Quote_option
                    payload['terrorism'] = this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;
                    payload['grossProfit'] = grossProfitFire[0];
                    this.bscFireLossOfProfitService.create(payload).subscribe({
                        next: (response) => {

                            this.quoteService.refresh()
                            this.quoteOptionService.refreshQuoteOption()
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                if (res.filter((ele) => ele.lovKey == "MLOP").map((v) => v.value) != 0) {
                    const grossProfitMachinery = res.filter((ele) => ele.lovKey == "MLOP").map((v) => v.value)
                    const payload: any = {}
                    payload['quoteId'] = this.quote._id;
                    payload['quoteOptionId'] = this.quoteOptionData._id;                                   // New_Quote_option
                    payload['indmenityPeriod'] = '12 Months';
                    // Old_Quote
                    // payload['terrorism'] = this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;

                    // New_Quote_option
                    payload['terrorism'] = this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;
                    payload['grossProfit'] = grossProfitMachinery[0];
                    this.machineryLossOfProfitService.create(payload).subscribe({
                        next: (response) => {

                            this.quoteService.refresh()
                            this.quoteOptionService.refreshQuoteOption()
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                // }
                this.quoteOptionService.refreshQuoteOption((quote) => {
                    this.onSaved.emit()
                    this.messageService.add({
                        summary: "Success",
                        detail: 'Saved!',
                        severity: 'success'
                    })

                })

            }
        })

        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.IAR) {
        //     // Old_Quote
        //     // const bscFireLossOfProfit = this.quote?.locationBasedCovers?.bscFireLossOfProfitCover

        //     // New_Quote_Option
        //     const bscFireLossOfProfit = this.quoteOptionData?.locationBasedCovers?.bscFireLossOfProfitCover
        //     if (bscFireLossOfProfit?._id) {
        //         let payload = { ...bscFireLossOfProfit };
        //         payload['grossProfit'] = this.data[1]['660fa3ef9d2b150c18b3de37']
        //         this.bscFireLossOfProfitService.update(bscFireLossOfProfit?._id, payload).subscribe({
        //             next: (response) => {
        //                 this.quoteService.refresh()
        //                 this.quoteOptionService.refreshQuoteOption()
        //             },
        //             error: error => {
        //                 console.log(error);
        //             }
        //         });
        //     } else {
        //         const payload = {}
        //         payload['quoteId'] = this.quote._id;
        //         payload['quoteOptionId'] = this.quoteOptionData._id;                                         // New_Quote_Option
        //         payload['indmenityPeriod'] = '12 Months';
        //         // Old_Quote
        //         // payload['terrorism'] = this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;

        //         // New_Quote_Option
        //         payload['terrorism'] = this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;
        //         payload['grossProfit'] = this.data[1]['660fa3ef9d2b150c18b3de37']
        //         this.bscFireLossOfProfitService.create(payload).subscribe({
        //             next: (response) => {

        //                 this.quoteService.refresh()
        //                 this.quoteOptionService.refreshQuoteOption()
        //             },
        //             error: error => {
        //                 console.log(error);
        //             }
        //         });
        //     }
        //     // Old_Quote
        //     // const machineryLossOfProfit = this.quote?.locationBasedCovers?.machineryLossOfProfitCover

        //     // New_Quote_Option
        //     const machineryLossOfProfit = this.quoteOptionData?.locationBasedCovers?.machineryLossOfProfitCover
        //     if (machineryLossOfProfit?._id) {
        //         let payload = { ...machineryLossOfProfit };
        //         payload['grossProfit'] = this.data[1]['660fa40e9d2b150c18b3e03d']
        //         this.machineryLossOfProfitService.update(machineryLossOfProfit?._id, payload).subscribe({
        //             next: (response) => {
        //                 this.quoteService.refresh()
        //                 this.quoteOptionService.refreshQuoteOption()
        //             },
        //             error: error => {
        //                 console.log(error);
        //             }
        //         });
        //     } else {
        //         const payload: any = {}
        //         payload['quoteId'] = this.quote._id;
        //         payload['quoteOptionId'] = this.quoteOptionData._id;                               // New_Quote_Option
        //         payload['indmenityPeriod'] = '12 Months';
        //         // Old_Quote
        //         // payload['terrorism'] = this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;

        //         // New_Quote_Option
        //         payload['terrorism'] = this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;
        //         payload['grossProfit'] = this.data[1]['660fa40e9d2b150c18b3e03d']
        //         this.machineryLossOfProfitService.create(payload).subscribe({
        //             next: (response) => {

        //                 this.quoteService.refresh()
        //                 this.quoteOptionService.refreshQuoteOption()
        //             },
        //             error: error => {
        //                 console.log(error);
        //             }
        //         });
        //     }
        // }
    }

    downloadSampleFile() {
        // Old_Quote
        // this.quoteLocationBreakupService.bulkImportGenerateSample(this.quote._id).subscribe({

        // New_Quote_Option
        this.quoteLocationBreakupService.bulkImportGenerateSample(this.quoteOptionData._id).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }


    get quoteLocationBreakupBulkImportProps(): PFileUploadGetterProps {
        // Old_Quote
        // return this.quoteLocationBreakupService.getBulkImportProps(this.quote['_id'], (dto: IOneResponseDto<IBulkImportResponseDto>) => {

        // New_Quote_Option
        return this.quoteLocationBreakupService.getBulkImportProps(this.quoteOptionData['_id'], (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                this.messageService?.add({
                    summary: "Success",
                    detail: 'File Uploaded Successfully',
                    severity: 'success'
                })
                this.quoteOptionService.refreshQuoteOption((quote) => {
                    this.cols = [];
                    this.prepare();

                    this.onSaved.emit();

                })
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }
    fileUploaded($event: any) {
        this.quoteOptionService.refreshQuoteOption();

    }

    errorHandler(e, uploader: FileUpload) {
        uploader.remove(e, 0)
    }

    async prepareNewSISplit() {
        const quoteLocationOccupancies = await this.getQuoteLocationOccupancies()
        this.quoteLocationOccupancies = quoteLocationOccupancies
        const quoteLocationBreakups = await this.getQuoteLocationBreakup()

        if (quoteLocationBreakups?.length != 0) {
            //@ts-ignore
            this.splitData = this.buildSplitDataHierarchy(quoteLocationBreakups);
        } else {
            this.splitData = this.quote?.productId["productTemplate"] == "FIRE" ? this.fireLov :
                this.quote?.productId["productTemplate"] == "BLUS" ? this.blusLov :
                    this.quote?.productId["shortName"] == "CAR" ? this.carLov :
                        this.quote?.productId["shortName"] == "EAR" ? this.carLov :
                            this.quote?.productId["productTemplate"] == "IAR" ? this.iarLov :
                                this.fireLov
        }
        this.updateTotals();
    }

    buildSplitDataHierarchy(breakups: any[]) {
        const hierarchy: any[] = [];
        let currentHeader = null;
        let currentSubheader = null;

        breakups.forEach((breakup) => {
            if (breakup.heading && breakup.children) {
                if (!currentHeader || currentHeader.description !== breakup.heading) {
                    currentHeader = { description: breakup.heading, isHeader: true, amounts: [] };
                    hierarchy.push(currentHeader);
                    currentSubheader = "";
                }
                if (!currentSubheader || currentSubheader.description !== breakup.subHeading) {
                    currentSubheader = { description: breakup.subHeading, isHeader: true, amounts: [] };
                    hierarchy.push(currentSubheader);
                }

                const row = hierarchy.find(
                    (item) =>
                        item.description === breakup.children &&
                        !item.isHeader &&
                        item.heading === breakup.heading &&
                        item.subHeading === breakup.subHeading
                );

                if (!row) {
                    hierarchy.push({
                        description: breakup.children,
                        isHeader: false,
                        amounts: Array(this.quoteLocationOccupancies.length).fill(0),
                        heading: breakup.heading,
                        subHeading: breakup.subHeading,
                        lovKey: breakup.lovKey,
                        lovReferences: breakup.lovReferences,
                        disabled: breakup.children == "FLOP" ? true : breakup.children == "MBLOP" ? true : false
                    });
                }

                const locationIndex = this.quoteLocationOccupancies.findIndex(
                    (location) =>
                        breakup.quoteLocationOccupancyId &&
                        breakup.quoteLocationOccupancyId._id &&
                        location._id === breakup.quoteLocationOccupancyId._id
                );
                if (locationIndex !== -1) {
                    const dataRow = hierarchy.find(
                        (item) =>
                            item.description === breakup.children &&
                            !item.isHeader &&
                            item.heading === breakup.heading &&
                            item.subHeading === breakup.subHeading
                    );
                    if (dataRow) {
                        dataRow.amounts[locationIndex] = breakup.value;
                    }
                }
            }
        });
        return hierarchy;
    }

    updateTotals() {
        this.totals = this.quoteLocationOccupancies.map((_, locIndex) => {
            const columnTotal = this.splitData.reduce((sum, item) => {
                const amount = item.amounts[locIndex] || 0;
                return sum + amount;
            }, 0);
            return columnTotal;
        });
    }

    saveData() {
        let currentHeader = '';
        let currentSubheader = '';

        for (let i = 0; i < this.quoteLocationOccupancies.length; i++) {
            const totalForLocation = this.splitData
                .filter((item) => !item.isHeader)
                .reduce((sum, item) => sum + (item.amounts[i] || 0), 0);

            if (["PAR", "IAR", "MEGA"].includes(this.quote.productId["shortName"])) {
                let requiredItems
                switch (this.quote.productId["shortName"]) {
                    case 'PAR': {
                        const row1 = this.splitData.find((item) => item.lovKey === "row1");
                        const row2 = this.splitData.find((item) => item.lovKey === "row2");
                        const flopRow = this.splitData.find((item) => item.description === "FLOP");

                        const hasRow1Value = row1 && row1.amounts[i] && row1.amounts[i] > 0;
                        const hasRow2Value = row2 && row2.amounts[i] && row2.amounts[i] > 0;

                        const hasFlopValue = flopRow && flopRow.amounts[i] && flopRow.amounts[i] > 0;

                        if (!hasRow1Value && !hasRow2Value) {
                            this.messageService.add({
                                summary: "Error",
                                detail: `At least one value is required in Property Damage for location ${this.quoteLocationOccupancies[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancies[i].pincodeId['name']}`,
                                severity: "error",
                            });
                            return;
                        }

                        if (!hasFlopValue) {
                            this.messageService.add({
                                summary: "Error",
                                detail: `FLOP is mandatory in Property Damage for location ${this.quoteLocationOccupancies[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancies[i].pincodeId['name']}`,
                                severity: "error",
                            });
                            return;
                        }


                        break;
                    }
                    case 'IAR':
                        requiredItems = this.splitData.filter(
                            (item) => item.description === "FLOP"
                        );
                        for (const item of requiredItems) {
                            if (!item.amounts[i] || item.amounts[i] <= 0) {
                                this.messageService.add({
                                    summary: "Error",
                                    detail: `Amount is required for ${item.description} in location ${this.quoteLocationOccupancies[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancies[i].pincodeId['name']}`,
                                    severity: "error",
                                });

                                return;
                            }
                        }
                        break;
                    case 'MEGA': {
                        const row1 = this.splitData.find((item) => item.lovKey === "row1");
                        const row2 = this.splitData.find((item) => item.lovKey === "row2");

                        const hasRow1Value = row1 && row1.amounts[i] && row1.amounts[i] > 0;
                        const hasRow2Value = row2 && row2.amounts[i] && row2.amounts[i] > 0;

                        if (!hasRow1Value && !hasRow2Value) {
                            this.messageService.add({
                                summary: "Error",
                                detail: `At least one value is required in Property Damage for location ${this.quoteLocationOccupancies[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancies[i].pincodeId['name']}`,
                                severity: "error",
                            });
                            return;
                        }

                        break;
                    }
                }
            }
            const flopItem = this.splitData.find((item) => item.description === "FLOP");
            const mblopItem = this.splitData.find((item) => item.description === "MBLOP");

            if (flopItem && mblopItem) {
                if (mblopItem.amounts[i] !== 0 && mblopItem.amounts[i] !== flopItem.amounts[i] && mblopItem.amounts[i] !== null) {
                    this.messageService.add({
                        summary: "Error",
                        detail: `Amount for MBLOP must be equal to FLOP in location ${this.quoteLocationOccupancies[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancies[i].pincodeId['name']}`,
                        severity: "error",
                    });
                    return;
                }
            }

            if (totalForLocation != this.quoteLocationOccupancies[i].sumAssured) {

                this.messageService.add({
                    summary: 'Error',
                    detail: `Sum Insured for ${this.quoteLocationOccupancies[i].clientLocationId['locationName']} - ${this.quoteLocationOccupancies[i].pincodeId['name']} should be equal to ${this.quoteLocationOccupancies[i].sumAssured.toLocaleString('en-IN')}`,
                    severity: 'error'
                })

                return
            }

        }

        const payload: any[] = [];
        this.splitData.forEach((item) => {
            if (item.isHeader) {
                if (!currentHeader) {
                    currentHeader = item.description;
                } else if (!currentSubheader) {
                    currentSubheader = item.description;
                } else {
                    currentHeader = item.description;
                    currentSubheader = '';
                }

            } else {
                this.quoteLocationOccupancies.forEach((location, locIndex) => {
                    payload.push({
                        quoteId: this.quote?._id,
                        quoteOptionId: this.quoteOptionData?._id,
                        quoteLocationOccupancyId: location?._id,
                        lovKey: item.lovKey,
                        children: item.description,
                        value: item.amounts[locIndex] || 0,
                        heading: currentHeader,
                        subHeading: currentSubheader || null,
                        lovReferences: item.lovReferences,
                        __v: 0,
                    });
                });
            }
        });
        this.quoteLocationBreakupService.quoteOptionBatchUpsert(this.quoteOptionData?._id, {
            quoteLocationBreakups: payload
        }).subscribe({
            next: (dto: IManyResponseDto<any>) => {
                this.messageService.add({
                    summary: 'Success',
                    detail: 'Data saved successfully!',
                    severity: 'success',
                });
                this.onSaved.emit()
                const res: any = dto.data.entities;
                if (res.filter((ele) => ele.children == "FLOP").map((v) => v.value) != 0) {
                    const grossProfitFire = res.filter((ele) => ele.children == "FLOP").map((v) => v.value)
                    const payload = {}
                    payload['quoteId'] = this.quote._id;
                    payload['quoteOptionId'] = this.quoteOptionData._id;                                    // New_Quote_option
                    payload['indmenityPeriod'] = '12 Months';
                    // Old_Quote
                    // payload['terrorism'] = this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;

                    // New_Quote_option
                    payload['terrorism'] = this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;
                    payload['grossProfit'] = grossProfitFire[0];
                    this.bscFireLossOfProfitService.create(payload).subscribe({
                        next: (response) => {

                            // this.quoteService.refresh()
                            // this.quoteOptionService.refreshQuoteOption()
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                if (res.filter((ele) => ele.children == "MBLOP").map((v) => v.value) != 0) {
                    const grossProfitMachinery = res.filter((ele) => ele.children == "MBLOP").map((v) => v.value)
                    const payload: any = {}
                    payload['quoteId'] = this.quote._id;
                    payload['quoteOptionId'] = this.quoteOptionData._id;                                   // New_Quote_option
                    payload['indmenityPeriod'] = '12 Months';
                    // Old_Quote
                    // payload['terrorism'] = this.quote?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;

                    // New_Quote_option
                    payload['terrorism'] = this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?.isTerrorism;
                    payload['grossProfit'] = grossProfitMachinery[0];
                    this.machineryLossOfProfitService.create(payload).subscribe({
                        next: (response) => {

                            // this.quoteService.refresh()
                            // this.quoteOptionService.refreshQuoteOption()
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                if (["IAR", "MEGA"].includes(this.quote.productId["shortName"]) && res.filter((ele) => ele.children == "Machinary").map((v) => v.value) != 0) {
                    const siValue = res.filter((ele) => ele.children == "Machinary").map((v) => v.value)
                    const payload: any = [{
                        quoteLocationOccupancyId: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy._id,
                        stock: siValue[0],
                        sumInsured: siValue[0],
                        machineryPercentage: 100
                    }]

                    this.machineryElectricalBreakdownCoverService.setAllMachinery({
                        quoteOptionId: this.quoteOptionData._id,
                        payload: payload
                    }).subscribe({
                        next: (response: IOneResponseDto<IMachineryELectricalBreakDownCover>) => {
                            this.quoteOptionService.refreshQuoteOption()
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                this.quoteService.setQuote(this.quote);
                this.quoteOptionService.setQuoteOptionForProperty(this.quoteOptionData);
                this.quoteService.refresh();
                this.quoteOptionService.refreshQuoteOption()
            },
            error: (err) => {
                ``
                this.messageService.add({
                    summary: 'Error',
                    detail: 'Failed to save data. Please try again.',
                    severity: 'error',
                });
            },
        })

    }
}
