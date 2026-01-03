import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SequenceListComponent } from './sequence-list/sequence-list.component';
import { SequenceFormComponent } from './sequence-form/sequence-form.component';


const routes: Routes = [
    { path: "", component: SequenceListComponent },
    { path: ":id", component: SequenceFormComponent }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SequenceRoutingModule { }
