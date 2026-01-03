import { RiskinspectionmasterService } from './../riskinspectionmaster.service';
import { Router } from '@angular/router';
import { IRiskInspectionMasterModel } from './../riskInspectionMaster.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ProductService } from '../../product/product.service';
import { PartnerService } from '../../partner/partner.service';
import { QuoteService } from '../../quote/quote.service';
import { Table } from 'primeng/table';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from '../../user/user.model';
import { DialogService } from "primeng/dynamicdialog";
import { ImportDialogComponent } from 'src/app/features/quote/components/quote/import-dialog/import-dialog.component';
import { ExportDialogComponent } from 'src/app/features/quote/components/quote/export-dialog/export-dialog.component';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-riskinspectionmasterlist',
  templateUrl: './riskinspectionmasterlist.component.html',
  styleUrls: ['./riskinspectionmasterlist.component.scss']
})
export class RiskinspectionmasterlistComponent implements OnInit, OnDestroy {

  cols: any[];

  recordSingularName = "Risk Inspection Master";
  recordPluralName = "Risk Inspection Masters";
  modulePath: string = "/backend/admin/risk-inspection-master";
  /** Represents the data being displayed currently */
  records: IRiskInspectionMasterModel[];
  /** Represents the user record being deleted. */
  selectedRecord: IRiskInspectionMasterModel | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IRiskInspectionMasterModel[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  optionsProductId: any[];
  selectedProductId: any[];
  optionsParentLovId: any[];
  selectedParentLovId: any[];
  selectedPartners: any[];
  optionsPartners: any[];

  specialFilters = {};
  commonFilters = {};

  user :IUser
  filterData:any;
  selectedOption: any
  action: any[];


  constructor(
    private router: Router, 
    private messageService: MessageService, 
    private recordService: RiskinspectionmasterService, 
    private breadcrumbService: AppBreadcrumbService, 
    private quoteServeice : QuoteService, 
    private productService:ProductService, 
    private partnerService: PartnerService,
    private accountService: AccountService,
    private dialogService: DialogService,
    private riskinspectionmasterService : RiskinspectionmasterService) {
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
      { name: 'Import', code: 'IM', rate: 'riskinspection' },
      { name: 'Export', code: 'EX', rate: 'riskinspection' }
    ];
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
    this.cols = [
      /* { field: "_id", header: "Id" },
      { field: "signageType", header: "Signage Type" },
      { field: "signageDescription", header: "Signage Description" },
      { field: "sumInsured", header: "Sum Insured" },
      { field: "total", header: "Total" },
      { field: "clientLocationId", header: "Client Location" },
      { field: "quoteId", header: "Quote" }
 */    ];
    this.filterData = this.recordService.getFilterData();
  }

  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.recordService.getFilterValueExist();
    console.log("loadUsers:");
    console.log(event);

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
        if (item != 'riskTypeOrValue') {
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
        }
        else {
          filtermetadata[item] = event.filters[item]
        }
      })

      event.filters = { ...filtermetadata, ...this.specialFilters }
      this.commonFilters = { ...this.commonFilters, ...filtermetadata }
    }
    if(filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length){
      event = {...this.filterData};
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
  getOptionsProductId(e) {
    this.productService.getManyAsLovs(e.query).subscribe({
      next: data => {
        console.log('***', data.data.entities);
        if (e.query) {
          this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.type, value: entity._id }));
            this.optionsProductId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
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
    this.loadRecords(lazyLoadEvent);
  }

      getOptionsParentLovId(e) {
        this.riskinspectionmasterService.getManyAsLovs(e.query).subscribe({
          next: data => {
            console.log(data.data.entities)
            if (e.query) {
              this.optionsParentLovId = data.data.entities.filter(entity => entity?.parentId?.riskTypeOrValue.toLowerCase().includes(e.query.toLowerCase()) && entity?.isHeadng == false)
                .map(entity => ({ label: entity?.parentId.riskTypeOrValue, value: entity._id }))
                this.optionsParentLovId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
            } else {
              this.optionsParentLovId = data.data.entities.filter(entity => entity?.parentId==null)
              .map(entity => ({ label: entity?.riskTypeOrValue+' - '+entity?.partnerId?.name, value: entity._id }));
              this.optionsParentLovId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
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
                    "parentId": parentLovId,
                },
                globalFilter: null,
                multiSortMeta: null
            }
            console.log(lazyLoadEvent)
            this.loadRecords(lazyLoadEvent);
      }

      getOptionsPartnerId(e) {
        this.partnerService.getManyAsLovs(e.query).subscribe({
             next: data => {  
                 if(e.query){
                     this.optionsPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
                     .map(entity => ({ label: entity.name, value: entity._id}));
                     this.optionsPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
                   }else{
                       this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                       this.optionsPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
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
    this.specialFilters = [];
    this.commonFilters = [];
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }

  hideDialog() {
    console.log("hideDialog");
  }
  selectAction(event) {
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
  ngOnDestroy(){
    this.recordService.setFilterValueExist(null);
  }


}
