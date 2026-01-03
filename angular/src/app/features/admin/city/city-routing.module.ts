import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CityListComponent } from "./city-list/city-list.component";
import { CityFormComponent } from "./city-form/city-form.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", component: CityListComponent },
  { path: ":id", component: CityFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule {}
