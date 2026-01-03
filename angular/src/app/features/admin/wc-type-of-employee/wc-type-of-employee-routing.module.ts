import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WCTypeOfEmployeeListComponent } from './wc-type-of-employee-list/wc-type-of-employee-list.component';
import { WCTypeOfEmployeeFormComponent } from './wc-type-of-employee-form/wc-type-of-employee-form.component';



const routes: Routes = [

  { path: "", component: WCTypeOfEmployeeListComponent },
  { path: ":id", component: WCTypeOfEmployeeFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WCTypeOfEmployeeRoutingModule { }
