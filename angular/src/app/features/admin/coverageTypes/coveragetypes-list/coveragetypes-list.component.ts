import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ICoverageType } from '../coveragetypes.model';
import { CoverageTypesService } from '../coveragetypes.service';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-coveragetypes-list',
  templateUrl: './coveragetypes-list.component.html',
  styleUrls: ['./coveragetypes-list.component.scss']
})
export class CoverageTypesListComponent implements OnInit {

  cols: any[];

  recordSingularName = "Coverage Type";
  recordPluralName = "Coverage Types";
  modulePath: string = "/backend/admin/coveragetypes";
  /** Represents the data being displayed currently */
  records: ICoverageType[];
  /** Represents the SI record being deleted. */
  selectedRecord: ICoverageType | null = null;
  /** Represents the SI records being deleted. */
  selectedRecords: ICoverageType[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  filterData:any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private coverageTypesService: CoverageTypesService,
    private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
  }

  ngOnInit(): void {
    this.filterData = this.coverageTypesService.getFilterData();
  }

  loadRecords(event: LazyLoadEvent) {

    console.log(event);
    let filters = Object.keys(event.filters);
    let filtermetadata = {}
    // @ts-ignore
    let statusValue = event.filters['status']?.map(item => item.value);


    filters.map(item => {
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
    })

    if (statusValue && statusValue.length > 0) {
      filtermetadata['status'] = [{
        value: statusValue[0],
        matchMode: "equals",
        operator: "and"
      }]
    }
    event.filters = { ...filtermetadata }
    if(!!this.filterData && Object.keys(this.filterData?.filters).length){
      event = {...this.filterData};
    }

    this.loading = true;
    this.coverageTypesService.getMany(event).subscribe({
      next: records => {
        console.log(records);
        this.filterData = null;
        this.coverageTypesService.setFilterData(event);


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

    this.coverageTypesService.delete(this.selectedRecord._id).subscribe({
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

    const productIds = this.selectedRecords.map(selectedProduct => {
      return selectedProduct._id;
    });
    this.coverageTypesService.deleteMany(productIds).subscribe({
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
    this.coverageTypesService.setFilterData(undefined);
    this.filterData = null;
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }

  hideDialog() {
    console.log("hideDialog");
  }

}
