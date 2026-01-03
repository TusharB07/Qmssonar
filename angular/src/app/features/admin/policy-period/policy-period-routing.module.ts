import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyPeriodListComponent } from './policy-period-list/policy-period-list.component';
import { PolicyPeriodFormComponent } from './policy-period-form/policy-period-form.component';

const routes: Routes = [
  { path: "", component: PolicyPeriodListComponent },
  { path: ":id", component: PolicyPeriodFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyPeriodRoutingModule { }
