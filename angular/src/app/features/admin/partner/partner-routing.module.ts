import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PartnerListComponent } from "./partner-list/partner-list.component";
import { PartnerFormComponent } from "./partner-form/partner-form.component";
import { RouterModule, Routes } from "@angular/router";
import { ProductPartnerConfigurationFormComponent } from "../product-partner-configuration/product-partner-configuration-form/product-partner-configuration-form.component";

const routes: Routes = [
  { path: "", component: PartnerListComponent },
  { path: ":id", component: PartnerFormComponent },
  { path: ":partnerId/product-partner-configuration/:id", component: ProductPartnerConfigurationFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule {}
