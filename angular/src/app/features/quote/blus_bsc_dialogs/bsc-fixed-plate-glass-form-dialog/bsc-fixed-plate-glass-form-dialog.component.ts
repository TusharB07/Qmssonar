import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IBscFixedPlateGlassCover } from 'src/app/features/admin/bsc-fixed-plate-glass/bsc-fixed-plate-glass.model';
import { BscFixedPlateGlassService } from 'src/app/features/admin/bsc-fixed-plate-glass/bsc-fixed-plate-glass.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IOccupancyRate } from 'src/app/features/admin/occupancy-rate/occupancy-rate.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-bsc-fixed-plate-glass-form-dialog',
    templateUrl: './bsc-fixed-plate-glass-form-dialog.component.html',
    styleUrls: ['./bsc-fixed-plate-glass-form-dialog.component.scss']
})
export class BscFixedPlateGlassFormDialogComponent implements OnInit, OnChanges {
    fixedPlateGlassForm: FormGroup;
    cities: any[];
    optionsPlateGlassType: ILov[];
    submitted: boolean = false;
    bscFixedPlateGlass: IBscFixedPlateGlassCover;
    selectedQuoteLocationOccpancy;
    optionsQuoteLocationOccupancies: ILov[];

    quote: IQuoteSlip


    toWords = new ToWords();
    currentUser$: Observable<IUser>;

    permissions: PermissionType[] = [];
    minNSTP: any = 0;

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private bscFixedPlateGlassService: BscFixedPlateGlassService,
        private listOfValueService: ListOfValueMasterService,
        private accountService: AccountService,
        private bscCoverService: BscCoverService
    ) {
        this.currentUser$ = this.accountService.currentUser$

        this.quote = this.config.data.quote

        this.bscFixedPlateGlass = this.config.data.bscFixedPlateGlassCover;

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.searchOptionsQuoteLocationOccpancies();
        this.createForm(this.bscFixedPlateGlass);

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

    ngOnChanges(changes: SimpleChanges): void {
        this.createForm(this.bscFixedPlateGlass);
    }

    searchOptionsPlateGlassType(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.BSC_FIXED_PLATE_GLASS_TYPE, this.quote?.productId['_id']).subscribe({
            next: data => {
                this.optionsPlateGlassType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, sumMin: entity.fromSI, sumMax: entity.toSI, maxNSTP: entity.perEmployeeLimit ?? 0 }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
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
                    let occupancy: IOccupancyRate = entity.occupancyId as IOccupancyRate;
                    let pincode: IPincode = entity.pincodeId as IPincode

                    // return { label: `${clientLocation?.locationName} - ${occupancy.occupancyType}`, value: clientLocation._id }
                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id }

                });
                // this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.clientLocationId)[0];
                this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.quoteLocationOccupancyId)[0];
            },
            error: e => { }
        });

    }

    createForm(item?: any) {
        const plateGlassType = item?.plateGlassType as IListOfValueMaster

        this.fixedPlateGlassForm = this.fb.group({
            _id: [item?._id],
            //riskLocation: [null],
            plateGlassType: [plateGlassType ? { label: plateGlassType.lovKey, value: plateGlassType._id, sumMin: plateGlassType.fromSI, sumMax: plateGlassType.toSI, maxNSTP: plateGlassType.perEmployeeLimit ?? 0 } : null, [Validators.required]],
            description: [item?.description, [Validators.required, Validators.maxLength(255)]],
            sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
            fileInput: [item?.filePath]
        })
    }

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscFixedPlateGlass?.filePath).subscribe(res => {

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

    submitFixedPlateGlassForm() {
        if (this.fixedPlateGlassForm.valid) {
            const payload = { ...this.fixedPlateGlassForm.value };
            let bscFormData = new FormData();

            bscFormData.append("plateGlassType", payload['plateGlassType']['value']);
            bscFormData.append("description", payload['description']);
            bscFormData.append("sumInsured", payload['sumInsured']);
            bscFormData.append("quoteId", this.config.data.quoteId)
            bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
            bscFormData.append("quoteLocationOccupancyId", this.config.data.quoteLocationOccupancyId)
            bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
            bscFormData.append("file", payload['fileInput']);
            // payload['plateGlassType'] = payload.plateGlassType.value;

            // this.bscFixedPlateGlassService.create(bscFormData).subscribe({
            //     next: (response: IOneResponseDto<IBscFixedPlateGlassCover>) => {
            //         this.bscFixedPlateGlass = response.data.entity;
            //         this.ref.close(this.bscFixedPlateGlass);
            //     },
            //     error: error => {
            //         console.log(error);
            //     }
            // });
            if (this.bscFixedPlateGlass?._id) {
                this.bscFixedPlateGlassService.update(this.bscFixedPlateGlass._id, bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscFixedPlateGlassCover>) => {
                        this.bscFixedPlateGlass = response.data.entity;
                        this.ref.close(this.bscFixedPlateGlass);
                    },
                    error: error => {
                        console.log(error);
                    }
                });

            } else {
                // payload['clientLocationId'] = this.config.data.clientLocationId;
                payload['quoteLocationOccupancyId'] = this.config.data.quoteLocationOccupancyId;
                payload['quoteId'] = this.config.data.quoteId;
                payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
                this.bscFixedPlateGlassService.create(bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscFixedPlateGlassCover>) => {
                        this.bscFixedPlateGlass = response.data.entity;
                        this.ref.close(this.bscFixedPlateGlass);
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
        console.log(typeof val);
        return typeof val === 'object';
    }

    onBasicUpload(e) {
        this.fixedPlateGlassForm.value.fileInput = e.currentFiles[0]
    }

    deletefile(e) {

        if (this.bscFixedPlateGlass._id) {
            let payload = {}
            payload['filePath'] = this.bscFixedPlateGlass.filePath
            payload['_id'] = this.bscFixedPlateGlass._id
            console.log(payload)
            this.bscFixedPlateGlassService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscFixedPlateGlass)
                }
            })
        }
    }
}
