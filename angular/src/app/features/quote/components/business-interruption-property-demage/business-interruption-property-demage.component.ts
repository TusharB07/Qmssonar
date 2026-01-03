import { Component, Input, OnInit } from '@angular/core';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-business-interruption-property-demage',
  templateUrl: './business-interruption-property-demage.component.html',
  styleUrls: ['./business-interruption-property-demage.component.scss']
})
export class BusinessInterruptionPropertyDemageComponent implements OnInit {
    @Input() quote: IQuoteSlip;

  constructor() { }

  ngOnInit(): void {
  }

}
