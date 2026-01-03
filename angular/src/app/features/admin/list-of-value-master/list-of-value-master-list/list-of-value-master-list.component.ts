import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ILov } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { QuoteService } from '../../quote/quote.service';
import { IListOfValueMaster } from '../list-of-value-master.model';
import { ListOfValueMasterService } from '../list-of-value-master.service';

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-list-of-value-master-list',
  templateUrl: './list-of-value-master-list.component.html',
  styleUrls: ['./list-of-value-master-list.component.scss']
})
export class ListOfValueMasterListComponent implements OnInit {
  cols: any[];

  recordSingularName = "List of Value";
  recordPluralName = "List of Values";
  modulePath: string = "/backend/admin/list-of-value-master";
  /** Represents the data being displayed currently */
  records: IListOfValueMaster[];
  /** Represents the user record being deleted. */
  selectedRecord: IListOfValueMaster | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IListOfValueMaster[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  optionsProductId: any [];
  selectedProductId: any[];
  optionsParentLovId: any [];
  selectedParentLovId: any[];
  selectedPartners:any[];
optionsPartners:any[];

  constructor(private router: Router, private messageService: MessageService, private recordService: ListOfValueMasterService, private breadcrumbService: AppBreadcrumbService, private quoteServeice : QuoteService, private productService:ProductService, private partnerService: PartnerService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
  }

  ngOnInit(): void {
    this.cols = [
      /* { field: "_id", header: "Id" },
      { field: "signageType", header: "Signage Type" },
      { field: "signageDescription", header: "Signage Description" },
      { field: "sumInsured", header: "Sum Insured" },
      { field: "total", header: "Total" },
      { field: "clientLocationId", header: "Client Location" },
      { field: "quoteId", header: "Quote" }
 */    ];
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
  getOptionsProductId(e) {
        this.productService.getManyAsLovs(e.query).subscribe({
          next: data => {
              console.log('***',data.data.entities);
              if(e.query){
                  this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
                  .map(entity => ({ label: entity.type, value: entity._id}));
                }else{
                    this.optionsProductId = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
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

      getOptionsParentLovId(e) {
        this.recordService.getManyAsLovs(e.query).subscribe({
          next: data => {
              console.log('***',data.data.entities.filter(entity => entity.lovType.toLowerCase().includes(e.query.toLowerCase())));
              if(e.query){
                  //   this.optionsClientGroups = data.data.entities.filter(entity => entity.)
                  this.optionsParentLovId = data.data.entities.filter(entity => entity.lovType.toLowerCase().includes(e.query.toLowerCase()))
                  .map(entity => ({ label: entity.lovType, value: entity._id}));
                }else{
                    this.optionsParentLovId = data.data.entities.map(entity => ({ label: entity.lovType, value: entity._id }));
                }
          },
          error: e => { }
        });
      }
      ParentLovIdHandleFilter(e) {
          let parentLovId = this.selectedParentLovId?.map(item => {
              let obj = {
                  "value":null,
                  "matchMode": "equals",
                  "operator": "or"
                };
                obj.value = item.value;
                return obj;
            })
            console.log('*********', parentLovId)

            let lazyLoadEvent: LazyLoadEvent = {
                first: 0,
                rows: 20,
                sortField: null,
                sortOrder: 1,
                filters: {
                    // @ts-ignore
                    "parentLovId": parentLovId
                },
                globalFilter: null,
                multiSortMeta: null
            }
            this.loadRecords(lazyLoadEvent);
      }

      getOptionsPartnerId(e) {
        this.partnerService.getManyAsLovs(e.query).subscribe({
             next: data => {
                 if(e.query){
                     this.optionsPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
                     .map(entity => ({ label: entity.name, value: entity._id}));
                   }else{
                       this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                   }
             },
             error: e => { }
           });
         }
         partnerIdHandleFilter(e) {
             let partnerId = this.selectedPartners?.map(item => {
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
                       "partnerId": partnerId
                   },
                   globalFilter: null,
                   multiSortMeta: null
               }
               this.loadRecords(lazyLoadEvent);
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
