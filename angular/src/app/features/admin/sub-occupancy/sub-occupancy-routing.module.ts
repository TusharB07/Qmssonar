import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubOccupancyListComponent } from './sub-occupancy-list/sub-occupancy-list.component';
import { SubOccupancyFormComponent } from './sub-occupancy-form/sub-occupancy-form.component';

const routes: Routes = [
  { path: "", component: SubOccupancyListComponent },
  { path: ":id", component: SubOccupancyFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubOccupancyRoutingModule { }
