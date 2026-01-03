import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RentForAlternativeAccomodationCoverListComponent } from './rent-for-alternative-accomodation-cover-list/rent-for-alternative-accomodation-cover-list.component';
import { RentForAlternativeAccomodationCoverFormComponent } from './rent-for-alternative-accomodation-cover-form/rent-for-alternative-accomodation-cover-form.component';


const routes: Routes = [

  { path: "", component: RentForAlternativeAccomodationCoverListComponent },
  { path: ":id", component: RentForAlternativeAccomodationCoverFormComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentForAlternativeAccomodationCoverRoutingModule { }
