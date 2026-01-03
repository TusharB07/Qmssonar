import { OnDestroy } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IOneResponseDto } from 'src/app/app.model';

@Component({
    selector: 'app-other-details-liability-crud-card',
    templateUrl: './other-details-liability-crud-card.component.html',
    styleUrls: ['./other-details-liability-crud-card.component.scss']
})
export class OtherDetailsLiabilityCrudCardComponent implements OnInit{

    @Input() quote: IQuoteSlip 
    
    ngOnInit(): void {
    }

}
