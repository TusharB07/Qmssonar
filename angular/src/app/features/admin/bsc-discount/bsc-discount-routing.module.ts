import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { BscDiscountFormComponent } from "./bsc-discount-form/bsc-discount-form.component";
import { BscDiscountListComponent } from "./bsc-discount-list/bsc-discount-list.component";

const routes: Routes = [
  { path: "", component: BscDiscountListComponent },
  { path: ":id", component: BscDiscountFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscDiscountRoutingModule {}
