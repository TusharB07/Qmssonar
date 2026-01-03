import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscFidelityGuranteeListComponent } from './bsc-fidelity-gurantee-list/bsc-fidelity-gurantee-list.component';
import { BscFidelityGuranteeFormComponent } from './bsc-fidelity-gurantee-form/bsc-fidelity-gurantee-form.component';

const routes: Routes = [
  { path: "", component: BscFidelityGuranteeListComponent },
  { path: ":id", component: BscFidelityGuranteeFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscFidelityGuranteeRoutingModule { }
