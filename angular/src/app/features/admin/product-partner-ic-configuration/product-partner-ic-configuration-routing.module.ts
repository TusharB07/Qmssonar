import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { ProductPartnerIcConfigurationListComponent } from './product-partner-ic-configuration-list/product-partner-ic-configuration-list.component';
import { ProductPartnerIcConfigurationFormComponent } from './product-partner-ic-configuration-form/product-partner-ic-configuration-form.component';


const routes: Routes = [

  { path: "", component: ProductPartnerIcConfigurationListComponent },
  { path: ":id", component: ProductPartnerIcConfigurationFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPartnerIcConfigurationRoutingModule { }
