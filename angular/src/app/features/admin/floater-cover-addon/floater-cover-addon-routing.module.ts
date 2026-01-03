import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FloaterCoverAddonFormComponent } from './floater-cover-addon-form/floater-cover-addon-form.component';
import { FloaterCoverAddonListComponent } from './floater-cover-addon-list/floater-cover-addon-list.component';



const routes: Routes = [

  { path: "", component: FloaterCoverAddonListComponent },
  { path: ":id", component: FloaterCoverAddonFormComponent },  
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloaterCoverAddonRoutingModule { }
