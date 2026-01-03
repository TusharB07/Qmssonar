import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalarySlabsListComponent } from './wc-salary-slabs-list/wc-salary-slabs-list.component';
import { SalarySlabsFormComponent } from './wc-salary-slabs-form/wc-salary-slabs-form.component';



const routes: Routes = [

  { path: "", component: SalarySlabsListComponent },
  { path: ":id", component: SalarySlabsFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalarySlabsRoutingModule { }
