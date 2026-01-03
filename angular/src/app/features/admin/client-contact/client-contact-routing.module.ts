import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientContactListComponent } from './client-contact-list/client-contact-list.component';
import { ClientContactFormComponent } from './client-contact-form/client-contact-form.component';

const routes: Routes = [
  { path: "", component: ClientContactListComponent },
  { path: ":id", component: ClientContactFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientContactRoutingModule { }
