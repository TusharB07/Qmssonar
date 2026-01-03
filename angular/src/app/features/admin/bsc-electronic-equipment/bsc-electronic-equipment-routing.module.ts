import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscElectronicEquipmentListComponent } from './bsc-electronic-equipment-list/bsc-electronic-equipment-list.component';
import { BscElectronicEquipmentFormComponent } from './bsc-electronic-equipment-form/bsc-electronic-equipment-form.component';


const routes: Routes = [
  { path: "", component: BscElectronicEquipmentListComponent },
  { path: ":id", component: BscElectronicEquipmentFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BscElectronicEquipmentRoutingModule { }
