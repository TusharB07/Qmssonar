import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientGroupListComponent } from './client-group-list/client-group-list.component';
import { ClientGroupFormComponent } from './client-group-form/client-group-form.component';

const routes: Routes = [
  { path: "", component: ClientGroupListComponent },
  { path: ":id", component: ClientGroupFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientGroupRoutingModule { }
