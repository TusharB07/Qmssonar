import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-years',
  templateUrl: './add-years.component.html',
  styleUrls: ['./add-years.component.scss']
})
export class AddYearsComponent implements OnInit {

  years: any[];
  selectedYears: any[]
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.years = this.config.data.brokers.map(item => item.year);
    if (this.config.data.selectedBrokers?.length > 0) {
      this.selectedYears = this.config.data.selectedBrokers.map(item => item.year);
    }
  }

  apply() {
    this.ref.close(this.selectedYears)
  }
}
