import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { ClientGroupService } from '../../client-group/client-group.service';
import { IClient } from '../client.model';
import { ClientService } from '../client.service';
import { AppService } from 'src/app/app.service';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {},
};

@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

    cols: any[];

    recordSingularName = 'Client';
    recordPluralName = 'Clients';
    modulePath: string = '/backend/admin/clients';
    /** Represents the data being displayed currently */
    records: IClient[];
    /** Represents the user record being deleted. */
    selectedRecord: IClient | null = null;
    /** Represents the user records being deleted. */
    selectedRecords: IClient[] = [];

    /** Dialog to show when attempting to delete one record */
    deleteRecordDialog: boolean = false;
    /** Dialog to show when attempting to delete more than one record */
    deleteSelectedRecordsDialog: boolean = false;

    totalRecords: number;
    loading: boolean;
    selectAll: boolean = false;

    optionsClientGroups: ILov[] = [];
    selectedClientGroups: any[];
    commonFilters = {};
    specialFilters = {};

    constructor(
        private appService: AppService,
        private router: Router,
        private messageService: MessageService,
        private recordService: ClientService,
        private breadcrumbService: AppBreadcrumbService,
        private clientGroupService: ClientGroupService
    ) {
        this.breadcrumbService.setItems([
            { label: "Pages" },
            { label: this.recordPluralName, routerLink: [`${this.modulePath}`] },
        ]);

    }

    ngOnInit(): void {
        this.cols = [
            { field: "_id", header: "Id" },
            { field: "clientType", header: "Client Type" },
            { field: "name", header: "Name" },
            { field: "shortName", header: "Short Name" },
            { field: "active", header: "Status" },
            { field: "clientGroupId", header: "Client Group" },
            { field: "pan", header: "Pan No." },
            { field: "copyOfPan", header: "Copy Of Pan" },
            { field: "vin", header: "Vin no." },
            { field: "leadGenerator", header: "Lead Generator" },
            { field: "natureOfBusiness", header: "Nature Of Business" },
            { field: "creationDate", header: "Creation Date" },
            { field: "claimsManager", header: "Claims Manager" },
            { field: "referralRM", header: "Referral RM" },
            { field: "referredCompany", header: "Referred Company" },
            { field: "employeeStrength", header: "Employee Strength" },
            { field: "sameAddressVerification", header: "sameAddressVerification" },
            //   { field: "contactPerson", header: "Contact Person" },
            //   { field: "designation", header: "Designation" },
            //   { field: "phone", header: "Phone" },
            //   { field: "email", header: "Email" },
            //   { field: "mobile", header: "Mobile" },
            //   { field: "address", header: "Address" },
            //   { field: "stateId", header: "State" },
            //   { field: "cityId", header: "City" },
            //   { field: "pincodeId", header: "Pincode" },
            { field: "visitingCard", header: "Visiting Card" },
            { field: "narration", header: "Narration" },
            { field: "clientKycMasterId", header: "Client KYC" },
        ];

    }


    loadRecords(event: LazyLoadEvent, name?: string) {
        if (name) {
            let filtermetadata = {}
            let values = [];

            // @ts-ignore
            event.filters[name].forEach(element => {
                if (element.value != null) {
                    values = [...values, ...element.value.split(',').map(data => { return { value: data } })];
                }
            });

            filtermetadata[name] = [{
                value: values.length > 0 ? values : null,
                matchMode: "in",
                operator: "and"
            }]
            event.filters = { ...this.commonFilters, ...this.specialFilters, ...filtermetadata }
            this.specialFilters = { ...this.specialFilters, ...filtermetadata }
        }
        else {
            let filters = Object.keys(event.filters);
            let filtermetadata = {}
            // @ts-ignore
            let statusValue = event.filters['active']?.map(item => item.value);
            // @ts-ignore
            let dateValue = event.filters['creationDate']?.map(item => item.value);
            console.log(dateValue);


            filters.map(item => {
                if (item != 'name' && item != 'leadGenerator' && item != 'claimsManager' && item != 'creationDate') {
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
            if (dateValue && dateValue.length > 0) {
                filtermetadata['creationDate'] = [{
                    value: dateValue[0],
                    matchMode: "dateIs",
                    operator: "and"
                }]
            }

            event.filters = { ...filtermetadata, ...this.specialFilters }
            this.commonFilters = { ...this.commonFilters, ...filtermetadata }
        }

        this.loading = true;
        this.recordService.getMany(event).subscribe({
            next: (records) => {
                console.log(records);

                this.records = records.data.entities;
                this.totalRecords = records.results;
                this.loading = false;
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getOptionsClientGroup(e) {

        /*      let lazyLoadEvent: LazyLoadEvent = {
              first: 0,
              rows: 20,
              sortField: null,
              sortOrder: 1,
              filters: {
                // @ts-ignore
                clientGroupId: [
                  {
                    value: e.query,
                    matchMode: "in",
                    operator: "and"
                  }
                ],
                // @ts-ignore
                name: [
                  {
                    value: null,
                    matchMode: "in",
                    operator: "and"
                  }
                ]
              },
              globalFilter: null,
              multiSortMeta: null
            }
             */

        this.clientGroupService.getManyAsLovs(e.query).subscribe({
            next: data => {
                console.log(data.data.entities);
                if (e.query) {
                    this.optionsClientGroups = data.data.entities.filter(entity => entity.clientGroupName.toLowerCase().includes(e.query.toLowerCase()))
                        .map(entity => ({ label: entity.clientGroupName, value: entity._id }));
                } else {
                    this.optionsClientGroups = data.data.entities.map(entity => ({ label: entity.clientGroupName, value: entity._id }));
                }
            },
            error: e => { }
        });
    }

    handleFilter(e) {
        let clientGroupId = this.selectedClientGroups.map(item => {
            let obj = {
                "value": null,
                "matchMode": "equals",
                "operator": "or"
            };
            obj.value = item.value;
            return obj;
        })

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                "clientGroupId": clientGroupId
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.loadRecords(lazyLoadEvent, 'clientGroupId');

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
            next: (res) => {
                this.loadRecords(DEFAULT_RECORD_FILTER);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `${this.recordSingularName} Deleted`,
                    life: 3000,
                });
                // call the api to fetch the data form user tabel after delete
            },
            error: (e) => {
                console.log(e.error.message);
                this.messageService.add({
                    severity: "fail",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000,
                });
            },
        });

        this.selectedRecord = null;
    }

    openDeleteSelectedRecordsConfirmationDialog() {
        this.deleteSelectedRecordsDialog = true;
    }

    deleteSelectedRecords() {
        this.deleteSelectedRecordsDialog = false;

        const userIds = this.selectedRecords.map((selectedUser) => {
            return selectedUser._id;
        });
        this.recordService.deleteMany(userIds).subscribe({
            next: (v) => {
                this.loadRecords(DEFAULT_RECORD_FILTER);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `${this.recordPluralName} Deleted`,
                    life: 3000,
                });
            },
            error: (e) => {
                // console.log(e);
                this.messageService.add({
                    severity: "error",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000,
                });
            },
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
