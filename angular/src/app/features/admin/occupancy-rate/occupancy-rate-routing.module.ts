import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { OccupancyRateListComponent } from "./occupancy-rate-list/occupancy-rate-list.component";
import { OccupancyRateFormComponent } from "./occupancy-rate-form/occupancy-rate-form.component";

const routes: Routes = [
  { path: "", component: OccupancyRateListComponent },
  { path: ":id", component: OccupancyRateFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OccupancyRateRoutingModule {}
