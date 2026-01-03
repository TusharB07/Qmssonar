import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { EmailConfigurationFormComponent } from './email-configuration-form/email-configuration-form.component';

const routes: Routes = [

  { path: "", component: EmailConfigurationComponent },
  { path: ":id", component: EmailConfigurationFormComponent },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailConfigurationRoutingModule { }
