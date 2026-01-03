import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CoverageTypesListComponent } from './coveragetypes-list/coveragetypes-list.component';
import { CoverageTypesFormComponent } from './coveragetypes-form/coveragetypes-form.component';



const routes: Routes = [

  { path: "", component: CoverageTypesListComponent },
  { path: ":id", component: CoverageTypesFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoverageTypesRoutingModule { }
