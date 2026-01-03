import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscProductPartnerConfigurationListComponent } from './bsc-product-partner-configuration-list/bsc-product-partner-configuration-list.component';
import { BscProductPartnerConfigurationFormComponent } from './bsc-product-partner-configuration-form/bsc-product-partner-configuration-form.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [

  { path: "", component: BscProductPartnerConfigurationListComponent },
  { path: ":id", component: BscProductPartnerConfigurationFormComponent },  
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscProductPartnerConfigurationRoutingModule { }
