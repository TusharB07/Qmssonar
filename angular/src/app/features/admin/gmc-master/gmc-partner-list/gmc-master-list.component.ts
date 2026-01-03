import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ProductService } from '../../product/product.service';
import { SalarySlabsService } from '../../wc-salary-slabs/wc-salary-slabs.service';
import { BusinessTypeService } from '../../wc-business-type/wc-business-type.service';
import { AllowedRoles } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { IWCRates } from '../../wc-rates-master/wc-rate-master.model';
import { IGMCTemplate } from '../gmc-master-model';
import { GmcMasterService } from '../gmc-master.service';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-gmc-master-list',
  templateUrl: './gmc-master-list.component.html',
  styleUrls: ['./gmc-master-list.component.scss']
})
export class GMCMasterListComponent implements OnInit, OnDestroy {

  cols: any[];
  recordSingularName = "Template Master";
  recordPluralName = "Template Masters";
  modulePath: string = "/backend/admin/gmcmaster";
  /** Represents the data being displayed currently */
  records: IGMCTemplate[];
  /** Represents the rates record being deleted. */
  selectedRecord: IGMCTemplate | null = null;
  /** Represents the rates records being deleted. */
  selectedRecords: IGMCTemplate[] = [];
  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  optionsProductId: any [];
  selectedProductId: any[];
  AllowedRoles = AllowedRoles
  user: IUser;
  selectedPartners: any[];
  optionsPartners: any[];
  specialFilters = {};
  commonFilters = {};
  zoneFilters = []
  filterData:any;
  constructor(
    private gmcMasterService: GmcMasterService,
    private router: Router, 
    private messageService: MessageService,  
    private breadcrumbService: AppBreadcrumbService, private productService:ProductService,
    private accountService: AccountService,
    private partnerService: PartnerService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);

    
  }

  getOptionsPartnerId(e) {
    this.partnerService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
            this.optionsPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
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
        "partnerId": partnerId
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent, 'partnerId');
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
        this.loadRecords(lazyLoadEvent,'productId');
  }


  ngOnInit(): void {

    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
    this.filterData = this.gmcMasterService.getFilterData();
  }

  


  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.gmcMasterService.getFilterValueExist();
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
        let values = [];
        // @ts-ignore
        event.filters[item].forEach(element => {
          console.log(typeof element.value);

          if (element.value != null && typeof element.value == 'string') {
            values = [...values, ...element.value.split(',').map(data => { return { value: data } })];
          }
        });
        filtermetadata[item] = [{
          value: values.length > 0 ? values : null,
          matchMode: "in",
          operator: "and"
        }]
      })

      event.filters = { ...filtermetadata, ...this.specialFilters }
      this.commonFilters = { ...this.commonFilters, ...filtermetadata }
    }
    // @ts-ignore
    event.filters['zone'] = [{
      "value": this.zoneFilters.length > 0 ? this.zoneFilters : null,
      "matchMode": "in",
      "operator": "and"
    }]
    if(filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length){
      event = {...this.filterData};
    }
    this.loading = true;
    event.rows=1000
    this.gmcMasterService.getMany(event).subscribe({
      next: records => {
        this.filterData = null;
        this.gmcMasterService.setFilterData(event);
        const allRecords = records.data.entities;
    
        // Filter out records without partnerId or productId
        const filteredRecords = allRecords.filter(record => record.partnerId && record.productId);
    
        // Use Map to ensure distinct records by partnerId and productId
        const recordMap = new Map();
    
        filteredRecords.forEach(record => {
          const key = `${record.productId['_id']}-${record.partnerId['_id']}`;
    
          // Only add if the key doesn't exist, ensuring distinct partnerId per productId
          if (!recordMap.has(key)) {
            recordMap.set(key, record);
          }
        });
    
        // Convert the Map values back to an array
        this.records = Array.from(recordMap.values());
        this.totalRecords = this.records.length;
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
    this.gmcMasterService.delete(this.selectedRecord._id).subscribe({
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
    this.gmcMasterService.deleteMany(productIds).subscribe({
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
  ngOnDestroy(){
    this.gmcMasterService.setFilterValueExist(null);
  }

}
