import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { ILov } from "src/app/app.model";
import { IPincode, OPTIONS_EARTHQUAKE_ZONES } from "../pincode.model";
import { PincodeService } from "../pincode.service";

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: "app-pincode-list",
  templateUrl: "./pincode-list.component.html",
  styleUrls: ["./pincode-list.component.scss"]
})
export class PincodeListComponent implements OnInit,OnDestroy {
  cols: any[];

  recordSingularName = "Pincode";
  recordPluralName = "Pincodes";
  modulePath: string = "/backend/admin/pincodes";
  /** Represents the data being displayed currently */
  records: IPincode[];
  /** Represents the user record being deleted. */
  selectedRecord: IPincode | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IPincode[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  optionsEarthquakeZones: ILov[] = [];


  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  filterData:any;

  constructor(private router: Router, private messageService: MessageService, private recordService: PincodeService, private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);

    this.optionsEarthquakeZones = OPTIONS_EARTHQUAKE_ZONES;

  }

  ngOnInit(): void {
    this.cols = [
      { field: "_id", header: "Id" },
      { field: "name", header: "Name" },
      { field: "districtId", header: "District" },
      { field: "cityId", header: "City" },
      { field: "stateId", header: "State" },
      { field: "countryId", header: "Country" },
      { field: "earthquakeZone", header: "Earthquake Zone" }
    ];
    this.filterData = this.recordService.getFilterData();
  }

  loadRecords(event: LazyLoadEvent) {
    let filterValue = this.recordService.getFilterValueExist();
    console.log("loadUsers:");
    console.log(event);
    if(filterValue && !!this.filterData){
      event = this.filterData;
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
  ngOnDestroy(){
    this.recordService.setFilterValueExist(null);
  }
}
