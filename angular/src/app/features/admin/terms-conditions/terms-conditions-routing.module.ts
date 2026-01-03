import { NgModule } from '@angular/core';
import { TermsConditionsListComponent } from './terms-conditions-list/terms-conditions-list.component';
import { TermsConditionsFormComponent } from './terms-conditions-form/terms-conditions-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", component: TermsConditionsListComponent },
  { path: ":id", component: TermsConditionsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsConditionsRoutingModule { }
