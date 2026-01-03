import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { RmMappedIntermediate } from '../rm-mapped-intermediate.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from '../../user/user.model';
import { LazyLoadEvent } from 'primeng/api';
import { RmMappedIntermediateService } from '../rm-mapped-intermediate.service';
import { ILov } from 'src/app/app.model';
import { PartnerService } from '../../partner/partner.service';
import { UserService } from '../../user/user.service';
import { IOneResponseDto, IBulkImportResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-rm-mapped-intermediate-list',
  templateUrl: './rm-mapped-intermediate-list.component.html',
  styleUrls: ['./rm-mapped-intermediate-list.component.scss']
})
export class RmMappedIntermediateListComponent implements OnInit {

  user: IUser;

  recordSingularName = "Rm Mapped Intermediate";
  recordPluralName = "Rm Mapped Intermediates";
  modulePath: string = "/backend/admin/rm-mapped-intermediate";

  records : RmMappedIntermediate[];

  totalRecords: number;

  loading: boolean;

  selectedRecord: RmMappedIntermediate | null = null;

  selectedRecords: RmMappedIntermediate[] = [];

  selectAll: boolean = false;

  specialFilters = {};
  commonFilters = {};

  optionsPartners  : ILov[] = []
  optionsInterPartners : ILov[] = []
  optionUser : ILov[] = []
  selectedPartners: any[] = [];
  selectedInterPartners: any[] = [];
  selectedUsers : any[] = []

  constructor(
    private router: Router,
    private breadcrumbService: AppBreadcrumbService,
    private accountService: AccountService,
    private recordService: RmMappedIntermediateService,
    private partnerService: PartnerService,
    private userService : UserService,
    private appService: AppService
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
  }

  loadRecords(event: LazyLoadEvent, name?: string) {
    console.log(event)
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
        if (item != 'rmEmail') {
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
    this.loading = true;
    this.recordService.getMany(event).subscribe({
      next: records => {

        this.records = records.data.entities;
        console.log(this.records)
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

  getOptionsPartnerId(e) {
    this.partnerService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
        } else {
          this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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

  getOptionsIntermediateId(e) {
    this.partnerService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionsInterPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
        } else {
          this.optionsInterPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
        }
      },
      error: e => { }
    });
  }


  IntermediateIdHandleFilter(e) {

    let partnerId = this.selectedInterPartners?.map(item => {
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
    this.loadRecords(lazyLoadEvent, 'intermediateId');
  }


  getOptionsUserId(e) {
    this.userService.getManyAsLovs(e.query).subscribe({
      next: data => {
        if (e.query) {
          this.optionUser = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
            .map(entity => ({ label: entity.name, value: entity._id }));
        } else {
          this.optionUser = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
        }
      },
      error: e => { }
    });
  }


  userHandleFilter(e) {

    let userId = this.selectedUsers?.map(item => {
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
        "rmUserId": userId
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent, 'rmUserId');
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
