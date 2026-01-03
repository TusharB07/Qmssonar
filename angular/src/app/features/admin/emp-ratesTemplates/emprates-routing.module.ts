import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmpRatesListComponent } from './emprates-list/emprates-list.component';
import { EmpRatesFormComponent } from './emprates-form/emprates-form.component';



const routes: Routes = [

  { path: "", component: EmpRatesListComponent },
  { path: ":id", component: EmpRatesFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpRatesRoutingModule { }
