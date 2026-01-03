import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWCCoverageType } from '../wc-coverage-type.model';
import { WCCoverageTypeService } from '../wc-coverage-type.service';
import { ProductService } from '../../product/product.service';
import { AllowedRoles } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { ExportDialogComponent } from 'src/app/features/quote/components/quote/export-dialog/export-dialog.component';
import { ImportDialogComponent } from 'src/app/features/quote/components/quote/import-dialog/import-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-wc-coverage-type-list',
  templateUrl: './wc-coverage-type-list.component.html',
  styleUrls: ['./wc-coverage-type-list.component.scss']
})
export class WCCoverageTypeListComponent implements OnInit, OnDestroy {

  cols: any[];

  recordSingularName = "Coverage Type";
  recordPluralName = "Coverage Types";
  modulePath: string = "/backend/admin/wccoveragetypes";
  /** Represents the data being displayed currently */
  records: IWCCoverageType[];
  /** Represents the coverage record being deleted. */
  selectedRecord: IWCCoverageType | null = null;
  /** Represents the coverage records being deleted. */
  selectedRecords: IWCCoverageType[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  optionsProductId: any[];
  selectedProductId: any[];
  AllowedRoles = AllowedRoles
  user: IUser;
  selectedPartners: any[];
  optionsPartners: any[];
  specialFilters = {};
  commonFilters = {};
  zoneFilters = []
  filterData: any;
  selectedOption: any;
  action: any[];
  constructor(
    private router: Router,
    private messageService: MessageService,
    private wcCoverageTypeService: WCCoverageTypeService,
    private breadcrumbService: AppBreadcrumbService, private productService: ProductService,
    private accountService: AccountService,
    private partnerService: PartnerService,
    private dialogService: DialogService
  ) {
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
          this.optionsPartners.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
          this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
          this.optionsPartners.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
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
        if (e.query) {
          this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.type, value: entity._id }));
          this.optionsProductId.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
          this.optionsProductId = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
          this.optionsProductId.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
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


  ngOnInit(): void {
    this.action = [
      { name: 'Import', code: 'IM', rate: 'wc_coverage' },
      { name: 'Export', code: 'EX', rate: 'wc_coverage' }
    ];
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
    this.filterData = this.wcCoverageTypeService.getFilterData();
  }

  // loadRecords(event: LazyLoadEvent) {

  //   console.log(event);

  //   this.loading = true;
  //   this.wcCoverageTypeService.getMany(event).subscribe({
  //     next: records => {
  //       console.log(records);

  //       this.records = records.data.entities;
  //       this.totalRecords = records.results;
  //       this.loading = false;
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });
  // }

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

  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.wcCoverageTypeService.getFilterValueExist();
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
    if (filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length) {
      event = { ...this.filterData };
    }

    this.loading = true;
    this.wcCoverageTypeService.getMany(event).subscribe({
      next: records => {
        console.log(records.data.entities.map((i: IWCCoverageType) => [i.coverageType, i.productId]));
        this.filterData = null;
        this.wcCoverageTypeService.setFilterData(event);

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

    this.wcCoverageTypeService.delete(this.selectedRecord._id).subscribe({
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
    this.wcCoverageTypeService.deleteMany(productIds).subscribe({
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
  ngOnDestroy() {
    this.wcCoverageTypeService.setFilterValueExist(null);
  }

}
