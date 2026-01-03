import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-edit-options-confirmation-dialog',
  templateUrl: './edit-options-confirmation-dialog.component.html',
  styleUrls: ['./edit-options-confirmation-dialog.component.scss']
})
export class EditOptionsConfimationDialogComponent implements OnInit {
  constructor(
    private config: DynamicDialogConfig,
    private routerService: Router,
    private quoteService : QuoteService,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    private quoteOptionService: QuoteOptionService
  ) { }

  ngOnInit(): void {
  }

  
  proceed() {
    this.ref.close()
    const payload : any = {
      quoteId:  this.config.data.quote._id,
      optionName: this.config.data.optionName
    }
    this.quoteService.quotePreviousPageRequistion(payload).subscribe(data => {
      console.log(data)
      // @ts-ignore
      if(data.status == 'success'){
        this.quoteService.getAllLiabilityQuoteOptions(data.data.entity._id).subscribe({
          next: (quoteOption) => {
            //this.routerService.navigateByUrl(`/backend/quotes/${this.config.data.quote._id}?quoteOptionId=${quoteOption.data.entity[0]._id}`)
            this.routerService.navigateByUrl(`/backend/quotes/${this.config.data.quote._id}?quoteOptionId=${this.config.data.selectedTemplateId}`)
          },
          error: e => { }
        })
      }
    })
  }

  close(){
    this.ref.close()
  }

}
