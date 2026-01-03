import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { DistrictListComponent } from "./district-list/district-list.component";
import { DistrictFormComponent } from "./district-form/district-form.component";

const routes: Routes = [
  { path: "", component: DistrictListComponent },
  { path: ":id", component: DistrictFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistrictRoutingModule {}
