import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { IClauses } from 'src/app/features/admin/Marine/ClausesMaster/clauses.model';
import { QuotemarinetemplateService } from 'src/app/features/admin/Marine/quotemarinetemplate.service';
import { IMarineTemplate, IQuoteSlip, MarineSIData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';

@Component({
  selector: 'app-marine-clauses-dialog',
  templateUrl: './marine-clauses-dialog.component.html',
  styleUrls: ['./marine-clauses-dialog.component.scss']
})
export class MarineClausesDialogComponent implements OnInit {
  quote: IQuoteSlip;
  filteredId: string = ""
  marineSIData: MarineSIData = new MarineSIData()
  marineData: any
  marineTemplateData
  filteredClaused: IClauses[]
  droppedItems = [];
  marineMainData: IMarineTemplate
  private currentQuote: Subscription;
  constructor(
    private quotemarinetemplateService: QuotemarinetemplateService,
    public config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService, private messageService: MessageService) {
    this.filteredId = this.config.data.filteredId
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        if (this.quote?.marineDataId != undefined) {
          this.marineMainData = this.quote?.marineDataId as IMarineTemplate
          this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
          this.marineData = this.quote?.marineDataId['marineCoverAddOnCovers'];
          this.filteredClaused = this.marineData.filter(x => x.headId["_id"] == this.filteredId && x.isClauseSelected == false)
          this.droppedItems = this.marineData.filter(x => x.headId["_id"] == this.filteredId && x.isClauseSelected == true)

        }
      }
    })
  }
  onItemDrop(e: any) {
    e.dragData.isClauseSelected = true;
    // this.quoteLocationAddonService.update(e.dragData._id, e.dragData).subscribe({
    //   next: (dto: IOneResponseDto<any>) => {
    //   }
    // })
    // Get the dropped data here
    this.droppedItems.push(e.dragData);
    this.filteredClaused = this.filteredClaused.filter(item => item._id != e.dragData._id);
  }

  removeDroppedItems(e) {
    e.isClauseSelected = false;
    e.selectedDescription = "";    
    this.droppedItems = this.droppedItems.filter(item => item._id != e._id);
    this.filteredClaused.push(e);
  }

  closeModal() {

  }

  showClause(item) {
    let isInterest = false;
    let isConyance = false;
    let isPackaging = false;
    let isTransitType = false;

    if (this.marineSIData != undefined) {
      const insterest = this.marineSIData.interest;
      const conyance = this.marineSIData.conveyanveType;
      const packaging = this.marineSIData.packaging;
      const transitType = this.marineSIData.transitType;

      isInterest = item.interests.some(x => x.value == insterest)
      isTransitType = item.transitTypes.some(x => x.value == transitType)
      if (conyance != null) {
        isConyance = this.findCommonElement(item.conveyances, conyance);
        if (isConyance) {
          throw 'break';
        }
      }
      if (packaging != null) {
        isPackaging = this.findCommonElement(item.packagings, packaging);
        if (isPackaging) {
          throw 'break';
        }
      }
      if (isConyance || isInterest || isPackaging || isTransitType) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }
  // Function definition with passing two arrays
  findCommonElement(array1, array2) {

    // Loop for array1
    for (let i = 0; i < array1.length; i++) {

      // Loop for array2
      for (let j = 0; j < array2.length; j++) {

        // Compare the element of each and
        // every element from both of the
        // arrays
        if (array1[i] === array2[j]) {

          // Return if common element found
          return true;
        }
      }
    }

    // Return if no common element exist
    return false;
  }
  ngOnInit(): void {
    //  this.quote = this.config.data.quote;

    if (this.quote?.marineDataId != undefined) {
      this.marineData = this.quote?.marineDataId['marineCoverAddOnCovers'];
      this.filteredClaused = this.marineData.filter(x => x.headId["_id"] == this.filteredId && x.isClauseSelected == false)
      this.droppedItems = this.marineData.filter(x => x.headId["_id"] == this.filteredId && x.isClauseSelected == true)


    }
  }


  saveTabs() {
    this.marineMainData.marineCoverAddOnCovers = this.marineData
    const updatePayload = this.marineMainData;
    this.quotemarinetemplateService.update(this.quote?.marineDataId["_id"], updatePayload).subscribe({
      next: partner => {
        console.log("ttest");
      },
      error: error => {
        console.log(error);
      }
    });
  }

  close() {

  }

}
