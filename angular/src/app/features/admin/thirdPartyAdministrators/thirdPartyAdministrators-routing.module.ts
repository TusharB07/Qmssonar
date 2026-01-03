import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ThirdPartyAdministratorsListComponent } from './thirdPartyAdministrators-list/thirdPartyAdministrators-list.component';
import { ThirdPartyAdministratorsFormComponent } from './thirdPartyAdministrators-form/thirdPartyAdministrators-form.component';



const routes: Routes = [

  { path: "", component: ThirdPartyAdministratorsListComponent },
  { path: ":id", component: ThirdPartyAdministratorsFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThirdPartyAdministratorsRoutingModule { }
