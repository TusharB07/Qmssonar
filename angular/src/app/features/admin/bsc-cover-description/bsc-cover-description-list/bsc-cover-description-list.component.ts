import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from '../../product/product.service';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { BscCoverDescriptionService } from '../bsc-cover-description.service';
import { IBscCoverDescription } from '../bsc-cover-description-model';
import { DialogService } from 'primeng/dynamicdialog';
import { IUser } from '../../user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { ImportDialogComponent } from 'src/app/features/quote/components/quote/import-dialog/import-dialog.component';
import { ExportDialogComponent } from 'src/app/features/quote/components/quote/export-dialog/export-dialog.component';

@Component({
  selector: 'app-bsc-cover-description-list',
  templateUrl: './bsc-cover-description-list.component.html',
  styleUrls: ['./bsc-cover-description-list.component.scss']
})
export class BscCoverDescriptionListComponent implements OnInit,OnDestroy {
  cols: any[];

  recordSingularName = "BSC Cover Description";
  recordPluralName = "BSC Covers Description";
  modulePath: string = "/backend/admin/bsc-covers-description";
  /** Represents the data being displayed currently */
  records: IBscCoverDescription[];
  /** Represents the user record being deleted. */
  selectedRecord: IBscCoverDescription | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IBscCoverDescription[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  optionsProductId: any[];
  selectedProductId: any[];
  selectedPartners: any[];
  optionsPartners: any[];
  specialFilters = {};
  commonFilters = {};
  filterData:any;
  selectedOption: any;
  user: IUser;
  action: any;

  constructor(
      private router: Router,
      private recordService: BscCoverDescriptionService,
      private breadcrumbService: AppBreadcrumbService,
      private productService: ProductService,
      private dialogService: DialogService,
      private accountService: AccountService
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
    this.action = [
        { name: 'Import', code: 'IM', rate: 'bscCoverDescription' },
        { name: 'Export', code: 'EX', rate: 'bscCoverDescription' }
      ];
      
    this.filterData = this.recordService.getFilterData();
    this.accountService.currentUser$.subscribe({
        next: (user: IUser) => {
            this.user = user;
        }
    })
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
              if (item != 'bscType') {
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

  createRecord() {
      this.router.navigateByUrl(`${this.modulePath}/new`);
  }

  editRecord(record) {
      this.router.navigateByUrl(`${this.modulePath}/${record._id}`);
  }

  clear(table: Table) {
      this.specialFilters = [];
      this.commonFilters = [];
      this.selectedRecords = [];
      this.selectAll = false;
      table.clear();
  }

  selectAction(event) {
    if (event.value.name == 'Import') {
      const ref = this.dialogService.open(ImportDialogComponent, {
        header: "Import Document",
        styleClass: 'customPopup',
        width: '600px',
        data: {event : event.value ,user : this.user}
      })
      ref.onClose.subscribe((data) => {
      });
    } else {
      const ref = this.dialogService.open(ExportDialogComponent, {
        header: "Export Document",
        styleClass: 'customPopup',
        width: '600px',
        height: '50%',
        data: {event : event.value ,user : this.user}
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
