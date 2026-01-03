import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClausesListComponent } from './clauses-list/clauses-list.component';
import { ClausesFormComponent } from './clauses-form/clauses-form.component';



const routes: Routes = [

  { path: "", component: ClausesListComponent },
  { path: ":id", component: ClausesFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClausesRoutingModule { }
