import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WCRatesListComponent } from './wc-rate-master-list/wc-rate-master-list.component';
import { WCRatesFormComponent } from './wc-rate-master-form/wc-rate-master-form.component';



const routes: Routes = [

  { path: "", component: WCRatesListComponent },
  { path: ":id", component: WCRatesFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WCRatesRoutingModule { }
