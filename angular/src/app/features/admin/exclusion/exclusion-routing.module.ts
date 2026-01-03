import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExclusionListComponent } from './exclusion-list/exclusion-list.component';
import { ExclusionFormComponent } from './exclusion-form/exclusion-form.component';



const routes: Routes = [

  { path: "", component: ExclusionListComponent },
  { path: ":id", component: ExclusionFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExclusionRoutingModule { }
