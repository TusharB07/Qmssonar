import { Component, Input, OnInit } from '@angular/core';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

    @Input() value: number

    @Input() maximumFractionDigits: number = 0

    @Input() minimumFractionDigits: number = 0

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
