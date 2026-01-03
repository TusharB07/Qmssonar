import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientLocationFormComponent } from '../client-location/client-location-form/client-location-form.component';
import { ClientContactFormComponent } from '../client-contact/client-contact-form/client-contact-form.component';

const routes: Routes = [
  { path: "", component: ClientListComponent },
  { path: ":id", component: ClientFormComponent },
  { path: ":clientId/client-locations/:id", component: ClientLocationFormComponent },
  { path: ":clientId/client-contacts/:id", component: ClientContactFormComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
