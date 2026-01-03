import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType, RsmD } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { BscBurglaryAndHousebreakingService } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { AllowedListOfValuesMasters, AllowedLovReferences, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IOccupancyRate } from 'src/app/features/admin/occupancy-rate/occupancy-rate.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-bsc-burglary-and-housebreaking-form-dialog',
    templateUrl: './bsc-burglary-and-housebreaking-form-dialog.component.html',
    styleUrls: ['./bsc-burglary-and-housebreaking-form-dialog.component.scss']
})
export class BscBurglaryAndHousebreakingFormDialogComponent implements OnInit {

    quote: IQuoteSlip;

    burglaryForm: FormGroup;
    selectedCities: string = '';
    cities: ILov[];
    optionsFirstLossSumInsured: ILov[];
    optionsRsmd: ILov[];
    optionsRsmdDefault: RsmD[];
    optionsTheft: ILov[];
    optionsTheftDefault: RsmD[];
    selectedIndmenityPeriod: string = '';
    selectedfirstLossSumInsured: string = '';
    selectedrsmd: string = '';
    selectedtheft: string = '';
    submitted: boolean = false;
    totalPremium: number = 71500
    selectedQuoteLocationOccpancy;
    optionsQuoteLocationOccupancies: ILov[];

    bscBurglaryAndHousebreaking: IBscBurglaryHousebreakingCover;

    toWords = new ToWords();
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];

    optionsBurgularyType: ILov[];
    SIWithoutBuilding: number = 0;
    isFirstLossRequired = [];

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private formBuilder: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private bscBurglaryAndHousebreakingService: BscBurglaryAndHousebreakingService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private accountService: AccountService,
        private listOfValueService: ListOfValueMasterService,
        public messageService: MessageService,
        private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
        private bscCoverService: BscCoverService
    ) {

        this.optionsBurgularyType = [];
        /* this.cities = [
          {label: 'New York', value: 'New York'},
          {label: 'Rome', value: 'Rome'},
          {label: 'London', value: 'London'},
          {label: 'Istanbul', value: 'Istanbul'},
          {label: 'Paris', value: 'Paris'}
      ]; */
        this.optionsFirstLossSumInsured = [
            { label: '130,000,000', value: '130000000' },
            { label: '150,000,000', value: '150000000' },
        ];

        this.optionsRsmdDefault = [
            { label: 'Yes', value: 'true' },    //static value for dropdown
            { label: 'No', value: 'false' },
        ]

        this.optionsTheftDefault = [
            { label: 'Yes', value: 'true' },    //static value for dropdown
            { label: 'No', value: 'false' },
        ]

        // this.searchOptionsQuoteLocationOccpancies();

        this.quote = this.config.data.quote;

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option

        this.bscBurglaryAndHousebreaking = this.config.data.bscBurglaryHousebreakingCover;
        this.currentUser$ = this.accountService.currentUser$
    }

    ngOnInit(): void {
        this.createForm(this.bscBurglaryAndHousebreaking);
        this.getQuoteLocationBreakup();
        this.searchOptionsQuoteLocationOccpancies();

        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })
    }
    searchOptionsQuoteLocationOccpancies() {
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 20,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.config.data.quoteId,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }
        //         ]
        //     },
        //     globalFilter: null,
        //     multiSortMeta: null
        // };

        // New_Quote_option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.config.data.quoteOption._id,
                        matchMode: "equals",
                        operator: "and"
                    }

                ],
            },
            globalFilter: null,
            multiSortMeta: null
        };
        this.quoteLocationOccupancyService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: data => {
                // console.log(data)
                this.optionsQuoteLocationOccupancies = data.data.entities.map((entity: IQuoteLocationOccupancy) => {
                    let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation
                    let pincode: IPincode = entity.pincodeId as IPincode
                    let occupancy: IOccupancyRate = entity.occupancyId as IOccupancyRate;

                    //   return { label: `${clientLocation?.locationName} - ${occupancy.occupancyType}`, value: clientLocation._id }
                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id }

                });
                // this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter( location => location.value === this.config.data.clientLocationId)[0];
                this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.quoteLocationOccupancyId)[0];
            },
            error: e => { }
        });

    }

    searchOptionsBurgularyTypes(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.BSC_BURGLARY_AND_HOUSEBREAKING_TYPE, this.quote?.productId['_id']).subscribe({
            next: data => {
                this.optionsBurgularyType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, percentage: entity.toSI }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }

    getQuoteLocationBreakup() {
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
        //                 value: this.config.data.quoteId,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }

        //         ],
        //         // @ts-ignore
        //         quoteLocationOccupancyId: [
        //             {
        //                 value: this.config.data.quoteLocationOccupancyId,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }

        //         ],
        //     },
        // }

        // New_Quote_option
        let event: LazyLoadEvent = {
            first: 0,
            rows: 5000,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.config.data.quoteOption._id,
                        matchMode: "equals",
                        operator: "and"
                    }

                ],
                // @ts-ignore
                quoteLocationOccupancyId: [
                    {
                        value: this.config.data.quoteLocationOccupancyId,
                        matchMode: "equals",
                        operator: "and"
                    }

                ],
            },
        }

        this.quoteLocationBreakupService.getMany(event).subscribe(res => {
            let values = res.data.entities.filter(item => item.lovKey != 'Building').map(item => {
                if (typeof item.value == 'number') {
                    this.SIWithoutBuilding += item.value
                }
            })
            this.createForm(this.bscBurglaryAndHousebreaking, this.SIWithoutBuilding)
        })

    }

    createForm(item?: IBscBurglaryHousebreakingCover, othercontents?: number) {

        const burglaryType = item?.burglaryTypeId as IListOfValueMaster;
        item?.isFirstLossOpted ? this.isFirstLossRequired = [true] : this.isFirstLossRequired = []

        // let stockReference = this.quote.locationBasedCovers.lovReferences.find((item) => item.lovReference == AllowedLovReferences.BSC_BURGLARY_AND_HOUSEBREAKING_STOCKS);
        // let otherContentsReference = this.quote.locationBasedCovers.lovReferences.find((item) => item.lovReference == AllowedLovReferences.BSC_BURGLARY_AND_HOUSEBREAKING_OTHER_CONTENTS);

        this.burglaryForm = this.formBuilder.group({
            _id: [item?._id],
            //locationId: [item?.locationId,[Validators.required]],
            // firstLoss: [item?.firstLoss ?? 100, [Validators.required, Validators.max(100), Validators.min(1)]],
            burglaryTypeId: [burglaryType ? { label: burglaryType.lovKey, value: burglaryType._id } : null],
            // stocks: [item?.stocks ?? stockReference?.lovValue ?? 0, [Validators.required, Validators.min(0)]],
            otherContents: [othercontents ?? 0, [Validators.required]],
            firstLossSumInsured: [item?.firstLossSumInsured ?? 0, [Validators.min(0)]],
            // rsmd: [item?.rsmd ? 'true' : 'false', [Validators.required]],
            // theft: [item?.theft ? 'true' : 'false', [Validators.required]],
            rsmd: ['true', [Validators.required]],
            theft: ['true', [Validators.required]],
            fileInput: [item?.filePath]
            // indmenityPeriod: [null],
        })

        // this.burglaryForm.controls['firstLoss'].valueChanges.subscribe({
        //     next: (value) => {
        //         console.log(value)

        //         if (this.burglaryForm.controls['firstLoss'].valid) {
        //             this.burglaryForm.controls['firstLossSumInsured'].setValue((this.burglaryForm.value.stocks + this.burglaryForm.value.otherContents) * (value / 100))
        //         }
        //     }
        // })
    }

    deletefile(e) {

        if (this.bscBurglaryAndHousebreaking._id) {
            let payload = {}
            payload['filePath'] = this.bscBurglaryAndHousebreaking.filePath
            payload['_id'] = this.bscBurglaryAndHousebreaking._id
            this.bscBurglaryAndHousebreakingService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscBurglaryAndHousebreaking)
                }
            })
        }
    }

    compute(e) {
        this.burglaryForm.controls['firstLossSumInsured'].setValue((this.burglaryForm.value.otherContents) * (e.percentage / 100))
    }

    firstLossCalculation() {
        if (this.isFirstLossRequired.length == 0) {
            this.burglaryForm.controls['burglaryTypeId'].setValue(null)
            this.burglaryForm.controls['firstLossSumInsured'].setValue(0)
        }
    }

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscBurglaryAndHousebreaking?.filePath).subscribe(res => {

            let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';

            const a = document.createElement('a')
            const blob = new Blob([res.body], { type: res.headers.get('content-type') });
            const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
            const objectUrl = window.URL.createObjectURL(file);

            a.href = objectUrl
            a.download = fileName;
            a.click();

            // window.open(objectUrl, '_blank');
            URL.revokeObjectURL(objectUrl);

        })
    }

    submitBurglaryForm() {

        if (this.SIWithoutBuilding == 0) {
            this.messageService.add({
                key: "error",
                severity: "error",
                summary: `Fail`,
                detail: `Please provide data in Sum Insured split.`
            });
        } else {
            const payload = { ...this.burglaryForm.value };
            payload['burglaryTypeId'] = payload.burglaryTypeId?.value ?? ''
            payload['isFirstLossOpted'] = this.isFirstLossRequired[0] ?? false


            // const payload = { ...this.burglaryForm.value }
            let bscFormData = new FormData();
            bscFormData.append("burglaryTypeId", payload['burglaryTypeId']);
            bscFormData.append("isFirstLossOpted", payload['isFirstLossOpted']);
            bscFormData.append("otherContents", payload['otherContents']);
            bscFormData.append("firstLossSumInsured", payload['firstLossSumInsured']);
            bscFormData.append("rsmd", payload['rsmd']);
            bscFormData.append("theft", payload['theft']);
            bscFormData.append("quoteId", this.config.data.quoteId)
            bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
            bscFormData.append("quoteLocationOccupancyId", this.config.data.quoteLocationOccupancyId)
            bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
            bscFormData.append("file", payload['fileInput']);

            // this.bscBurglaryAndHousebreakingService.create(bscFormData).subscribe({
            //     next: (response: IOneResponseDto<IBscBurglaryHousebreakingCover>) => {
            //         // success code
            //         this.bscBurglaryAndHousebreaking = response.data.entity
            //         this.ref.close(this.bscBurglaryAndHousebreaking);
            //     },
            //     error: error => {
            //         console.log(error);
            //     }
            // });
            if (this.bscBurglaryAndHousebreaking?._id) {
                const payload = { ...this.burglaryForm.value };

                this.bscBurglaryAndHousebreakingService.update(this.bscBurglaryAndHousebreaking?._id, bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscBurglaryHousebreakingCover>) => {
                        // success code
                        this.bscBurglaryAndHousebreaking = response.data.entity
                        this.ref.close(this.bscBurglaryAndHousebreaking);
                    },
                    error: error => {
                        console.log(error);
                    }
                });

            } else {
                payload['quoteId'] = this.config.data.quoteId;
                // payload['clientLocationId'] = this.config.data.clientLocationId;
                payload['quoteLocationOccupancyId'] = this.config.data.quoteLocationOccupancyId;
                payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option

                this.bscBurglaryAndHousebreakingService.create(bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscBurglaryHousebreakingCover>) => {
                        // success code
                        this.bscBurglaryAndHousebreaking = response.data.entity
                        this.ref.close(this.bscBurglaryAndHousebreaking);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

    cancel() {
        this.ref.close();
    }

    isFile(val): boolean {
        return typeof val === 'object';
    }

    onBasicUpload(e) {
        this.burglaryForm.value.fileInput = e.currentFiles[0]
    }
}

