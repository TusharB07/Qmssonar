import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AddOnCoverOptionsListComponent } from "./add-ons-covers-ddl-options-list/add-ons-covers-ddl-options-list.component";
import { AddOnCoverOptionsFormComponent } from "./add-ons-covers-ddl-options-form/add-ons-covers-ddl-options.component";

const routes: Routes = [
  { path: "", component: AddOnCoverOptionsListComponent },
  { path: ":id", component: AddOnCoverOptionsFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddOnCoverOptionsRoutingModule {}
