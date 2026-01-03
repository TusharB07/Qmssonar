import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ProductService } from '../../product/product.service';
import { IProductPartnerConfiguration } from '../product-partner-configuration.model';
import { ProductPartnerConfigurationService } from '../product-partner-configuration.service';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from "src/app/app.service";


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-product-partner-configuration-list',
  templateUrl: './product-partner-configuration-list.component.html',
  styleUrls: ['./product-partner-configuration-list.component.scss']
})
export class ProductPartnerConfigurationListComponent implements OnInit {
  @Input() partnerId: string = "";
  cols: any[];

  recordSingularName = "Product Partner Configuration";
  recordPluralName = "Product Partner Configurations";
  modulePath: string = "/backend/admin/product-partner-configuration";
  /** Represents the data being displayed currently */
  records: IProductPartnerConfiguration[];
  /** Represents the user record being deleted. */
  selectedRecord: IProductPartnerConfiguration | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IProductPartnerConfiguration[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  optionsProductId: any [];
  selectedProductId: any[];
  optionsBrokerPartners: any [];
  selectedBrokerPartners: any[];

  constructor(
    private router: Router,
    private appService: AppService,
    private messageService: MessageService,
    private productPartnerConfigurationService: ProductPartnerConfigurationService,
    private breadcrumbService: AppBreadcrumbService,
    private recordService: ProductPartnerConfigurationService,
    private productService: ProductService,) {
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

    ];
    if(this.partnerId) {
      this.modulePath = `/backend/admin/partners/${this.partnerId}/product-partner-configuration`;
    }
    console.log(this.modulePath)
  }
  loadRecords(event: LazyLoadEvent) {

    if (this.partnerId != "") {
      // @ts-ignore
      event.filters["partnerId"] = [
        {
          value: this.partnerId,
          matchMode: "equals",
          operator: "and"
        }
      ];
    }

    this.loading = true;
    this.productPartnerConfigurationService.getMany(event).subscribe({
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

    // this.loading = true;
    // this.productPartnerConfigurationService.getMany(event).subscribe({
    //   next: records => {
    //     console.log(records);

    //     this.records = records.data.entities;
    //     this.totalRecords = records.results;
    //     this.loading = false;
    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // });
  }

  getOptionsProductId(e) {
    this.productService.getManyAsLovs(e.query).subscribe({
      next: data => {
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

    this.productPartnerConfigurationService.delete(this.selectedRecord._id).subscribe({
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
    this.productPartnerConfigurationService.deleteMany(productIds).subscribe({
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

  bulkImportGenerateSample() {
    this.recordService.bulkImportGenerateSample().subscribe({
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
  return this.recordService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
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
}
