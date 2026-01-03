import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PincodeListComponent } from "./pincode-list/pincode-list.component";
import { PincodeFormComponent } from "./pincode-form/pincode-form.component";

const routes: Routes = [
  { path: "", component: PincodeListComponent },
  { path: ":id", component: PincodeFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PincodeRoutingModule {}
