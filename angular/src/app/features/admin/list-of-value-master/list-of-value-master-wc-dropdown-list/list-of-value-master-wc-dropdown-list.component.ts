import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { QuoteService } from '../../quote/quote.service';
import { WCAllowedListOfValuesMasters, IWCListOfValueMaster } from '../list-of-value-master.model';
import { WCListOfValueMasterService } from '../wc-list-of-value-master.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from '../../user/user.model';
import { DialogService } from 'primeng/dynamicdialog';
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
  selector: 'app-list-of-value-master-wc-dropdown-list',
  templateUrl: './list-of-value-master-wc-dropdown-list.component.html',
  styleUrls: ['./list-of-value-master-wc-dropdown-list.component.scss']
})
export class WCListOfValueMasterDropdownListComponent implements OnInit, OnDestroy {
  cols: any[];

  recordSingularName = "Employee Compensation List of Value";
  recordPluralName = "Employee Compensation List of Values";
  modulePath: string = "/backend/admin/list-of-value-master";
  /** Represents the data being displayed currently */
  records: IWCListOfValueMaster[];
  /** Represents the user record being deleted. */
  selectedRecord: IWCListOfValueMaster | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IWCListOfValueMaster[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  action: any[];
  optionsProductId: any[];
  selectedProductId: any[];
  optionsParentLovId: any[];
  selectedParentLovId: any[];
  selectedPartners: any[];
  optionsPartners: any[];
  commonFilters = {};
  specialFilters = {};
  user: IUser;
  filterData: any;
  selectedOption: any


  constructor(
    private router: Router,
    private messageService: MessageService,
    private recordService: WCListOfValueMasterService,
    private breadcrumbService: AppBreadcrumbService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private accountService: AccountService,
    private dialogService: DialogService) {
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
      { name: 'Import', code: 'IM', rate: 'liability_dropdowns' },
      { name: 'Export', code: 'EX', rate: 'liability_dropdowns' }
    ];
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
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

  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.recordService.getFilterValueExist();
    console.log(event, name)
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
        if (item == 'toSI' || item == 'fromSI') {
          console.log("Inside")
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
        } else {
          filtermetadata[item] = event.filters[item]
        }
      })

      console.log(filters)

      event.filters = { ...filtermetadata, ...this.specialFilters }
      this.commonFilters = { ...this.commonFilters, ...filtermetadata }
    }
    // @ts-ignore
    event['filters']['lovType'] = [
      //WC
      {
        "value": WCAllowedListOfValuesMasters.WC_COVERAGE_FOR_MEDICAL_EXPENSES,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.WC_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      //D&O
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_TURNOVER_THRESHOLD,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_TYPE_OF_POLICY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_NATURE_OF_BUSINESS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_AGE_OF_COMPANY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_AOA_AOY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_BUSINESS_AS_PER_PARENT_COMPANY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_DEDUCTIBLES,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_SUBSIDIARY_LOCATION,
        "matchMode": "equals",
        "operator": "or"
      },

      //E&O
      {
        "value": WCAllowedListOfValuesMasters.EANDO_NUMBER_OF_EXPERIENCE,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_SUBSIDIARY_LOCATION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_TYPE_OF_POLICY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_TERRITORY_AND_JURISDICTION,
        "matchMode": "equals",
        "operator": "or"
      },
      //CGL
      {
        "value": WCAllowedListOfValuesMasters.CGL_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CGL_TYPE_OF_POLICY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CGL_TYPE_OF_PRODUCT,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CGL_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },
      // {
      //   "value": WCAllowedListOfValuesMasters.CGL_DETAILS_OF_PRODUCT_AND_USAGE,
      //   "matchMode": "equals",
      //   "operator": "or"
      // },
      {
        "value": WCAllowedListOfValuesMasters.CGL_TERRITORY_AND_JURISDICTION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CGL_SUBSIDIARY_LOCATION,
        "matchMode": "equals",
        "operator": "or"
      },

      //Product Liability
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_TYPE_OF_POLICY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },
      // {
      //   "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_DETAILS_OF_PRODUCT_AND_USAGE,
      //   "matchMode": "equals",
      //   "operator": "or"
      // },
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_TERRITORY_AND_JURISDICTION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_SUBSIDIARY_LOCATION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CGL_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CGL_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.EANDO_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.WC_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.WC_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      }
      ,
      {
        "value": WCAllowedListOfValuesMasters.LIABILITY_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      //Cyber Liability
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_TYPE_OF_POLICY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_NUMBER_OF_EXPERIENCE,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_SUBSIDIARY_LOCATION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CYBER_LIABILITY_TERRITORY_AND_JURISDICTION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_AOA_AOY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.PUBLIC_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },

      //Crime
      {
        "value": WCAllowedListOfValuesMasters.CRIME_LIABILITY_TYPE_OF_POLICY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_LIABILITY_RETROACTIVE_COVER,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_LIABILITY_SUBSIDIARY_LOCATION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_DEDUCTIBLES,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_TERRITORY_AND_JURISDICTION,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_LIABILITY_SUBJECTIVITY,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_LIABILITY_MAJOR_EXCLUSIONS,
        "matchMode": "equals",
        "operator": "or"
      },
      {
        "value": WCAllowedListOfValuesMasters.CRIME_LIABILITY_INSURED_BUSINESS_ACTIVITY,
        "matchMode": "equals",
        "operator": "or"
      }

    ]
    if (filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length) {
      event = { ...this.filterData };
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

  getOptionsParentLovId(e) {
    this.recordService.getManyAsLovs(e.query).subscribe({
      next: data => {
        console.log('***', data.data.entities.filter(entity => entity.lovType.toLowerCase().includes(e.query.toLowerCase())));
        if (e.query) {
          //   this.optionsClientGroups = data.data.entities.filter(entity => entity.)
          this.optionsParentLovId = data.data.entities.filter(entity => entity.lovType.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.lovType, value: entity._id }));
        } else {
          this.optionsParentLovId = data.data.entities.map(entity => ({ label: entity.lovType, value: entity._id }));
        }
      },
      error: e => { }
    });
  }
  ParentLovIdHandleFilter(e) {
    let parentLovId = this.selectedParentLovId?.map(item => {
      let obj = {
        "value": null,
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
    this.loadRecords(lazyLoadEvent, 'parentLovId');
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

  createRecord() {
    this.recordService.routeSource.next('wc-dropdown-list');
    this.router.navigateByUrl(`${this.modulePath}/wc/new`);
  }

  editRecord(record) {
    this.recordService.routeSource.next('wc-dropdown-list');
    this.router.navigateByUrl(`${this.modulePath}/wc/${record._id}`);
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
  ngOnDestroy() {
    this.recordService.setFilterValueExist(null);
  }

}

