import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscLiabilityListComponent } from './bsc-liability-list/bsc-liability-list.component';
import { BscLiabilityFormComponent } from './bsc-liability-form/bsc-liability-form.component';

const routes: Routes = [
  { path: "", component: BscLiabilityListComponent },
  { path: ":id", component: BscLiabilityFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscLiabilityRoutingModule { }
