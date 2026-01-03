import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicClausesListComponent } from './dynamic-clauses-list/dynamic-clauses-list.component';
import { DynamicClausesFormComponent } from './dynamic-clauses-form/dynamic-clauses-form.component';

const routes: Routes = [
  
  { path: "", component:  DynamicClausesListComponent},
  { path: ":id", component:  DynamicClausesFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicClausesRoutingModule { }
