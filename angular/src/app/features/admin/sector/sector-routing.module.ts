import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SectorListComponent } from "./sector-list/sector-list.component";
import { SectorFormComponent } from "./sector-form/sector-form.component";

const routes: Routes = [
  { path: "", component: SectorListComponent },
  { path: ":id", component: SectorFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectorRoutingModule {}
