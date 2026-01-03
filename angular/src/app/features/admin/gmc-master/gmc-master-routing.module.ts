import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GmcMasterFormComponent } from "./gmc-master-form/gmc-master-form.component";
import { GMCMasterListComponent } from "./gmc-partner-list/gmc-master-list.component";

const routes: Routes = [
  { path: ":id", component: GmcMasterFormComponent },
  { path: "", component: GMCMasterListComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GmcMasterRoutingModule { }
