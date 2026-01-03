import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscAccompaniedBaggageListComponent } from './bsc-accompanied-baggage-list/bsc-accompanied-baggage-list.component';
import { BscAccompaniedBaggageFormComponent } from './bsc-accompanied-baggage-form/bsc-accompanied-baggage-form.component';


const routes: Routes = [
  { path: "", component: BscAccompaniedBaggageListComponent },
  { path: ":id", component: BscAccompaniedBaggageFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscAccompaniedBaggageRoutingModule { }
