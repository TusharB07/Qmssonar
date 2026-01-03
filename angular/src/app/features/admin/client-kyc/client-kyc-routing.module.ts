import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientKycListComponent } from './client-kyc-list/client-kyc-list.component';
import { ClientKycFormComponent } from './client-kyc-form/client-kyc-form.component';

const routes: Routes = [
  { path: "", component: ClientKycListComponent },
  { path: ":id", component: ClientKycFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientKycRoutingModule { }
