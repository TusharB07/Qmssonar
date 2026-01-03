import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductPartnerConfigurationService } from '../../product-partner-configuration/product-partner-configuration.service';
import { ProductService } from '../../product/product.service';
import { AllowedRoles, IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { IProductPartnerIcConfigration } from '../product-partner-ic-configuration.model';
import { ProductPartnerIcConfigurationService } from '../product-partner-ic-configuration.service';
import { IOneResponseDto, IBulkImportResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};


@Component({
  selector: 'app-product-partner-ic-configuration-list',
  templateUrl: './product-partner-ic-configuration-list.component.html',
  styleUrls: ['./product-partner-ic-configuration-list.component.scss']
})
export class ProductPartnerIcConfigurationListComponent implements OnInit, OnDestroy {
  cols: any[];

  recordSingularName = "Product Partner Ic Configuration";
  recordPluralName = "Product Partner Ic Configurations";
  modulePath: string = "/backend/admin/product-partner-ic-configuration";
  /** Represents the data being displayed currently */
  records: IProductPartnerIcConfigration[];
  /** Represents the user record being deleted. */
  selectedRecord: IProductPartnerIcConfigration | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IProductPartnerIcConfigration[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  currentUser$: Observable<IUser>;
  allowedRelianceModel: boolean;
  allowedAppleModel: boolean;

  optionsProductId: any[];
  selectedProductId: any[];
  optionsBrokerPartners: any[];
  selectedBrokerPartners: any[];
  optionsInsurerPartnerId: any[];
  selectedInsurerPartnerId: any[];
  specialFilters = {};
  commonFilters = {};
  filterData:any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private productPartnerIcConfigurationService: ProductPartnerIcConfigurationService,
    private breadcrumbService: AppBreadcrumbService,
    private accountService: AccountService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private appService: AppService
  ) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
    this.currentUser$ = this.accountService.currentUser$;
  }

  ngOnInit(): void {
    this.cols = [
      { field: "partnerId", header: "partnerId" },
      { field: "productId", header: "productId" },

    ];
    // this.currentUser$.subscribe({
    //   next: user => {
    //     let role: IRole = user?.roleId as IRole;

    //     if (role?.name === AllowedRoles.INSURER_ADMIN) {
    //         this.allowedRelianceModel= true;
    //     }
    //     if (role?.name === AllowedRoles.ADMIN) {
    //         this.allowedAppleModel= true;
    //     }
    //   }
    // })
    this.filterData = this.productPartnerIcConfigurationService.getFilterData();


  }

  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.productPartnerIcConfigurationService.getFilterValueExist();
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

          if (element.value != null) {
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
    if(filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length){
      event = {...this.filterData};
    }

    this.loading = true;
    this.productPartnerIcConfigurationService.getMany(event).subscribe({
      next: records => {
        this.filterData = null;
        this.productPartnerIcConfigurationService.setFilterData(event);
        this.records = records.data.entities;
        this.totalRecords = records.results;
        this.loading = false;

        this.currentUser$.subscribe({
          next: user => {
            let role: IRole = user?.roleId as IRole;

            if (role?.name === AllowedRoles.INSURER_ADMIN) {
              //   if(this.records. == 'Reliance'){
              this.allowedRelianceModel = true;
              //   console.log('prudhvi    >>>>' , this.records);
              //   }
            }
            else {
              this.allowedAppleModel = true;
            }
          }
        })

      },
      error: e => {
        console.log(e);
      }
    });
  }

  getOptionsProductId(e) {
    this.productService.getManyAsLovs(e.query).subscribe({
      next: data => {
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
    this.loadRecords(lazyLoadEvent, 'productId');
  }
  getOptionsBrokerPartnerId(e) {
    this.partnerService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsBrokerPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
            this.optionsBrokerPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
          this.optionsBrokerPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
          this.optionsBrokerPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        }
      },
      error: e => { }
    });
  }

  brokerPartnerIdHandleFilter(e) {
    let brokerPartnerId = this.selectedBrokerPartners?.map(item => {
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
        "brokerPartnerId": brokerPartnerId
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent, 'brokerPartnerId');
  }

  getOptionsInsurerPartnerId(e) {
    this.partnerService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsInsurerPartnerId = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
            this.optionsInsurerPartnerId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
          this.optionsInsurerPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
          this.optionsInsurerPartnerId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        }
      },
      error: e => { }
    });
  }

  insurerPartnerIdHandleFilter(e) {
    let insurerPartnerId = this.selectedInsurerPartnerId?.map(item => {
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
        "insurerPartnerId": insurerPartnerId
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent, 'insurerPartnerId');
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

    this.productPartnerIcConfigurationService.delete(this.selectedRecord._id).subscribe({
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
    this.productPartnerIcConfigurationService.deleteMany(productIds).subscribe({
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

  bulkImportGenerateSample() {
    this.productPartnerIcConfigurationService.bulkImportGenerateSample().subscribe({
        next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            console.log(dto)
            if (dto.status == 'success') {
                // Download the sample file
                this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

            }
        }
    })
}

get uploadProps(): PFileUploadGetterProps {
  return this.productPartnerIcConfigurationService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
      console.log(dto)
      if (dto.status == 'success') {
          window.location.reload()
      } else {
          // this.messageService.add({
          //     severity: 'fail',
          //     summary: "Failed to Upload",
          //     detail: `${dto.data.entity?.errorMessage}`,
          // })
          alert(dto.data.entity?.errorMessage)
          if (dto.data.entity?.downloadablePath) {
              this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
          }
      }
  })
}
ngOnDestroy(){
  this.productPartnerIcConfigurationService.setFilterValueExist(null);
}
}
