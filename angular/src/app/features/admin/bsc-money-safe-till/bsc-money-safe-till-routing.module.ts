import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BscMoneySafeTillListComponent } from './bsc-money-safe-till-list/bsc-money-safe-till-list.component';
import { BscMoneySafeTillFormComponent } from './bsc-money-safe-till-form/bsc-money-safe-till-form.component';

const routes: Routes = [
  { path: "", component: BscMoneySafeTillListComponent },
  { path: ":id", component: BscMoneySafeTillFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BscMoneySafeTillRoutingModule { }
