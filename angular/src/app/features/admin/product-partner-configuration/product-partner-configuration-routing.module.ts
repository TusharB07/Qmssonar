import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductPartnerConfigurationListComponent } from './product-partner-configuration-list/product-partner-configuration-list.component';
import { ProductPartnerConfigurationFormComponent } from './product-partner-configuration-form/product-partner-configuration-form.component';

const routes: Routes = [

  { path: "", component: ProductPartnerConfigurationListComponent },
  { path: ":id", component: ProductPartnerConfigurationFormComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPartnerConfigurationRoutingModule { }
