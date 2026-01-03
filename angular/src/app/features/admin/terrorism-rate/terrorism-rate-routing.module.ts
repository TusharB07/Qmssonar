import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TerrorismRateListComponent } from "./terrorism-rate-list/terrorism-rate-list.component";
import { TerrorismRateFormComponent } from "./terrorism-rate-form/terrorism-rate-form.component";

const routes: Routes = [
  { path: "", component: TerrorismRateListComponent },
  { path: ":id", component: TerrorismRateFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerrorismRateRoutingModule {}
