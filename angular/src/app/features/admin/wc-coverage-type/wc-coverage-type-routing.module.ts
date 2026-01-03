import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {WCCoverageTypeListComponent  } from './wc-coverage-type-list/wc-coverage-type-list.component';
import { WCCoverageTypeFormComponent } from './wc-coverage-type-form/wc-coverage-type-form.component';



const routes: Routes = [

  { path: "", component: WCCoverageTypeListComponent },
  { path: ":id", component: WCCoverageTypeFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WCCoverageTypeRoutingModule { }
