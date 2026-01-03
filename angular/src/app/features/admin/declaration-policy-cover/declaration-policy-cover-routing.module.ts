import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DeclarationPolicyCoverFormComponent } from './declaration-policy-cover-form/declaration-policy-cover-form.component';
import { DeclarationPolicyCoverListComponent } from './declaration-policy-cover-list/declaration-policy-cover-list.component';


const routes: Routes = [

  { path: "", component: DeclarationPolicyCoverListComponent },  
  { path: ":id", component: DeclarationPolicyCoverFormComponent },  
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeclarationPolicyCoverRoutingModule { }
