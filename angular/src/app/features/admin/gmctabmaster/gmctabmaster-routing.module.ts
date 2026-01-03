import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmctabmasterComponent } from './gmctabmaster.component';
import { GmctabmasterFormComponent } from './gmctabmaster-form/gmctabmaster-form.component';



const routes: Routes = [

  { path: "", component: GmctabmasterComponent },
  { path: ":id", component: GmctabmasterFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GMCTabMasterRoutingModule { }
