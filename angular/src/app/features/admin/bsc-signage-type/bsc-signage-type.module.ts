import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscSignageTypeListComponent } from './bsc-signage-type-list/bsc-signage-type-list.component';
import { BscSignageTypeFormComponent } from './bsc-signage-type-form/bsc-signage-type-form.component';



@NgModule({
  declarations: [
    BscSignageTypeListComponent,
    BscSignageTypeFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BscSignageTypeModule { }
