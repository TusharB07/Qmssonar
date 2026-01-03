import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';


const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
  };


@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {

    cols: any[];

  recordSingularName = "Quote";
  recordPluralName = "Quotes";
  modulePath: string = "/backend/admin/quote";

  /** Represents the data being displayed currently */
  records: IQuoteSlip[];
  /** Represents the user record being deleted. */
  selectedRecord: IQuoteSlip | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IQuoteSlip[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  constructor(private router: Router, private messageService: MessageService, private recordService: QuoteService, private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([{ label: "Pages" }, { label: this.recordPluralName, routerLink: [`${this.modulePath}`] }]);
  }

  ngOnInit(): void {
    this.cols = [
      { field: "_id", header: "Id" },
      { field: "quoteNo", header: "Quote No" },
      { field: "quoteType", header: "Quote Type" },
      { field: "renewalPolicyPeriod", header: "Renewal Policy Period" },
      { field: "insurredBusiness", header: "Insurred Business" },
      { field: "status", header: "Status" },
      { field: "deductiblesExcess", header: "Deductibles Excess" },
      { field: "existingBrokerCurrentYear", header: "Existing Broker Current Year" },
      { field: "otherTerms", header: "Other Terms" },
      { field: "additionalInfo", header: "Additional Info" },
      { field: "claim1NoOfClaims", header: "Claim 1 No Of Claims" },
      { field: "claim1Nature", header: "Claim 1 Nature" },
      { field: "approvedBy", header: "ApprovedBy" },
      { field: "approvedOn", header: "ApprovedOn" },
      { field: "createdBy", header: "Created By" },
      { field: "createdOn", header: "Created On" },
      { field: "clientAddress", header: "Client Address" },
      { field: "totalIndictiveQuoteAmt", header: "Total Indictive Quote Amount" },
      { field: "brokerages", header: "Brokerages" },
      { field: "targetPremium", header: "Target Premium" },
      { field: "claimYear1", header: "Claim Year 1" },
      { field: "claimToYear1", header: "Claim To Year 1" },
      { field: "claim1PremiumPaid", header: "Claim 1 Premium Paid" },
      { field: "claim1ClaimAmount", header: "Claim 1 Claim Amount" },
      { field: "revNo", header: "Rev No" },
      { field: "sameAsPremium", header: "Same As Premium" },
      { field: "quoteSubmissionDate", header: "Quote Submission Date" },
      { field: "sectorId", header: "Sector" },
      { field: "clientId", header: "Client" },
      { field: "productId", header: "Product" },
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
