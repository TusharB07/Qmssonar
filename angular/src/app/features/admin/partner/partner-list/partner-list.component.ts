import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { IPartner, OPTIONS_PARTNER_TYPES } from "../partner.model";
import { PartnerService } from "../partner.service";
import { AppService } from "src/app/app.service";

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};

@Component({
    selector: "app-partner-list",
    templateUrl: "./partner-list.component.html",
    styleUrls: ["./partner-list.component.scss"]
})
export class PartnerListComponent implements OnInit,OnDestroy {
    optionsPartnerTypes: ILov[] = [];
    deletePartnerDialog: boolean = false;
    deletePartnersDialog: boolean = false;
    cols: any[];

    recordSingularName = "Partner";
    recordPluralName = "Partners";
    modulePath: string = "/backend/admin/partners";
    /** Represents the data being displayed currently */
    records: IPartner[];
    /** Represents the user record being deleted. */
    selectedRecord: IPartner | null = null;
    /** Represents the user records being deleted. */
    selectedRecords: IPartner[] = [];

    /** Dialog to show when attempting to delete one record */
    deleteRecordDialog: boolean = false;
    /** Dialog to show when attempting to delete more than one record */
    deleteSelectedRecordsDialog: boolean = false;

    totalRecords: number;
    loading: boolean;
    selectAll: boolean = false;
    filterData:any;

    constructor(private appService: AppService, private router: Router, private messageService: MessageService, private recordService: PartnerService, private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: "Pages" },
            {
                label: this.recordPluralName,
                routerLink: [`${this.modulePath}`]
            }
        ]);
    }

    ngOnInit(): void {
        this.cols = [
            { field: "_id", header: "Id" },
            { field: "name", header: "Name" },
            { field: "shortName", header: "Short Name" },
            { field: "address", header: "Address" },
            { field: "cityName", header: "City Name" },
            { field: "districtName", header: "District Name" },
            { field: "stateId", header: "State Name" },
            { field: "pincode", header: "Pincode" },
            { field: "countryName", header: "Country Name" },

            { field: "pan", header: "Pan" },
            { field: "gstin", header: "GST Number" },
            { field: "cin", header: "CIN" }
        ];

        this.optionsPartnerTypes = OPTIONS_PARTNER_TYPES;
        this.filterData = this.recordService.getFilterData();
    }

    loadRecords(event: LazyLoadEvent) {
        let filterValue = this.recordService.getFilterValueExist();
        let filters = Object.keys(event.filters);
        let filtermetadata = {}
        // @ts-ignore
        let statusValue = event.filters['status']?.map(item => item.value);

        filters.map(item => {
            if (item != 'name' && item != 'mobileNumber' && item != 'contactPerson') {
                let values = [];
                // @ts-ignore
                event.filters[item].forEach(element => {

                    if (element.value != null && typeof element.value != 'boolean') {
                        values = [...values, ...element.value.split(',').map(data => { return { value: data } })];
                    }
                });
                filtermetadata[item] = [{
                    value: values.length > 0 ? values : null,
                    matchMode: "in",
                    operator: "and"
                }]
            }
            else {
                filtermetadata[item] = event.filters[item]
            }
        })

        if (statusValue && statusValue.length > 0) {
            // @ts-ignore
            filtermetadata['status'] = [{
                value: statusValue[0],
                matchMode: "equals",
                operator: "and"
            }]
        }


        event.filters = { ...filtermetadata }

        
        if(filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length){
          event = {...this.filterData};
        }
        this.loading = true;
        this.recordService.getMany(event).subscribe({
            next: records => {
                console.log(records);

                this.filterData = null;
                this.recordService.setFilterData(event);
                this.records = records.data.entities;
                this.totalRecords = records.results;
                this.loading = false;
            },
            error: e => {
                console.log(e);
            }
        });
    }

    createRecord() {
        this.router.navigateByUrl(`${this.modulePath}/new`);
    }

    editRecord(record) {
        this.router.navigateByUrl(`${this.modulePath}/${record._id}`);
    }

    copyRates(partner, of) {
        // this.router.navigateByUrl(`${this.modulePath}/${partner._id}`);
        this.recordService.copyRates({
            partnerId: partner._id,
        }, of).subscribe({
            next: (dto) => {
                console.log(dto)
            }
        })
    }

    openDeleteRecordConfirmationDialog(selectedRecord) {
        this.deleteRecordDialog = true;
        this.selectedRecord = { ...selectedRecord };
    }

    deleteRecord() {
        this.deleteRecordDialog = false;

        this.recordService.delete(this.selectedRecord._id).subscribe({
            next: res => {
                this.loadRecords(DEFAULT_RECORD_FILTER);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `${this.recordSingularName} Deleted`,
                    life: 3000
                });
                // call the api to fetch the data form user tabel after delete
            },
            error: e => {
                console.log(e.error.message);
                this.messageService.add({
                    severity: "fail",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000
                });
            }
        });

        this.selectedRecord = null;
    }

    openDeleteSelectedRecordsConfirmationDialog() {
        this.deleteSelectedRecordsDialog = true;
    }

    deleteSelectedRecords() {
        this.deleteSelectedRecordsDialog = false;

        const userIds = this.selectedRecords.map(selectedUser => {
            return selectedUser._id;
        });
        this.recordService.deleteMany(userIds).subscribe({
            next: v => {
                this.loadRecords(DEFAULT_RECORD_FILTER);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `${this.recordPluralName} Deleted`,
                    life: 3000
                });
            },
            error: e => {
                // console.log(e);
                this.messageService.add({
                    severity: "error",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000
                });
            }
        });

        this.selectedRecords = null;
    }

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.totalRecords;
        this.selectedRecords = value;
    }

    onSelectAllChange(event) {
        const checked = event.checked;

        if (checked) {
            this.selectedRecords = [...this.records];
            this.selectAll = true;
        } else {
            this.selectedRecords = [];
            this.selectAll = false;
        }
    }

    clear(table: Table) {
        this.recordService.setFilterData(undefined);
        this.filterData = null;
        this.selectedRecords = [];
        this.selectAll = false;
        table.clear();
    }

    hideDialog() {
        console.log("hideDialog");
    }

    bulkImportGenerateSample() {
        this.recordService.bulkImportGenerateSample().subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                console.log(dto)
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    get uploadProps(): PFileUploadGetterProps {
        return this.recordService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)
            if (dto.status == 'success') {
                window.location.reload()
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

 
  bulkproductImportGenerateSample() {
    this.recordService.bulkImportGenerateSample().subscribe({
        next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)
            if (dto.status == 'success') {
                // Download the sample file
                this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

            }
        }
    })
}


get productuploadProps(): PFileUploadGetterProps {
        return this.recordService.getBulkproductImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)
            if (dto.status == 'success') {
                window.location.reload()
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

    ngOnDestroy(){
        this.recordService.setFilterValueExist(null);
    }
}
