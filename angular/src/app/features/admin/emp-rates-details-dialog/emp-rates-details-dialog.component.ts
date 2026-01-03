import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService  } from 'primeng/dynamicdialog';

import { IEmpRates } from '../emp-ratesTemplates/emprates.model';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-emp-rates-details-dialog',
  templateUrl: './emp-rates-details-dialog.component.html',
  styleUrls: ['./emp-rates-details-dialog.component.scss']
})
export class EMPRatesDetailsDialogComponent implements OnInit {
  
 
  employeeInfo:any[]=[];
  data: IEmpRates;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dialogService: DialogService
  ) {

    this.data = this.config.data.emprates;
    
      for(let ci = 0; ci < this.data.SIRatesData.length; ci++) {     
        for(let ri = 0; ri < this.data.SIRatesData[ci].siRates.length; ri++) {
          var obj={
            countFrom:this.data.countFrom,
            countTo:this.data.countTo,
            employeesCount:this.data.employeesCount,
            sumInsured:this.data.SIRatesData[ci].sumInsured,
            relation:this.data.SIRatesData[ci].siRates[ri].relation,
            ageFrom:this.data.SIRatesData[ci].siRates[ri].ageFrom,
            ageTo:this.data.SIRatesData[ci].siRates[ri].ageTo,
            ageband:this.data.SIRatesData[ci].siRates[ri].ageband,
            premium:this.data.SIRatesData[ci].siRates[ri].premium,
            };
            this.employeeInfo.push(obj);
        }
    }
  }
  ngOnInit(): void {
    
    //this.employeeInfo=[];
    // var obj={
    // countFrom:this.data.countFrom,
    // countTo:this.data.countTo,
    // employeesCount:this.data.employeesCount,
    // sumInsured:"",
    // relation:"",
    // ageFrom:"",
    // ageTo:"",
    // ageband:"",
    // premium:"",
 
    // };
        

   
  }

 

}
