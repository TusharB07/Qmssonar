import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-broker',
  templateUrl: './add-broker.component.html',
  styleUrls: ['./add-broker.component.scss']
})
export class AddBrokerComponent implements OnInit {

  brokers: any[];
  selectedBrokers: any[]
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.brokers = this.config.data.brokers.map(item=>item.brokerName);
    if(this.config.data.selectedBrokers?.length > 0){
      this.selectedBrokers = this.config.data.selectedBrokers.map(item => item.brokerName);
    }
  }

  apply(){
    this.ref.close(this.selectedBrokers)
  }
}
