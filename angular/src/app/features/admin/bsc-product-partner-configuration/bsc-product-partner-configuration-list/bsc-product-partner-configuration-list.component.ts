import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { IBscProductPartnerConfiguration } from '../bsc-product-partner-configuration.model';
import { BscProductPartnerConfigurationService } from '../bsc-product-partner-configuration.service';



const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-bsc-product-partner-configuration-list',
  templateUrl: './bsc-product-partner-configuration-list.component.html',
  styleUrls: ['./bsc-product-partner-configuration-list.component.scss']
})
export class BscProductPartnerConfigurationListComponent implements OnInit {

  cols: any[];

  recordSingularName = "Bsc Product Partner Configuration";
  recordPluralName = "Bsc Product Partner Configurations";
  modulePath: string = "/backend/admin/bsc-product-partner-configuration";
  /** Represents the data being displayed currently */
  records: IBscProductPartnerConfiguration[];
  /** Represents the user record being deleted. */
  selectedRecord: IBscProductPartnerConfiguration | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IBscProductPartnerConfiguration[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  selectedProductId:any[];
  optionsProductId:any[];
//   selectedPartnerId:any[];
//   optionsPartnerId:any[];
selectedPartners:any[];
optionsPartners:any[];


  constructor(
    private router: Router,
    private messageService: MessageService,
    private bscProductPartnerConfigurationService: BscProductPartnerConfigurationService,
    private breadcrumbService: AppBreadcrumbService,
    private productService: ProductService,
    private partnerService: PartnerService) {
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
      { field: "partnerId", header: "partnerId" },
      { field: "productId", header: "productId" },
      { field: "bscSignageCover", header: "bscSignageCover" },
      { field: "bscPortableEquipmentsCover", header: "bscPortableEquipmentsCover" },
      { field: "bscMoneyTransitCover", header: "bscMoneyTransitCover" },
      { field: "bscMoneySafeTillCover", header: "bscMoneySafeTillCover" },
      { field: "bscLiabilitySectionCover", header: "bscLiabilitySectionCover" },
      { field: "bscFixedPlateGlassCover", header: "bscFixedPlateGlassCover" },
      { field: "bscFireLossOfProfitCover", header: "bscFireLossOfProfitCover" },
      { field: "bscFidelityGuaranteeCover", header: "bscFidelityGuaranteeCover" },
      { field: "bscElectronicEquipmentsCover", header: "bscElectronicEquipmentsCover" },
      { field: "bscBurglaryHousebreakingCover", header: "bscBurglaryHousebreakingCover" },
      { field: "bscAccompaniedBaggageCover", header: "bscAccompaniedBaggageCover" },


    ];
  }

  loadRecords(event: LazyLoadEvent) {

    console.log(event);

    this.loading = true;
    this.bscProductPartnerConfigurationService.getMany(event).subscribe({
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
  ProductHandleFilter(e) {
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
        console.log('*', lazyLoadEvent);

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

    this.bscProductPartnerConfigurationService.delete(this.selectedRecord._id).subscribe({
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
    this.bscProductPartnerConfigurationService.deleteMany(productIds).subscribe({
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
