import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuoteLocationAddonListComponent } from './quote-location-addon-list/quote-location-addon-list.component';
import { QuoteLocationAddonFormComponent } from './quote-location-addon-form/quote-location-addon-form.component';


const routes: Routes = [
  { path: "", component: QuoteLocationAddonListComponent },
  { path: ":id", component: QuoteLocationAddonFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteLocationAddonRoutingModule { }
