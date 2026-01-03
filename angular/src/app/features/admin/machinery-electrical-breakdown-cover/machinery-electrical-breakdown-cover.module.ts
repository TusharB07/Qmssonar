import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineryElectricalBreakdownCoverListComponent } from '../machinery-electrical-breadown-cover/machinery-electrical-breakdown-cover-list/machinery-electrical-breakdown-cover-list.component';
import { MachineryElectricalBreakdownCoverFormComponent } from '../machinery-electrical-breadown-cover/machinery-electrical-breakdown-cover-form/machinery-electrical-breakdown-cover-form.component';



@NgModule({
  declarations: [
    MachineryElectricalBreakdownCoverListComponent,
    MachineryElectricalBreakdownCoverFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MachineryElectricalBreakdownCoverModule { }
