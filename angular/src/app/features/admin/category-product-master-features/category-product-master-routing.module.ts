import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryProductMasterFormComponent } from './category-product-master-form/category-product-master-form.component';
import { CategoryProductMasterListComponent } from './category-product-master-list/category-product-master-list.component';

const routes: Routes = [
  { path: "", component: CategoryProductMasterListComponent },
  { path: ":id", component: CategoryProductMasterFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryProductMasterRoutingModule { }
