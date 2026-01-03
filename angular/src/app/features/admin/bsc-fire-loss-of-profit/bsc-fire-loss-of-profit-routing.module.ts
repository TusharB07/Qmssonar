import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscFireLossOfProfitListComponent } from './bsc-fire-loss-of-profit-list/bsc-fire-loss-of-profit-list.component';
import { BscFireLossOfProfitFormComponent } from './bsc-fire-loss-of-profit-form/bsc-fire-loss-of-profit-form.component';


const routes: Routes = [
  { path: "", component: BscFireLossOfProfitListComponent },
  { path: ":id", component: BscFireLossOfProfitFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscFireLossOfProfitRoutingModule { }
