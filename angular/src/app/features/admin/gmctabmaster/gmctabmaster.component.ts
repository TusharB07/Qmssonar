import { Component, OnInit } from '@angular/core';
import { IGmcTabMaster } from './gmctabmaster.model';
import { Router } from '@angular/router';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { GmcMasterService } from '../gmc-master/gmc-master.service';
import { IGMCTemplate } from '../gmc-master/gmc-master-model';
import { IOneResponseDto } from 'src/app/app.model';
import { PartnerService } from '../partner/partner.service';
import { ProductService } from '../../service/productservice';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-gmctabmaster',
  templateUrl: './gmctabmaster.component.html',
  styleUrls: ['./gmctabmaster.component.scss']
})
export class GmctabmasterComponent implements OnInit {

  cols: any[];

  recordSingularName = "GMC Tab Master";
  recordPluralName = "GMC Tab Master";
  modulePath: string = "/backend/admin/gmctabmaster";
  /** Represents the data being displayed currently */
  records: IGMCTemplate[];
  /** Represents the LI record being deleted. */
  selectedRecord: IGMCTemplate | null = null;
  /** Represents the LI records being deleted. */
  selectedRecords: IGMCTemplate[] = [];
  selectedProductId: any[];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  filterData: any;
  selectedPartners: any[];
  optionsPartners: any[];
  specialFilters = {};
  commonFilters = {};
  zoneFilters = []
  optionsProductId: any [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private gmcMasterService: GmcMasterService,
    private breadcrumbService: AppBreadcrumbService,
    private partnerService: PartnerService,
    private productService:ProductService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
  }

  ngOnInit(): void {
    this.filterData = this.gmcMasterService.getFilterData();
    console.log(this.filterData)
    // this.GmctabmasterService.get('new').subscribe({
    //   next: (dto: IOneResponseDto<IGMCTemplate>) => {
    //     this.filterData = dto.data.entity
    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // });
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
    this.loadRecordsPartners(lazyLoadEvent, 'partnerId');
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
      this.loadRecordsPartners(lazyLoadEvent,'productId');
}
  loadRecordsPartners(event: LazyLoadEvent, name?: string) {
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
    if (filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length) {
      event = { ...this.filterData };
    }
    this.loading = true;
    event.rows = 1000
    this.gmcMasterService.getMany(event).subscribe({
      next: records => {
        this.filterData = null;
        this.gmcMasterService.setFilterData(event);
        const allRecords = records.data.entities;


        // Get distinct records by partnerId
        // const filteredRecords = allRecords.reduce((acc, current) => {
        //   // Check if the partnerId already exists in the accumulator
        //   if (!acc.some(record => record.partnerId === current.partnerId)) {
        //     acc.push(current);
        //   }
        //   return acc;
        // }, [] as IGMCTemplate[]);

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
  loadRecords(event: LazyLoadEvent) {

    console.log(event);
    if (!!this.filterData) {
      event = this.filterData;
    }

    this.loading = true;
    this.gmcMasterService.getMany(event).subscribe({
      next: records => {
        console.log(records);
        this.filterData = null;
        this.gmcMasterService.setFilterData(event);

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
    this.gmcMasterService.setFilterData(undefined);
    this.filterData = null;
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
  }

  hideDialog() {
    console.log("hideDialog");
  }


}
