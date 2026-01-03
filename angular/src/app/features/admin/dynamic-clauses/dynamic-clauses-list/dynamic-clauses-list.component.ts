import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormMode, ILov } from 'src/app/app.model';
import { OPTIONS_BSC_TYPES } from '../../bsc-cover/bsc-cover.model';
import { DynamicClausesService } from '../dynamic-clauses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { IUser } from '../../user/user.model';
import { IBscClauses } from '../dynamic-clauses.model';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dynamic-clauses-list',
  templateUrl: './dynamic-clauses-list.component.html',
  styleUrls: ['./dynamic-clauses-list.component.scss']
})
export class DynamicClausesListComponent implements OnInit {

    id: string;
    mode: FormMode = "new";
    
    recordSingularName = "BSC Clause";
    recordPluralName = "BSC Clauses";
    modulePath: string = "/backend/admin/dynamic-clauses";

    optionsProducts: ILov[] = [];
    optionsBscTypes: ILov[];
    
    user: IUser;

    records : IBscClauses[];

    totalRecords: number;
  
    loading: boolean;
  
    selectedRecord: IBscClauses | null = null;
  
    selectedRecords: IBscClauses[] = [];
  
    selectAll: boolean = false;
  
    specialFilters = {};
    commonFilters = {};
    
    optionsPartners  : ILov[] = []
    selectedPartners: any[] = [];

    optionsProductId: any[];
    selectedProductId: any[];

  constructor(
    private recordService: DynamicClausesService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public partnerService: PartnerService,
    private accountService: AccountService
  ) { 
    this.optionsBscTypes = OPTIONS_BSC_TYPES;
        this.accountService.currentUser$.subscribe({
            next: (user) => {
                // this.role = user.roleId as IRole
                this.user = user
            }
        })
  }

  ngOnInit(): void {
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

  
  clear(table: Table) {
    this.selectedRecords = [];
    this.selectAll = false;
    table.clear();
}

}
