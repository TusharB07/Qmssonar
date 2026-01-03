import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {ConveyanceListComponent } from './conveyance-list/conveyance-list.component';
import { ConveyanceFormComponent } from './conveyance-form/conveyance-form.component';



const routes: Routes = [

  { path: "", component: ConveyanceListComponent },
  { path: ":id", component: ConveyanceFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConveyanceRoutingModule { }
