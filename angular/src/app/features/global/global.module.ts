import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteLocationBreakupDialogComponent } from '../quote/components/quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { TreeTableModule } from "primeng/treetable";
import { NgxCurrencyModule } from "ngx-currency";
// import { BscDialoguesComponent } from './bsc-dialogues/bsc-dialogues.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteListViewComponent } from './quote-list-view/quote-list-view.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';




@NgModule({
  declarations: [
    // BscDialoguesComponent,
    QuoteListViewComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    CardModule,
    DropdownModule,


    TreeTableModule,
    NgxCurrencyModule,
  ],
  exports: [
    // BscDialoguesComponent
  ]
})
export class GlobalModule { }
