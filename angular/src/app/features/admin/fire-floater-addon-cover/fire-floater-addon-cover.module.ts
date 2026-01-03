import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FireFloaterAddonCoverListComponent } from './fire-floater-addon-cover-list/fire-floater-addon-cover-list.component';
import { FireFloaterAddonCoverFormComponent } from './fire-floater-addon-cover-form/fire-floater-addon-cover-form.component';



@NgModule({
  declarations: [
    FireFloaterAddonCoverListComponent,
    FireFloaterAddonCoverFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FireFloaterAddonCoverModule { }
