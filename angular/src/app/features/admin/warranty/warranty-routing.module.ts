import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WarrantyListComponent } from './warranty-list/warranty-list.component';
import { WarrantyFormComponent } from './warranty-form/warranty-form.component';



const routes: Routes = [

  { path: "", component: WarrantyListComponent },
  { path: ":id", component: WarrantyFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarrantyRoutingModule { }
