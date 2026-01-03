import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOneResponseDto } from 'src/app/app.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
    selector: 'app-quote-slip-pdf-preview',
    templateUrl: './quote-slip-pdf-preview.component.html',
    styleUrls: ['./quote-slip-pdf-preview.component.scss']
})
export class QuoteSlipPdfPreviewComponent implements OnInit {

    id: string;
    quote: IQuoteSlip;

    constructor(
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,

    ) { }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.quoteService.get(this.id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // console.log(dto.data.entity)
                this.quote = dto.data.entity

                if(this.quote) setTimeout(() => {
                    (window).print();
                },1000)
            },
            error: e => {
                console.log(e);
            }
        });


    }

}
