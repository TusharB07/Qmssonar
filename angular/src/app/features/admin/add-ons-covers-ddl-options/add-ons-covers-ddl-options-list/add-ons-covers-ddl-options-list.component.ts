import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { IAddOnsCoverOptions } from "../add-ons-covers-ddl-options.model";
import { AddOnCoverOptionsService } from "../add-ons-covers-ddl-options.service";
import { AllowedRoles } from "../../role/role.model";
import { IUser } from "../../user/user.model";
import { DialogService } from "primeng/dynamicdialog";
import { ExportDialogComponent } from "src/app/features/quote/components/quote/export-dialog/export-dialog.component";
import { ImportDialogComponent } from "src/app/features/quote/components/quote/import-dialog/import-dialog.component";
import { AccountService } from "src/app/features/account/account.service";
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: "app-add-ons-covers-ddl-options-list",
  templateUrl: "./add-ons-covers-ddl-options-list.component.html",
  styleUrls: ["./add-ons-covers-ddl-options-list.component.scss"]
})
export class AddOnCoverOptionsListComponent implements OnInit, OnDestroy {
  cols: any[];

  recordSingularName = "Add-Ons Cover Option";
  recordPluralName = "Add-Ons Cover Options";
  modulePath: string = "/backend/admin/add-ons-covers-ddl-options";

  /** Represents the data being displayed currently */
  records: IAddOnsCoverOptions[];
  /** Represents the user record being deleted. */
  selectedRecord: IAddOnsCoverOptions | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IAddOnsCoverOptions[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  filterData: any;
  selectedOption: any
  user: IUser;
  AllowedRoles = AllowedRoles
  action: any[];
  listRoute: string = '';
  constructor(private router: Router, private dialogService: DialogService, private accountService: AccountService,

    private messageService: MessageService, private recordService: AddOnCoverOptionsService, private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
  }

  ngOnInit(): void {
    this.action = [
      { name: 'Import', code: 'IM', rate: 'add_on_options' },
      { name: 'Export', code: 'EX', rate: 'add_on_options' }
    ];

    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
    this.cols = [
      { field: "_id", header: "Id" },
      { field: "optionName", header: "Option Name" }];

    this.filterData = this.recordService.getFilterData();
  }

  selectAction(event) {
    console.log(event.value)
    if (event.value.name == 'Import') {
      const ref = this.dialogService.open(ImportDialogComponent, {
        header: "Import Document",
        styleClass: 'customPopup',
        width: '600px',
        data: { event: event.value, user: this.user }
      })
      ref.onClose.subscribe((data) => {
      });
    } else {
      const ref = this.dialogService.open(ExportDialogComponent, {
        header: "Export Document",
        styleClass: 'customPopup',
        width: '600px',
        height: '50%',
        data: { event: event.value, user: this.user }
      })
      ref.onClose.subscribe((data) => {
      });
    }
    this.selectedOption = null

  }

  loadRecords(event: LazyLoadEvent) {
    let filterValue = this.recordService.getFilterValueExist();
    console.log("loadUsers:");
    console.log(event);

    if (filterValue && !!this.filterData) {
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
  ngOnDestroy() {
    this.recordService.setFilterValueExist(null);
  }
}
