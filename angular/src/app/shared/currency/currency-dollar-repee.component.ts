import { Component, Input, OnInit } from '@angular/core';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-currency-dollar-repee',
    templateUrl: './currency-dollar-repee.component.html',
    styleUrls: ['./currency-dollar-repee.component.scss']
})
export class CurrencydollarRuppeComponent implements OnInit {

    @Input() value: number

    @Input() maximumFractionDigits: number = 0

    @Input() minimumFractionDigits: number = 0
    @Input() selectedCurrencyDollar: boolean =false
    @Input() rate: number = 0
    Number = Number;

    toWord = new ToWords();


    constructor(
    ) {

    }

    ngOnInit(): void {
        if (this.minimumFractionDigits > this.maximumFractionDigits) {
            this.minimumFractionDigits = this.maximumFractionDigits
        }

    }

}
