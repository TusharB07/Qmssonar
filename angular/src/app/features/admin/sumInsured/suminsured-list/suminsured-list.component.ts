import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ISumInsured } from '../suminsured.model';
import { SumInsuredService } from '../suminsured.service';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-suminsured-list',
  templateUrl: './suminsured-list.component.html',
  styleUrls: ['./suminsured-list.component.scss']
})
export class SumInsuredListComponent implements OnInit {

  cols: any[];

  recordSingularName = "Sum Insured";
  recordPluralName = "Sum Insured";
  modulePath: string = "/backend/admin/suminsured";
  /** Represents the data being displayed currently */
  records: ISumInsured[];
  /** Represents the SI record being deleted. */
  selectedRecord: ISumInsured | null = null;
  /** Represents the SI records being deleted. */
  selectedRecords: ISumInsured[] = [];

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
    private sumInsuredService: SumInsuredService,
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
    this.filterData = this.sumInsuredService.getFilterData();
  }

  loadRecords(event: LazyLoadEvent) {

    console.log(event);
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

    event.filters = { ...filtermetadata }
    if(!!this.filterData){
      event = this.filterData;
    }

    this.loading = true;
    this.sumInsuredService.getMany(event).subscribe({
      next: records => {
        console.log(records);
        this.filterData = null;
        this.sumInsuredService.setFilterData(event);

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

    this.sumInsuredService.delete(this.selectedRecord._id).subscribe({
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
    this.sumInsuredService.deleteMany(productIds).subscribe({
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
    this.sumInsuredService.setFilterData(undefined);
    this.filterData = null;
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }

  hideDialog() {
    console.log("hideDialog");
  }

}
