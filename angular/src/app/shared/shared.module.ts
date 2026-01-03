import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './currency/currency.component';
import { TooltipModule } from 'primeng/tooltip';
import {CategoryNamesService} from "./category-names.service.ts";
import { CurrencydollarRuppeComponent } from './currency/currency-dollar-repee.component';



@NgModule({
  declarations: [
    CurrencyComponent,
    CurrencydollarRuppeComponent
],
imports: [
    CommonModule,
    TooltipModule
  ],
  exports: [
    CurrencyComponent,
    CurrencydollarRuppeComponent
  ],
    providers:[CategoryNamesService]
})
export class SharedModule { }
