import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscPortableEquipmentTypeListComponent } from './bsc-portable-equipment-type-list/bsc-portable-equipment-type-list.component';
import { BscPortableEquipmentTypeFormComponent } from './bsc-portable-equipment-type-form/bsc-portable-equipment-type-form.component';



@NgModule({
  declarations: [
    BscPortableEquipmentTypeListComponent,
    BscPortableEquipmentTypeFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BscPortableEquipmentTypeModule { }
