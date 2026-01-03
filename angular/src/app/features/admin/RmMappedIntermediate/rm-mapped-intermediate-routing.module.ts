import { RmMappedIntermediateFormComponent } from './rm-mapped-intermediate-form/rm-mapped-intermediate-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RmMappedIntermediateListComponent } from './rm-mapped-intermediate-list/rm-mapped-intermediate-list.component';

const routes: Routes = [
  { path: "", component: RmMappedIntermediateListComponent },
  { path: ":id", component: RmMappedIntermediateFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmMappedIntermediateRoutingModule { }
