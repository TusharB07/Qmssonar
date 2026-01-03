import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuoteLocationBreakupMasterListComponent } from './quote-location-breakup-master-list/quote-location-breakup-master-list.component';
import { QuoteLocationBreakupMasterFormComponent } from './quote-location-breakup-master-form/quote-location-breakup-master-form.component';

const routes: Routes = [
  { path: "", component: QuoteLocationBreakupMasterListComponent },
  { path: ":id", component: QuoteLocationBreakupMasterFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteLocationBreakupMasterRoutingModule { }
