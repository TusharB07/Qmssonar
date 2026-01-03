import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AddonCoverSectorListComponent } from "./addon-cover-sector-list/addon-cover-sector-list.component";
import { AddonCoverSectorFormComponent } from "./addon-cover-sector-form/addon-cover-sector-form.component";

const routes: Routes = [
  { path: "", component: AddonCoverSectorListComponent },
  { path: ":id", component: AddonCoverSectorFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonCoverSectorRoutingModule {}
