import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StateListComponent } from './state-list/state-list.component';
import { StateFormComponent } from './state-form/state-form.component';

const routes: Routes = [
  { path: "", component: StateListComponent },
  { path: ":id", component: StateFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateRoutingModule { }
