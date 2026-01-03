import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { BscCoverListComponent } from "./bsc-cover-list/bsc-cover-list.component";
import { BscCoverFormComponent } from "./bsc-cover-form/bsc-cover-form.component";

const routes: Routes = [
    { path: "", component: BscCoverListComponent },
    { path: ":id", component: BscCoverFormComponent }
  ];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscCoverRoutingModule {}
