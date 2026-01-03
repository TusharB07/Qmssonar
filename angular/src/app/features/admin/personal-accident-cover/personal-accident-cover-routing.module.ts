import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccidentCoverListComponent } from './personal-accident-cover-list/personal-accident-cover-list.component';
import { PersonalAccidentCoverFormComponent } from './personal-accident-cover-form/personal-accident-cover-form.component';


const routes: Routes = [

  { path: "", component: PersonalAccidentCoverListComponent },
  { path: ":id", component: PersonalAccidentCoverFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalAccidentCoverRoutingModule { }
