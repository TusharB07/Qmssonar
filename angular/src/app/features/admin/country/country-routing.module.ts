import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CountryListComponent } from "./country-list/country-list.component";
import { CountryFormComponent } from "./country-form/country-form.component";

const routes: Routes = [
  { path: "", component: CountryListComponent },
  { path: ":id", component: CountryFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule {}
