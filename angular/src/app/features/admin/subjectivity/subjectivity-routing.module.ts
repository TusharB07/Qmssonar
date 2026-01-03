import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubjectivityListComponent } from './subjectivity-list/subjectivity-list.component';
import { SubjectivityFormComponent } from './subjectivity-form/subjectivity-form.component';




const routes: Routes = [

  { path: "", component: SubjectivityListComponent },
  { path: ":id", component: SubjectivityFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectivityRoutingModule { }
