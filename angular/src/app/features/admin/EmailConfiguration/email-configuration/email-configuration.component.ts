import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { EmailConfigurationService } from '../email-configuration.service';
import { ConfirmationService, LazyLoadEvent, MessageService, ConfirmEventType } from 'primeng/api';
import { EmailTemplate } from '../emailtemplate.model';
import { Table } from "primeng/table";

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent implements OnInit, OnDestroy {

  recordSingularName = "Email Configuration";
  recordPluralName = "Email Configurations";

  emailConfiguration: EmailTemplate[]

  modulePath: string = "/backend/admin/email-configuration";

  selectedRecord: any = null;
  /** Represents the user records being deleted. */

  selectAll: boolean = false;

  selectedRecords: EmailTemplate[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  filterData:any;

  constructor(private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private emailConfigurationService: EmailConfigurationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
  }

  ngOnInit(): void {
    this.filterData = this.emailConfigurationService.getFilterData();
  }

  createRecord() {
    this.router.navigateByUrl(`${this.modulePath}/new`);
  }

  editRecord(emailConfigurationId) {
    this.router.navigateByUrl(`${this.modulePath}/${emailConfigurationId._id}`);
  }


  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.emailConfigurationService.getFilterValueExist();
    if(filterValue && !!this.filterData){
      event = this.filterData;
    }
    this.loading = true;
    this.emailConfigurationService.getMany(event).subscribe({
      next: emailTemplates => {
        console.log(emailTemplates)
        this.filterData = null;
        this.emailConfigurationService.setFilterData(event);
        this.emailConfiguration = emailTemplates.data.entities
        this.totalRecords = emailTemplates.results;
        this.loading = false;
        for (let i = 0; i < this.emailConfiguration.length; i++) {
          // @ts-ignore
          this.emailConfiguration[i].body = this.emailConfiguration[i].body.replaceAll("&lt;", "<")
        }
      },
      error: e => {
        console.log(e);
      }
    })
  }

  clear(table: Table) {
    this.emailConfigurationService.setFilterData(undefined);
    this.filterData = null;
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedRecords = value;
  }

  onSelectAllChange(event) {
    const checked = event.checked;

    if (checked) {
      this.selectedRecords = [...this.emailConfiguration];
      this.selectAll = true;
    } else {
      this.selectedRecords = [];
      this.selectAll = false;
    }
  }


  openDeleteRecordConfirmationDialog(selectedRecord) {
    this.deleteRecordDialog = true;
    this.selectedRecord = { ...selectedRecord };
  }


  openDeleteSelectedRecordsConfirmationDialog() {
    this.deleteSelectedRecordsDialog = true;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete record/s?',
      
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        if (this.selectedRecords.length == 1) {
          this.deleteRecord()
        }
        if (this.selectedRecords.length > 1) {
          this.deleteSelectedRecords()
        }
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.selectAll = false;
            this.selectedRecords = null;
            // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.selectAll = false;
            this.selectedRecords = null;
            // this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  deleteRecord() {
    this.deleteRecordDialog = false;
    console.log(this.selectedRecords)

    this.emailConfigurationService.delete(this.selectedRecords[0]._id).subscribe({
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

    this.selectedRecords = null;
    this.selectAll = false;
  }

  deleteSelectedRecords() {
    this.deleteSelectedRecordsDialog = false;

    const userIds = this.selectedRecords.map(selectedUser => {
      return selectedUser._id;
    });
    this.emailConfigurationService.deleteMany(userIds).subscribe({
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
    this.selectAll = false;
  }
  ngOnDestroy(){
    this.emailConfigurationService.setFilterValueExist(null);
  }
}
