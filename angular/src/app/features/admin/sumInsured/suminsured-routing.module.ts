import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SumInsuredListComponent } from './suminsured-list/suminsured-list.component';
import { SuminsuredFormComponent } from './suminsured-form/suminsured-form.component';



const routes: Routes = [

  { path: "", component: SumInsuredListComponent },
  { path: ":id", component: SuminsuredFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SumInsuredRoutingModule { }
