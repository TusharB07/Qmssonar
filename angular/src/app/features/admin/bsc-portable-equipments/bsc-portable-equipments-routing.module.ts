import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscPortableEquipmentsListComponent } from './bsc-portable-equipments-list/bsc-portable-equipments-list.component';
import { BscPortableEquipmentsFormComponent } from './bsc-portable-equipments-form/bsc-portable-equipments-form.component';

const routes: Routes = [
  { path: "", component: BscPortableEquipmentsListComponent },
  { path: ":id", component: BscPortableEquipmentsFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscPortableEquipmentsRoutingModule { }
