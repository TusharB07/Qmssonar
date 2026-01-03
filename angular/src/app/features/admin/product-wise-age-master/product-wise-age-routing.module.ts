import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProduxtWiseAgeListComponent } from './product-wise-age-list/product-wise-age-list.component';
import { ProductWiseAgeFormComponent } from './product-wise-age-form/product-wise-age-form.component';



const routes: Routes = [

  { path: "", component: ProduxtWiseAgeListComponent },
  { path: ":id", component: ProductWiseAgeFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductWiseAgeRoutingModule { }
