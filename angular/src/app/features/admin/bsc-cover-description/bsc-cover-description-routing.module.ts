import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BscCoverDescriptionListComponent } from "./bsc-cover-description-list/bsc-cover-description-list.component";
import { BscCoverDescriptionFormComponent } from "./bsc-cover-description-form/bsc-cover-description-form.component";

const routes: Routes = [
    { path: "", component: BscCoverDescriptionListComponent },
    { path: ":id", component: BscCoverDescriptionFormComponent }
  ];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscCoverDescriptionRoutingModule {}
