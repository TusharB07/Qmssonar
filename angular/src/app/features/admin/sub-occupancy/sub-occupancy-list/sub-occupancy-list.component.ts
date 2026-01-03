import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppService } from 'src/app/app.service';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { OccupancyRateService } from '../../occupancy-rate/occupancy-rate.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { IUser } from '../../user/user.model';
import { ISubOccupancy } from '../../occupancy-rate/occupancy-rate.model';
import { SubOccupancyService } from '../sub-occupancy.service';
import { ILov } from 'src/app/app.model';
import { Table } from 'primeng/table';
import { ImportDialogComponent } from 'src/app/features/quote/components/quote/import-dialog/import-dialog.component';
import { ExportDialogComponent } from 'src/app/features/quote/components/quote/export-dialog/export-dialog.component';


@Component({
  selector: 'app-sub-occupancy-list',
  templateUrl: './sub-occupancy-list.component.html',
  styleUrls: ['./sub-occupancy-list.component.scss']
})
export class SubOccupancyListComponent implements OnInit, OnDestroy {

  user: IUser;

  recordSingularName = "Occupancy Rate";
  recordPluralName = "Occupancy Rates";
  modulePath: string = "/backend/admin/sub-occupancy";

  specialFilters = {};
  commonFilters = {};

  records: ISubOccupancy[];

  loading: boolean;

  totalRecords: number;

  selectedRecord: ISubOccupancy | null = null;

  selectedRecords: ISubOccupancy[] = [];

  selectAll: boolean = false;

  optionsProductId : ILov[] = []
  optionsPartners  : ILov[] = []
  optionsOccupancyId : ILov[] = []

  selectedProductId: any[];
  selectedPartners: any[];
  selectedOccupancyId: any[];
  filterData:any;
  selectedOption:any;
  action:any[];


  constructor(
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private accountService: AccountService,
    private appService: AppService,
    private productService: ProductService,
    private recordService: SubOccupancyService,
    private breadcrumbService: AppBreadcrumbService,
    private partnerService: PartnerService,
    private occupancyRateService : OccupancyRateService
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
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
    this.filterData = this.recordService.getFilterData();
    this.action = [
      { name: 'Import', code: 'IM', rate: 'subOccupancy' },
      { name: 'Export', code: 'EX', rate: 'subOccupancy' }
    ];
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })

  }

  createRecord() {
    this.router.navigateByUrl(`${this.modulePath}/new`);
  }

  loadRecords(event: LazyLoadEvent, name?: string) {
    let filterValue = this.recordService.getFilterValueExist();
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
        if (item != 'shopName') {
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

  getOptionsProductId(e) {
    this.productService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.type, value: entity._id }));
            this.optionsProductId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1 );
        } else {
          this.optionsProductId = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
          this.optionsProductId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1 );
        }
      },
      error: e => { }
    });
  }

  handleFilter(e) {
    console.log(e);
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

  getOptionsPartnerId(e) {
    this.partnerService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
            this.optionsPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1 );
        } else {
          this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
          this.optionsPartners.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1 );
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

  getOptionOccupancyId(e){
    this.occupancyRateService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsOccupancyId = data.data.entities.filter(entity => entity.occupancyType.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.occupancyType, value: entity._id }));
            this.optionsOccupancyId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1 );
        } else {
          this.optionsOccupancyId = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));
          this.optionsOccupancyId.sort((a,b)=> a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1 );
        }
      },
      error: e => { }
    });
  }

  occupancyHandleFilter(e){
    let occupancyId = this.selectedOccupancyId?.map(item => {
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
        "occupancyId": occupancyId
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent, 'occupancyId');
  }

  editRecord(record) {
    this.router.navigateByUrl(`${this.modulePath}/${record._id}`);
  }
  clear(table: Table) {
    this.commonFilters = [];
    this.specialFilters = [];
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }
  ngOnDestroy(){
    this.recordService.setFilterValueExist(null);
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
}
