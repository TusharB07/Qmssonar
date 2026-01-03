import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-gmc-description-dialog',
  templateUrl: './gmc-description-dialog.component.html',
  styleUrls: ['./gmc-description-dialog.component.scss']
})
export class GmcDescriptionDialogComponent implements OnInit {
  description:string=""
  quoteId:string=""
  constructor(   public config: DynamicDialogConfig,) { 
    
  }

  ngOnInit(): void {
    this.description = this.config.data.description == undefined? "":this.config.data.description
  }

}
