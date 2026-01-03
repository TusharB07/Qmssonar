import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscAccompaniedBaggageTypeListComponent } from './bsc-accompanied-baggage-type-list/bsc-accompanied-baggage-type-list.component';
import { BscAccompaniedBaggageTypeFormComponent } from './bsc-accompanied-baggage-type-form/bsc-accompanied-baggage-type-form.component';



@NgModule({
  declarations: [
    BscAccompaniedBaggageTypeListComponent,
    BscAccompaniedBaggageTypeFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BscAccompaniedBaggageTypeModule { }
