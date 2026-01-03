import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IEmployeeData, IEmployeesDemoSummary, IQuoteSlip } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';

@Component({
  selector: 'app-quote-gmc-employeeview-dialog',
  templateUrl: './quote-gmc-employeeview-dialog.component.html',
  styleUrls: ['./quote-gmc-employeeview-dialog.component.scss']
})
export class QuoteGmcEmployeeviewDialogComponent implements OnInit {
  quote: IQuoteSlip;
  employeeInfo:IEmployeesDemoSummary[]=[];
  todaysdate: Date = new Date()
  fileUploadType:string=""

  constructor( 
    public config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private quoteService:QuoteService, private messageService:MessageService) {
   
   }

  ngOnInit(): void {
    this.quote = this.config.data.quote;
    this.fileUploadType=this.config.data.fileUploadType;

    // if(this.quote?.employeeDataId['employeeData'].length>0)
    // {
    //   this.employeeInfo=this.quote?.employeeDataId['employeeData'];
     
    // }
    this.getEmployeesDemographySummary();
  }
  getselfCountTotal(){
    return this.employeeInfo.map(item => item.selfCount).reduce((prev, next) => prev + next)
  }

  getspouseCount(){
    return this.employeeInfo.map(item => item.spouseCount).reduce((prev, next) => prev + next)
  }

  
  getEmployeesDemographySummary() {
    let payload = {};
    payload['quoteId'] = this.config.data.quote?._id;
    payload['fileType'] =  this.fileUploadType;
    this.quoteService.viewEmployeesSummary(payload).subscribe({
      next: summary => {
        if(summary.status=="success")
        {
        this.employeeInfo = summary.data.entities;
        }else
        {
          this.messageService.add({
            severity: 'fail',
            summary: "Failed to Show",
            detail: `${summary.status}`, //"error" TODO: Check
        })
        }
      }
    })
  }
}
