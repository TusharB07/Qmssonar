import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { IndustryTypeListComponent } from "./industry-type-list/industry-type-list.component";
import { IndustryTypeFormComponent } from "./industry-type-form/industry-type-form.component";

const routes: Routes = [
  { path: "", component: IndustryTypeListComponent },
  { path: ":id", component: IndustryTypeFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryTypeRoutingModule {}
