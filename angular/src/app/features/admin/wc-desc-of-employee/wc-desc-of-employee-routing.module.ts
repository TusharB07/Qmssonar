import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WCDescriptionOfEmployeeListComponent } from './wc-desc-of-employee-list/wc-desc-of-employee-list.component';
import { WCDescriptionOfEmployeeFormComponent } from './wc-desc-of-employee-form/wc-desc-of-employee-form.component';



const routes: Routes = [

  { path: "", component: WCDescriptionOfEmployeeListComponent },
  { path: ":id", component: WCDescriptionOfEmployeeFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WCDescriptionOfEmployeeRoutingModule { }
