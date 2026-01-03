import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { BrokerModuleMappingService } from '../broker-module-mapping.service';
import { LazyLoadEvent } from 'primeng/api';
import { IBrokerModuleMapping } from '../broker-module-mapping.model';

@Component({
  selector: 'app-broker-module-mapping-list',
  templateUrl: './broker-module-mapping-list.component.html',
  styleUrls: ['./broker-module-mapping-list.component.css']
})
export class BrokerModuleMappingListComponent implements OnInit {
    recordPluralName = "Broker Module Mapping";
    modulePath: string = "/backend/admin/broker-module-mapping";
    commonFilters = {};
    specialFilters = {};
    loading: boolean;
    records: IBrokerModuleMapping[];
    totalRecords: number;
    selectAll: boolean = false;
    selectedRecords: IBrokerModuleMapping[] = [];

  constructor(private router: Router,private breadcrumbService: AppBreadcrumbService,private brokerModuleMappingService:BrokerModuleMappingService) { 
    this.breadcrumbService.setItems([
        { label: "Pages" },
        {
            label: this.recordPluralName,
            routerLink: [`${this.modulePath}`]
        }
    ]);
  }

  ngOnInit() {
  //   console.log("called")
  //   let lazyLoadEvent: LazyLoadEvent = {
  //     first: 0,
  //     rows: 20,
  //     sortField: null,
  //     sortOrder: 1,
  //     filters: {
  //     },
  //     globalFilter: null,
  //     multiSortMeta: null
  // }
  //   this.brokerModuleMappingService.getMany(lazyLoadEvent).subscribe((res)=>{
  //     console.log(res);
  //   })
  }
  loadRecords(event: LazyLoadEvent, name?: string) {
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

                if (element.value != null) {
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
    this.loading = true;
    this.brokerModuleMappingService.getMany(event).subscribe({
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
  createRecord() {
    this.router.navigateByUrl(`${this.modulePath}/new`);
}
editRecord(record) {
    this.router.navigateByUrl(`${this.modulePath}/${record._id}`);
}

}