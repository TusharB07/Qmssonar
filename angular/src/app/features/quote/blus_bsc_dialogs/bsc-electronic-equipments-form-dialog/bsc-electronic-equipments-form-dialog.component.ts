import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IBscElectronicEquipmentsCover } from 'src/app/features/admin/bsc-electronic-equipment/bsc-electronic-equipment.model';
import { BscElectronicEquipmentService } from 'src/app/features/admin/bsc-electronic-equipment/bsc-electronic-equipment.service';
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
    selector: 'app-bsc-electronic-equipments-form-dialog',
    templateUrl: './bsc-electronic-equipments-form-dialog.component.html',
    styleUrls: ['./bsc-electronic-equipments-form-dialog.component.scss']
})
export class BscElectronicEquipmentsFormDialogComponent implements OnInit {
    electronicEquipmentsForm: FormGroup;
    cities: any[];
    selectedCities: string = '';
    submitted: boolean = false;
    totalPremium: number = 71500;
    selectedQuoteLocationOccpancy;
    optionsQuoteLocationOccupancies: ILov[];
    bscElectronicEquipments: IBscElectronicEquipmentsCover;
    quote: IQuoteSlip;
    max: any = 0;
    min: any = 0;
    maxNSTP: any = 0;
    minNSTP: number = 0;
    toWords = new ToWords();
    currentUser$: Observable<IUser>;

    permissions: PermissionType[] = [];
    optionsEquipmentType: any[] = [];

    quoteOption: IQuoteOption                           // New_Quote_option


    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private bscElectronicEquipmentService: BscElectronicEquipmentService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private accountService: AccountService,
        private bscCoverService: BscCoverService,
        private listOfValueService: ListOfValueMasterService
    ) {
        /* this.cities = [
          {name: 'New York', code: 'NY'},
          {name: 'Rome', code: 'RM'},
          {name: 'London', code: 'LDN'},
          {name: 'Istanbul', code: 'IST'},
          {name: 'Paris', code: 'PRS'}
      ]; */
        this.bscElectronicEquipments = this.config.data.bscElectronicEquipmentsCover;
        this.currentUser$ = this.accountService.currentUser$
        this.quote = this.config.data.quote;

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.searchOptionsEquipmentTypes();
        this.searchOptionsQuoteLocationOccpancies();
        this.createForm(this.bscElectronicEquipments);
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

    searchOptionsEquipmentTypes() {
        this.bscCoverService.getAllCover().subscribe({
            next: data => {
                data.data.entities.map((ele) => {
                    if (ele.productId == this.quote.productId['_id']) {
                        if (ele.bscType == 'electronic_equipments') {
                            this.max = ele.toSI
                            this.min = ele.fromSI
                            this.maxNSTP = ele.maxNstp
                        }
                    }
                })
            },
            error: e => {
                console.log(e);
            }
        });

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

                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id }

                });
                // this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.clientLocationId)[0];
                this.selectedQuoteLocationOccpancy = this.optionsQuoteLocationOccupancies.filter(location => location.value === this.config.data.quoteLocationOccupancyId)[0];
            },
            error: e => { }
        });

    }

    /* onSelect(e) {
      // to search buglary&housebreaking records on change event with new clientlocation ID
      this.searchBscMoneyInSafeTillRecords(e.value);
    }

    searchBscMoneyInSafeTillRecords(clientLocationId) {
      let lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 20,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          quoteId: [
            {
              value: this.config.data.quote_id,
              matchMode: "equals",
              operator: "and"
            }
          ],
          // @ts-ignore
          clientLocationId: [
            {
              value: clientLocationId,
              matchMode: "equals",
              operator: "and"
            }
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      };

      this.bscElectronicEquipmentService.getMany(lazyLoadEvent).subscribe({
        next: (records: IManyResponseDto<IBscElectronicEquipmentsCover>) => {
          this.bscElectronicEquipments = records.data.entities[0];

          this.createForm(this.bscElectronicEquipments);
        },
        error: e => {
          console.log(e);
        }
      });
      this.createForm();
    } */

    createForm(item?: IBscElectronicEquipmentsCover) {
        this.electronicEquipmentsForm = this.fb.group({
            _id: [item?._id],
            descriptionEquipments: [item?.descriptionEquipments, [Validators.required, Validators.maxLength(255)]],
            sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1),]],
            fileInput: [item?.filePath]
            // riskLocation: [null]
        })
    }

    submitElectronicEquipmentForm() {
        if (this.electronicEquipmentsForm.valid) {
            const payload = { ...this.electronicEquipmentsForm.value }
            let bscFormData = new FormData();
            bscFormData.append("descriptionEquipments", payload['descriptionEquipments']);
            bscFormData.append("sumInsured", payload['sumInsured']);
            bscFormData.append("quoteId", this.config.data.quoteId)
            bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
            bscFormData.append("quoteLocationOccupancyId", this.config.data.quoteLocationOccupancyId)
            bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
            bscFormData.append("file", payload['fileInput']);

            // this.bscElectronicEquipmentService.create(bscFormData).subscribe({
            //     next: (response: IOneResponseDto<IBscElectronicEquipmentsCover>) => {
            //         this.bscElectronicEquipments = response.data.entity;
            //         this.ref.close(this.bscElectronicEquipments);
            //     },
            //     error: error => {
            //         console.log(error);
            //     }
            // });

            if (this.bscElectronicEquipments?._id) {
                const payload = { ...this.electronicEquipmentsForm.value };
                //payload.total = this.totalPremium;
                // payload.clientLocationId = this.bscElectronicEquipments.clientLocationId;
                // payload.quoteId = this.bscElectronicEquipments.quoteId;
                this.bscElectronicEquipmentService.update(this.bscElectronicEquipments._id, bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscElectronicEquipmentsCover>) => {
                        this.bscElectronicEquipments = response.data.entity;
                        this.ref.close(this.bscElectronicEquipments);
                    },
                    error: error => {
                        console.log(error);
                    }
                });

            } else {
                const payload = { ...this.electronicEquipmentsForm.value };
                //payload.total = this.totalPremium;
                // payload['clientLocationId'] = this.config.data.clientLocationId;
                payload['quoteLocationOccupancyId'] = this.config.data.quoteLocationOccupancyId;
                payload['quoteId'] = this.config.data.quoteId;
                payload['quoteOptionId'] = this.config.data.quoteOption._id;                                 // New_Quote_option
                this.bscElectronicEquipmentService.create(bscFormData).subscribe({
                    next: (response: IOneResponseDto<IBscElectronicEquipmentsCover>) => {
                        this.bscElectronicEquipments = response.data.entity;
                        this.ref.close(this.bscElectronicEquipments);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

    downloadFile() {
        this.bscCoverService.downloadExcel(this.bscElectronicEquipments?.filePath).subscribe(res => {

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

    cancel() {
        this.ref.close();
    }

    isFile(val): boolean {
        console.log(typeof val);
        return typeof val === 'object';
    }

    onBasicUpload(e) {
        this.electronicEquipmentsForm.value.fileInput = e.currentFiles[0]
    }

    deletefile(e) {

        if (this.bscElectronicEquipments._id) {
            let payload = {}
            payload['filePath'] = this.bscElectronicEquipments.filePath
            payload['_id'] = this.bscElectronicEquipments._id
            this.bscElectronicEquipmentService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscElectronicEquipments)
                }
            })
        }
    }
}
