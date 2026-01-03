import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscFixedPlateGlassFormComponent } from './bsc-fixed-plate-glass-form/bsc-fixed-plate-glass-form.component';
import { BscFixedPlateGlassListComponent } from './bsc-fixed-plate-glass-list/bsc-fixed-plate-glass-list.component';

const routes: Routes = [
  { path: "", component: BscFixedPlateGlassListComponent },
  { path: ":id", component: BscFixedPlateGlassFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscFixedPlateGlassRoutingModule { }
