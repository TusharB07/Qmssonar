import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PackagingListComponent } from './packaging-list/packaging-list.component';
import { PackagingFormComponent } from './packaging-form/packaging-form.component';



const routes: Routes = [

  { path: "", component: PackagingListComponent },
  { path: ":id", component: PackagingFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagingRoutingModule { }
