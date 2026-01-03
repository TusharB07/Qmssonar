import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiTemplateListComponent } from './api-template-list/api-template-list.component';
import { ApiTemplateFormComponent } from './api-template-form/api-template-form.component';

const routes: Routes = [
  { path: "", component: ApiTemplateListComponent },
  { path: ":id", component: ApiTemplateFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiTemplateRoutingModule { }
