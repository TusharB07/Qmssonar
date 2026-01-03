import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-business-suraksha-covers',
  templateUrl: './business-suraksha-covers.component.html',
  styleUrls: ['./business-suraksha-covers.component.scss']
})
export class BusinessSurakshaCoversComponent implements OnInit {

//   quoteId: string = '';
  quote: IQuoteSlip;

  private currentQuote: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
  ) {
    // this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
        console.log('its here')
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

//   previousPage(){
//     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/add-on`);
//   }
//   nextPage(){
//     this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/risk-inspection`);
//   }

}
