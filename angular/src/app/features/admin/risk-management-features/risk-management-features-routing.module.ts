import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RiskManagementFeaturesFormComponent } from './risk-management-features-form/risk-management-features-form.component';
import { RiskManagementFeaturesListComponent } from './risk-management-features-list/risk-management-features-list.component';

const routes: Routes = [
  { path: "", component: RiskManagementFeaturesListComponent },
  { path: ":id", component: RiskManagementFeaturesFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementFeaturesRoutingModule { }
