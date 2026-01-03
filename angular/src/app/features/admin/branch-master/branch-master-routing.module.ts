import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { BranchMasterListComponent } from "./branch-master-list/branch-master-list.component";
import { BranchMasterFormComponent } from "./branch-master-form/branch-master-form.component";

const routes: Routes = [
  { path: "", component: BranchMasterListComponent },
  { path: ":id", component: BranchMasterFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchMasterRoutingModule {}
