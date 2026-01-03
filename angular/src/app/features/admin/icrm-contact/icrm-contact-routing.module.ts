import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IcrmContactListComponent } from './icrm-contact-list/icrm-contact-list.component';
import { IcrmContactFormComponent } from './icrm-contact-form/icrm-contact-form.component';


const routes: Routes = [
  { path: "", component: IcrmContactListComponent },
  { path: ":id", component: IcrmContactFormComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IcrmContactRoutingModule { }
