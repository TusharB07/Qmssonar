import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { EarthquakeRateListComponent } from "./earthquake-rate-list/earthquake-rate-list.component";
import { EarthquakeRateFormComponent } from "./earthquake-rate-form/earthquake-rate-form.component";

const routes: Routes = [
  { path: "", component: EarthquakeRateListComponent },
  { path: ":id", component: EarthquakeRateFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarthquakeRateRoutingModule {}
