import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-edit-sum-si-confimation-dialog',
  templateUrl: './edit-sum-si-confimation-dialog.component.html',
  styleUrls: ['./edit-sum-si-confimation-dialog.component.scss']
})
export class EditSumSiConfimationDialogComponent implements OnInit {

  selectedLocation: any

  sumAssured: number = 0

  constructor(
    private config: DynamicDialogConfig,
    private routerService: Router,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    private quoteService: QuoteService,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    private quoteOptionService: QuoteOptionService
  ) { }

  ngOnInit(): void {
  }


  proceed() {
    this.ref.close()
    const payload: any = {
      quoteId: this.config.data.quote._id
    }
    this.quoteService.quotePreviousPageRequistion(payload).subscribe(data => {
      if (data.status == 'success') {
        this.quoteOptionService.getAllOptionsByQuoteId(data.data.entity._id).subscribe({
          next: (quoteOption) => {
            this.routerService.navigateByUrl(`/backend/quotes/${this.config.data.quote._id}?quoteOptionId=${quoteOption.data.entities[0]._id}`)
          },
          error: e => { }
        })
      }
    })
  }

  close() {
    this.ref.close()
  }

}
