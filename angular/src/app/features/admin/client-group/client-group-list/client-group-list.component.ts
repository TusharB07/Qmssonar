import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOneResponseDto, IBulkImportResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IClientGroup } from '../client-group.model';
import { ClientGroupService } from '../client-group.service';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};

@Component({
    selector: 'app-client-group-list',
    templateUrl: './client-group-list.component.html',
    styleUrls: ['./client-group-list.component.scss']
})
export class ClientGroupListComponent implements OnInit {

    cols: any[];

    recordSingularName = "Client Group";
    recordPluralName = "Client Groups";
    modulePath: string = "/backend/admin/client-groups";
    /** Represents the data being displayed currently */
    records: IClientGroup[];
    /** Represents the user record being deleted. */
    selectedRecord: IClientGroup | null = null;
    /** Represents the user records being deleted. */
    selectedRecords: IClientGroup[] = [];

    /** Dialog to show when attempting to delete one record */
    deleteRecordDialog: boolean = false;
    /** Dialog to show when attempting to delete more than one record */
    deleteSelectedRecordsDialog: boolean = false;

    totalRecords: number;
    loading: boolean;
    selectAll: boolean = false;

    constructor(private appService: AppService, private router: Router, private messageService: MessageService, private recordService: ClientGroupService, private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([{ label: "Pages" }, { label: this.recordPluralName, routerLink: [`${this.modulePath}`] }]);
    }

    ngOnInit(): void {
        this.cols = [
            { field: "vin", header: "Vin No." },
            { field: "clientGroupName", header: "Client Group Name" },
            { field: "clientGroupContactName", header: "Client Group Contact Name" },
            { field: "address", header: "Address" },
            { field: "cityName", header: "City" },
            { field: "pincode", header: "Pincode" },
            { field: "email", header: "Email" },
            { field: "active", header: "Active" },
        ];
    }

    loadRecords(event: LazyLoadEvent) {
        let filters = Object.keys(event.filters);
        let filtermetadata = {}
        // @ts-ignore
        let statusValue = event.filters['active']?.map(item => item.value);

        filters.map(item => {
            if (item != 'address' && item != 'clientGroupName' && item != 'clientGroupContactName') {
                let values = [];
                // @ts-ignore
                event.filters[item].forEach(element => {

                    if (element.value != null) {
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
            filtermetadata['active'] = [{
                value: statusValue[0],
                matchMode: "equals",
                operator: "and"
            }]
        }

        event.filters = { ...filtermetadata }

        this.loading = true;
        this.recordService.getMany(event).subscribe({
            next: records => {
                console.log(records);

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

}
