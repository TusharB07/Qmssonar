import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscSignageListComponent } from './bsc-signage-list/bsc-signage-list.component';
import { BscSignageFormComponent } from './bsc-signage-form/bsc-signage-form.component';

const routes: Routes = [
  { path: "", component: BscSignageListComponent },
  { path: ":id", component: BscSignageFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscSignageRoutingModule { }
