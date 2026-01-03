import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { IAddOnCover, OPTIONS_MONTH_OR_DAYS } from "../addon-cover.model";
import { AddonCoverService } from "../addon-cover.service";
import { PartnerService } from "../../partner/partner.service";
import { ProductService } from "../../product/product.service";
import { AppService } from "src/app/app.service";
import { AccountService } from "src/app/features/account/account.service";
import { IUser } from "../../user/user.model";
import { DialogService } from 'primeng/dynamicdialog';
import { ExportDialogComponent } from 'src/app/features/quote/components/quote/export-dialog/export-dialog.component';
import { ImportDialogComponent } from 'src/app/features/quote/components/quote/import-dialog/import-dialog.component';
import { SectorService } from "../../sector/sector.service";
import { QuoteLocationAddonService } from '../../quote-location-addon/quote-location-addon.service';
import { IQuoteLocationAddonCovers } from '../../quote-location-addon/quote-location-addon.model';

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: "app-addon-cover-list",
  templateUrl: "./addon-cover-list.component.html",
  styleUrls: ["./addon-cover-list.component.scss"]
})
export class AddonCoverListComponent implements OnInit, OnDestroy {
  cols: any[];

  recordSingularName = "Addon Cover";
  recordPluralName = "Addon Cover";
  modulePath: string = "/backend/admin/addon-covers";
  /** Represents the data being displayed currently */
  records: IAddOnCover[];
  /** Represents the user record being deleted. */
  selectedRecord: IAddOnCover | null = null;
  /** Represents the user records being deleted. */
  selectedRecords: IAddOnCover[] = [];

  /** Dialog to show when attempting to delete one record */
  deleteRecordDialog: boolean = false;
  /** Dialog to show when attempting to delete more than one record */
  deleteSelectedRecordsDialog: boolean = false;

  optionsMonthOrDays: any[] = [];


  totalRecords: number;
  loading: boolean;
  selectAll: boolean = false;

  selectedPartners: any[];
  optionsPartners: any[];
  optionsProductId: any[];
  selectedProductId: any[];
  specialFilters = {};
  commonFilters = {};
  user: IUser;
  AllowedRoles = AllowedRoles
  action: any[];
  selectedOption: any
  filterData: any;
  optionsSectorId: any[];

  isDropdownOpen = false;
  newQuoteAddonCoverData: [{ id: string, name: string, sumInsured: number, addonType: number, addonStatus: string }]
  // { label: 'Sample 1', value: 123456789, extra: 0, status: 'pending' },
  // { label: 'Sample 2', value: 987654321, extra: 200, status: 'sent' },
  // { label: 'Example', value: 654321987, extra: 100, status: 'pending' },
  // { label: 'Demo', value: 456123789, extra: 50, status: 'sent' },

  quoteLocationAddonCover: IQuoteLocationAddonCovers[]


  constructor(
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService,
    private dialogService: DialogService,
    private appService: AppService,
    private recordService: AddonCoverService,
    private breadcrumbService: AppBreadcrumbService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private sectorService: SectorService,
    private quoteLocationAddOnService: QuoteLocationAddonService,
  ) {
    this.breadcrumbService.setItems([
      { label: "Pages" },
      {
        label: this.recordPluralName,
        routerLink: [`${this.modulePath}`]
      }
    ]);

    this.optionsMonthOrDays = OPTIONS_MONTH_OR_DAYS;
  }

  ngOnInit(): void {
    this.action = [
      { name: 'Import', code: 'IM', rate: 'add_on' },
      { name: 'Export', code: 'EX', rate: 'add_on' }
    ];
    this.cols = [
      { field: "_id", header: "Id" },
      { field: "name", header: "Name" }
      // { field: "state", header: "State" },
    ];

    this.accountService.currentUser$.subscribe({
      next: (user: IUser) => {
        this.user = user;
      }
    })
    this.filterData = this.recordService.getFilterData();

    this.showNewAddonCover()
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
        if (item != 'name' && item != 'addonTypeFlag' && item != 'category') {
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
    if (filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length) {
      event = { ...this.filterData };
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
    this.showNewAddonCover()
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
  getOptionsSectorId(e) {
    this.sectorService.getMany(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsSectorId = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
          this.optionsSectorId.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        } else {
          this.optionsSectorId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
          this.optionsSectorId.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        }
      },
      error: e => { }
    });
  }
  ngOnDestroy() {
    this.recordService.setFilterValueExist(null);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  showNewAddonCover() {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 100000,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        isExternal: [
          {
            value: true,
            matchMode: "equals",
            operator: "and"
          }
        ],
        // @ts-ignore
        addonStatus: [
          {
            value: "Pending",
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.quoteLocationAddOnService.getMany(lazyLoadEvent).subscribe({
      next: (value: any) => {
        this.quoteLocationAddonCover = value.data.entities
        this.newQuoteAddonCoverData = value.data.entities.map(val => ({ id: val._id, name: val.name, sumInsured: val.sumInsured, addonType: val.freeUpToText, addonStatus: val.addonStatus }))
      },
    })
  }

  updateNewAddonStatus(id: string, status: string) {
    if (status == "Approved") {
      this.quoteLocationAddOnService.get(id).subscribe({
        next: (value: any) => {
          this.router.navigateByUrl(`${this.modulePath}/new`, { state: value.data.entity });
        },
      })
    } else {

      const payload: any = {
        addonStatus: status
      }
      this.quoteLocationAddOnService.update(id, payload).subscribe({
        next: (value: any) => {
          //@ts-ignore
          this.newQuoteAddonCoverData = this.newQuoteAddonCoverData.filter(item => item._id !== id);
          this.showNewAddonCover()
        },
      })
    }

  }
}
