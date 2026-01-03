import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransitTypeListComponent } from './transitType-list/transitType-list.component';
import { TransitTypeFormComponent } from './transitType-form/transitType-form.component';



const routes: Routes = [

  { path: "", component: TransitTypeListComponent },
  { path: ":id", component: TransitTypeFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransitTypeRoutingModule { }
