import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOneResponseDto, IBulkImportResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ProductService } from '../../product/product.service';
import { QuoteLocationOccupancyService } from '../../quote-location-occupancy/quote-location-occupancy.service';
import { SectorService } from '../../sector/sector.service';
import { IUnderWriter } from '../under-writer.model';
import { UnderWriterService } from '../under-writer.service';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};

@Component({
    selector: 'app-under-writer-list',
    templateUrl: './under-writer-list.component.html',
    styleUrls: ['./under-writer-list.component.scss']
})
export class UnderWriterListComponent implements OnInit {

    recordSingularName = "Under Writer";
    recordPluralName = "Under Writers";
    modulePath: string = "/backend/admin/under-writer";
    /** Represents the data being displayed currently */
    records: IUnderWriter[];
    /** Represents the user record being deleted. */
    selectedRecord: IUnderWriter | null = null;
    /** Represents the user records being deleted. */
    selectedRecords: IUnderWriter[] = [];

    /** Dialog to show when attempting to delete one record */
    deleteRecordDialog: boolean = false;
    /** Dialog to show when attempting to delete more than one record */
    deleteSelectedRecordsDialog: boolean = false;

    totalRecords: number;
    loading: boolean;
    selectAll: boolean = false;
    col: any[] = [1, 2, 3, 4]
    row: any[] = [1, 2, 3, 4, 5]

    selectedSectorId: any[];
    optionsSectorId: any[];
    selectedOccupancyId: any[];
    optionsOccupancyId: any[];
    selectedProductId: any[];
    optionsProductId: any[];
    commonFilters = {};
    specialFilters = {};


    constructor(private appService: AppService, private router: Router, private messageService: MessageService, private recordService: UnderWriterService, private breadcrumbService: AppBreadcrumbService, private sectorService: SectorService, private occupancyService: QuoteLocationOccupancyService, private productService: ProductService) {
        this.breadcrumbService.setItems([
            { label: "Pages" },
            {
                label: this.recordPluralName,
                routerLink: [`${this.modulePath}`]
            }
        ]);
    }

    ngOnInit(): void {
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

            filters.map(item => {
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
            })

            event.filters = { ...filtermetadata, ...this.specialFilters }
            this.commonFilters = { ...this.commonFilters, ...filtermetadata }
        }
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

    getOptionsSectorId(e) {
        this.sectorService.getManyAsLovs(e.query).subscribe({
            next: data => {
                if (e.query) {
                    this.optionsSectorId = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
                        .map(entity => ({ label: entity.name, value: entity._id }));
                } else {
                    this.optionsSectorId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                }
            },
            error: e => { }
        });
    }
    sectorIdHandleFilter(e) {
        let sectorId = this.selectedSectorId?.map(item => {
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
                "sectorId": sectorId
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.loadRecords(lazyLoadEvent, 'sectorId');
    }

    getOptionsOccupancyId(e) {
        this.occupancyService.getManyAsLovs(e.query).subscribe({
            next: data => {
                if (e.query) {
                    this.optionsOccupancyId = data.data.entities.filter(entity => entity.occupancyId['occupancyType'].toLowerCase().includes(e.query.toLowerCase()))
                        .map(entity => ({ label: entity.occupancyId['occupancyType'], value: entity._id }));
                } else {
                    this.optionsOccupancyId = data.data.entities.map(entity => ({ label: entity.occupancyId['occupancyType'], value: entity._id }));
                }
            },
            error: e => { }
        });
    }
    occupancyIdHandleFilter(e) {
        let occupancyId = this.selectedOccupancyId?.map(item => {
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
                "occupancyId": occupancyId
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.loadRecords(lazyLoadEvent, 'occupancyId');
    }

    getOptionsProductId(e) {
        this.productService.getManyAsLovs(e.query).subscribe({
            next: data => {
                if (e.query) {
                    this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
                        .map(entity => ({ label: entity.type, value: entity._id }));
                } else {
                    this.optionsProductId = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
                }
            },
            error: e => { }
        });
    }
    ProductIdHandleFilter(e) {
        let productId = this.selectedProductId?.map(item => {
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
                "productId": productId
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.loadRecords(lazyLoadEvent, 'productId');
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
