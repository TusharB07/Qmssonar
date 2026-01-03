import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscBurglaryAndHousebreakingFormComponent } from './bsc-burglary-and-housebreaking-form/bsc-burglary-and-housebreaking-form.component';
import { BscBurglaryAndHousebreakingListComponent } from './bsc-burglary-and-housebreaking-list/bsc-burglary-and-housebreaking-list.component';

const routes: Routes = [
  { path: "", component: BscBurglaryAndHousebreakingListComponent },
  { path: ":id", component: BscBurglaryAndHousebreakingFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscBurglaryAndHousebreakingRoutingModule { }
