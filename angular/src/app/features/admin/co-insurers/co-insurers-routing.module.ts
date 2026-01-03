import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoInsurersFormComponent } from './co-insurers-form/co-insurers-form.component';
import { CoInsurersListComponent } from './co-insurers-list/co-insurers-list.component';

const routes: Routes = [
  { path: "", component: CoInsurersListComponent },
  { path: ":id", component: CoInsurersFormComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoInsurersRoutingModule { }
