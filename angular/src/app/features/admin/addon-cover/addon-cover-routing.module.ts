import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AddonCoverListComponent } from "./addon-cover-list/addon-cover-list.component";
import { AddonCoverFormComponent } from "./addon-cover-form/addon-cover-form.component";
import { AddonCoverSectorFormComponent } from "../addon-cover-sector/addon-cover-sector-form/addon-cover-sector-form.component";

const routes: Routes = [
  { path: "", component: AddonCoverListComponent },
  { path: ":id", component: AddonCoverFormComponent },
  { path: ":addOnCoverId/addon-cover-sector/:id", component: AddonCoverSectorFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonCoverRoutingModule {}
