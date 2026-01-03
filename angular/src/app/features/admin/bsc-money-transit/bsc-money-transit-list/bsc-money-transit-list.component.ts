import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IBscMoneyTransitCover } from '../bsc-money-transit.model';
import { BscMoneyTransitService } from '../bsc-money-transit.service';

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-bsc-money-transit-list',
  templateUrl: './bsc-money-transit-list.component.html',
  styleUrls: ['./bsc-money-transit-list.component.scss']
})
export class BscMoneyTransitListComponent implements OnInit {

  cols: any[];

  recordSingularName = "BSC Money Transit";
  recordPluralName = "BSC Money Transits";
  modulePath: string = "/backend/admin/bsc-money-transits";

  /** Represents the data being displayed currently */
  records: IBscMoneyTransitCover[];
  /** Represents the user record being deleted. */
  selectedRecord: IBscMoneyTransitCover | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IBscMoneyTransitCover[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  constructor(private router: Router, private messageService: MessageService, private recordService: BscMoneyTransitService, private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([{ label: "Pages" }, { label: this.recordPluralName, routerLink: [`${this.modulePath}`] }]);
  }

  ngOnInit(): void {
    this.cols = [
      { field: "_id", header: "Id" },

      { field: "transitFrom", header: "Transit From" },
      { field: "transitTo", header: "Transit To" },
      { field: "singleCarryingLimit", header: "Single Carrying Limit" },
      { field: "annualTurnover", header: "Annual Turnover" },
      { field: "total", header: "Total" },
    //   { field: "clientLocationId", header: "Client Location" },
      { field: "quoteId", header: "Quote" }
      // { field: "state", header: "State" },
    ];
  }

  loadRecords(event: LazyLoadEvent) {
    console.log("loadUsers:");
    console.log(event);

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

}
