import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClausesHeadsListComponent } from './clausesHeads-list/clausesHeads-list.component';
import { ClausesHeadsFormComponent } from './clausesHeads-form/clausesHeads-form.component';



const routes: Routes = [

  { path: "", component: ClausesHeadsListComponent },
  { path: ":id", component: ClausesHeadsFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClausesHeadsRoutingModule { }
