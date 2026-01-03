import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuoteLocationOccupancyListComponent } from './quote-location-occupancy-list/quote-location-occupancy-list.component';
import { QuoteLocationOccupancyFormComponent } from './quote-location-occupancy-form/quote-location-occupancy-form.component';

const routes: Routes = [
  { path: "", component: QuoteLocationOccupancyListComponent },
  { path: ":id", component: QuoteLocationOccupancyFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteLocationOccupancyRoutingModule { }
