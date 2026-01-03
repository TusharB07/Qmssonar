import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InterestListComponent } from './interest-list/interest-list.component';
import { InterestFormComponent } from './interest-form/interest-form.component';



const routes: Routes = [

  { path: "", component: InterestListComponent },
  { path: ":id", component: InterestFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterestRoutingModule { }
