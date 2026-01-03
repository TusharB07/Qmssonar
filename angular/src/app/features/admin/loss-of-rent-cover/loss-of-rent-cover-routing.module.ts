import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LossOfRentCoverFormComponent } from './loss-of-rent-cover-form/loss-of-rent-cover-form.component';
import { LossOfRentCoverListComponent } from './loss-of-rent-cover-list/loss-of-rent-cover-list.component';


const routes: Routes = [

  { path: "", component: LossOfRentCoverListComponent },
  { path: ":id", component: LossOfRentCoverFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LossOfRentCoverRoutingModule { }
