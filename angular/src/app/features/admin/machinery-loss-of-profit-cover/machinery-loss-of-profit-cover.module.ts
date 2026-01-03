import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineryLossOfProfitCoverListComponent } from './machinery-loss-of-profit-cover-list/machinery-loss-of-profit-cover-list.component';
import { MachineryLossOfProfitCoverFormComponent } from './machinery-loss-of-profit-cover-form/machinery-loss-of-profit-cover-form.component';



@NgModule({
  declarations: [
    MachineryLossOfProfitCoverListComponent,
    MachineryLossOfProfitCoverFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MachineryLossOfProfitCoverModule { }
