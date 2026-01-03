import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-sector-avg-free-add-ons-dialog',
  templateUrl: './sector-avg-free-add-ons-dialog.component.html',
  styleUrls: ['./sector-avg-free-add-ons-dialog.component.scss']
})
export class SectorAvgFreeAddOnsDialogComponent implements OnInit {

  covers: any[] = [];

  constructor(
    private config: DynamicDialogConfig
  ) {
    this.covers = this.config.data?.covers;
   }

  ngOnInit(): void {
  }

}
