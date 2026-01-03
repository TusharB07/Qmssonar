import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { IIndustryType } from "../../industry-type/industry-type.model";
import { OPTIONS_EARTHQUAKE_ZONES } from "../../pincode/pincode.model";
import { AllowedTaskStatus, IBranchMaster } from "../branch-master.model";
import { BranchMasterService } from "../branch-master.service";
import { PartnerService } from "../../partner/partner.service";
import { IndustryTypeService } from "../../industry-type/industry-type.service";
import { ProductService } from "../../product/product.service";
import { AppService } from "src/app/app.service";
import { AccountService } from "src/app/features/account/account.service";
import { AllowedRoles } from "../../role/role.model";
import { IUser } from "../../user/user.model";
import { ImportDialogComponent } from "src/app/features/quote/components/quote/import-dialog/import-dialog.component";
import { ExportDialogComponent } from "src/app/features/quote/components/quote/export-dialog/export-dialog.component";
import { DialogService } from "primeng/dynamicdialog";
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: "app-branch-master-list",
  templateUrl: "./branch-master-list.component.html",
  styleUrls: ["./branch-master-list.component.scss"]
})
export class BranchMasterListComponent implements OnInit, OnDestroy {
  cols: any[];

  recordSingularName = "Branch Master";
  recordPluralName = "Branch Master";
  modulePath: string = "/backend/admin/branch-master";
  /** Represents the data being displayed currently */
  records: IBranchMaster[];
  /** Represents the user record being deleted. */
  selectedRecord: IBranchMaster | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IBranchMaster[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  optionsEarthquakeZones: ILov[] = [];

  selectedPartners: any[];
  optionsPartners: any[];
  selectedIndustryTypeName: any[];
  optionsIndustryTypeName: any[];
  optionsProductId: any[];
  selectedProductId: any[];
  specialFilters = {};
  commonFilters = {};

  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;
  zoneFilters = []
  AllowedRoles = AllowedRoles
  user: IUser;
  action: any[];
  selectedOption : any
  filterData:any;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private productService: ProductService,
    private recordService: BranchMasterService,
    private breadcrumbService: AppBreadcrumbService,
    private partnerService: PartnerService,
    private industryTypeService: IndustryTypeService,
    private appService: AppService,
    private dialogService: DialogService) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);
    this.optionsEarthquakeZones = OPTIONS_EARTHQUAKE_ZONES;
  }

  ngOnInit(): void {
    this.action = [
      { name: 'Import', code: 'IM', rate: 'earthquake' },
      { name: 'Export', code: 'EX', rate: 'earthquake' }
    ];
    this.cols = [
      { field: "_id", header: "Id" },
      { field: "name", header: "Name" },
      // { field: "state", header: "State" }
    ];
    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
        console.log(this.user)
      }
    })
    this.filterData = this.recordService.getFilterData();
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
    /* event.filters['zone'] = [{
      "value": this.zoneFilters.length > 0 ? this.zoneFilters : null,
      "matchMode": "in",
      "operator": "and"
    }] */
      if(filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length){
        event = {...this.filterData};
      }

    this.loading = true;
    this.recordService.getMany(event).subscribe({
      next: records => {
        // console.log(records.data.entities.map((i: IBranchMaster) =>));
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

  zoneFilter(e) {
    this.zoneFilters = e;
  }

  getOptionsProductId(e) {
    this.productService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsProductId = data.data.entities.filter(entity => entity.type.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.type, value: entity._id }));
        } else {
          this.optionsProductId = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
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

  getOptionsIndustryTypeName(e) {
    this.industryTypeService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsIndustryTypeName = data.data.entities.filter(entity => entity.industryTypeName.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.industryTypeName, value: entity._id }));
        } else {
          this.optionsIndustryTypeName = data.data.entities.map(entity => ({ label: entity.industryTypeName, value: entity._id }));
        }
      },
      error: e => { }
    });
  }
  industryTypeNameHandleFilter(e) {
    let industryTypeName = this.selectedIndustryTypeName?.map(item => {
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
        "industryTypeName": industryTypeName
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent);
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

  // bulkImportGenerateSample() {
  //   this.recordService.bulkImportGenerateSample().subscribe({
  //     next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
  //       console.log(dto)
  //       if (dto.status == 'success') {
  //         // Download the sample file
  //         this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

  //       }
  //     }
  //   })
  // }
  // get uploadProps(): PFileUploadGetterProps {
  //   return this.recordService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
  //     console.log(dto)
  //     if (dto.status == 'success') {
  //       window.location.reload()
  //     } else {
  //       // this.messageService.add({
  //       //     severity: 'fail',
  //       //     summary: "Failed to Upload",
  //       //     detail: `${dto.data.entity?.errorMessage}`,
  //       // })
  //       alert(dto.data.entity?.errorMessage)
  //       if (dto.data.entity?.downloadablePath) {
  //         this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
  //       }
  //     }
  //   })
  // }

  selectAction(event) {
    console.log(event.value)
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
