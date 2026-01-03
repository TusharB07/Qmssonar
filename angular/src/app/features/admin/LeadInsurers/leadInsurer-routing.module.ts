import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LeadInsurersListComponent } from './leadInsurer-list/leadInsurer-list.component';
import { LeadInsurersFormComponent } from './leadInsurer-form/leadInsurer-form.component';



const routes: Routes = [

  { path: "", component: LeadInsurersListComponent },
  { path: ":id", component: LeadInsurersFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadInsurersRoutingModule { }
