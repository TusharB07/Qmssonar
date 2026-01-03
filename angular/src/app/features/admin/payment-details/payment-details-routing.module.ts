import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentDetailsListComponent } from './payment-details-list/payment-details-list.component';

const routes: Routes = [
  { path: "", component: PaymentDetailsListComponent },
  // { path: ":id", component: PaymentDetailsListComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentDetailsRoutingModule { }
