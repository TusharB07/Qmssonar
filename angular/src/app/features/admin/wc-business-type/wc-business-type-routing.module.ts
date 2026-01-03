import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessTypeListComponent } from './wc-business-type-list/wc-business-type-list.component';
import { BusinessTypeFormComponent } from './wc-business-type-form/wc-business-type-form.component';



const routes: Routes = [

  { path: "", component: BusinessTypeListComponent },
  { path: ":id", component: BusinessTypeFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessTypeRoutingModule { }
