import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { EditSumSiConfimationDialogComponent } from '../edit-sum-si-confimation-dialog/edit-sum-si-confimation-dialog.component';

@Component({
  selector: 'app-edit-quote-location-sum-insured-dialog',
  templateUrl: './edit-quote-location-sum-insured-dialog.component.html',
  styleUrls: ['./edit-quote-location-sum-insured-dialog.component.scss']
})
export class EditQuoteLocationSumInsuredDialogComponent implements OnInit {

  selectedLocation : any

  sumAssured : number = 0
  tooltipSumAssured : string

  constructor(
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) { }

  toWords = new ToWords();

  ngOnInit(): void {
    this.selectedLocation = this.config.data.selectedLocation
    console.log(this.selectedLocation )
    this.sumAssured = this.selectedLocation?.sumAssured
    
    this.tooltipSumAssured=this.toWords.convert(this.sumAssured)
  }

  setSumAssured(){
    this.tooltipSumAssured=this.toWords.convert(this.sumAssured)
    console.log(this.tooltipSumAssured)
  }

  updateSumAssured() {

    const ref = this.dialogService.open(EditSumSiConfimationDialogComponent , {
      header : "Are you sure you want to edit Sum Insured." , 
      data : {
          quote: this.config.data.quote,
          selectedLocation : this.selectedLocation,
          sumAssured : this.sumAssured
      },
      width: '45%',
      styleClass: 'flatPopup'
  })

  ref.onClose.subscribe((item)=> {
    if(item == "saved"){
      this.ref.close()
    }
  })
  }
}
