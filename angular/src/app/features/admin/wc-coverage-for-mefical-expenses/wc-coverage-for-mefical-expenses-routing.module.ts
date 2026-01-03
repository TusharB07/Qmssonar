import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {WCCoverageForMedicalExpensesListComponent  } from './wc-coverage-for-mefical-expenses-list/wc-coverage-for-mefical-expenses-list.component';
import { WCCoverageForMedicalExpensesFormComponent } from './wc-coverage-for-mefical-expenses-form/wc-coverage-for-mefical-expenses-form.component';



const routes: Routes = [

  { path: "", component: WCCoverageForMedicalExpensesListComponent },
  { path: ":id", component: WCCoverageForMedicalExpensesFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WCCoverageForMedicalExpensesRoutingModule { }
