import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IEmpRates } from '../emprates.model';
import { EmpRatesService } from '../emprates.service';
import { ProductService } from 'src/app/features/service/productservice';
import { DialogService } from 'primeng/dynamicdialog';
import { EMPRatesDetailsDialogComponent } from '../../emp-rates-details-dialog/emp-rates-details-dialog.component';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 20,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-emprates-list',
  templateUrl: './emprates-list.component.html',
  styleUrls: ['./emprates-list.component.scss']
})
export class EmpRatesListComponent implements OnInit {

  cols: any[];

  recordSingularName = "Employees Rate Template";
  recordPluralName = "Employees Rate Templates";
  modulePath: string = "/backend/admin/emprates";
  /** Represents the data being displayed currently */
  records: IEmpRates[];
  /** Represents the SI record being deleted. */
  selectedRecord: IEmpRates | null = null;
  /** Represents the SI records being deleted. */
  selectedRecords: IEmpRates[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  optionsProductId: any [];
  selectedProductId: any[];
  constructor(
    private router: Router, 
    private messageService: MessageService,  
    private empRatesService: EmpRatesService,
    private breadcrumbService: AppBreadcrumbService, private productService:ProductService,  private dialogService: DialogService
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
  }

  loadRecords(event: LazyLoadEvent) {

    console.log(event);

    this.loading = true;
    this.empRatesService.getMany(event).subscribe({
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

  // editRecord(record) {
  //   this.router.navigateByUrl(`${this.modulePath}/${record._id}`);
  // }

  viewRecord(record) {
    const ref = this.dialogService.open(EMPRatesDetailsDialogComponent, {
      header: "Details of Employees Rates",
      data: {
          emprates: record,
      },
      width: "50vw",
      styleClass: "customPopup"
  }).onClose.subscribe(() => {
  })
  }

  

  openDeleteRecordConfirmationDialog(selectedRecord) {
    this.deleteRecordDialog = true;
    this.selectedRecord = { ...selectedRecord };
  }

  deleteRecord() {
    this.deleteRecordDialog = false;

    this.empRatesService.delete(this.selectedRecord._id).subscribe({
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
    this.empRatesService.deleteMany(productIds).subscribe({
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

  getOptionsProductId(e) {
    this.productService.getManyAsLovs(e.query).subscribe({
      next: data => {
          if(e.query){
              this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
              .map(entity => ({ label: entity.type, value: entity._id}));
              this.optionsProductId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
            }else{
                this.optionsProductId = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
                this.optionsProductId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
            }
      },
      error: e => { }
    });
  }
  handleFilter(e) {
      let productId = this.selectedProductId?.map(item => {
          let obj = {
              "value":null,
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
        this.loadRecords(lazyLoadEvent);
  }

}
