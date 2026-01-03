import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesCountsListComponent } from './employeesCount-list/employeesCount-list.component';
import { EmployeesCountsFormComponent } from './employeesCount-form/employeesCount-form.component';



const routes: Routes = [

  { path: "", component: EmployeesCountsListComponent },
  { path: ":id", component: EmployeesCountsFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesCountsRoutingModule { }
