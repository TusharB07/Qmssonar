import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HazardCategoryListComponent } from "./hazard-category-list/hazard-category-list.component";
import { HazardCategoryFormComponent } from "./hazard-category-form/hazard-category-form.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", component: HazardCategoryListComponent },
  { path: ":id", component: HazardCategoryFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HazardCategoryRoutingModule {}
