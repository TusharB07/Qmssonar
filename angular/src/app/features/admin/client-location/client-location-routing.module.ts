import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientLocationListComponent } from './client-location-list/client-location-list.component';
import { ClientLocationFormComponent } from './client-location-form/client-location-form.component';

const routes: Routes = [
  { path: "", component: ClientLocationListComponent },
  { path: ":id", component: ClientLocationFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientLocationRoutingModule { }
