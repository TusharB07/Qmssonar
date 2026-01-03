import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimExperienceFormComponent } from './claim-experience-form/claim-experience-form.component';
import { ClaimExperienceListComponent } from './claim-experience-list/claim-experience-list.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [

  { path: "", component: ClaimExperienceListComponent },
  // { path: "claint-experience-form", component: ClaimExperienceFormComponent },  
  { path: ":id", component: ClaimExperienceFormComponent },  
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimExperienceRoutingModule { }
