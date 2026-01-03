import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscMoneyTransitListComponent } from './bsc-money-transit-list/bsc-money-transit-list.component';
import { BscMoneyTransitFormComponent } from './bsc-money-transit-form/bsc-money-transit-form.component';

const routes: Routes = [
  { path: "", component: BscMoneyTransitListComponent },
  { path: ":id", component: BscMoneyTransitFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BscMoneyTransitRoutingModule { }
