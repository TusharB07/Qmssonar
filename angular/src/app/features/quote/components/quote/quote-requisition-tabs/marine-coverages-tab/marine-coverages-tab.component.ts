import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { IClausesHeads } from 'src/app/features/admin/Marine/ClausesHeadsMaster/clausesHeads.model';
import { ClausesHeadsService } from 'src/app/features/admin/Marine/ClausesHeadsMaster/clausesHeads.service';
import { IClauses } from 'src/app/features/admin/Marine/ClausesMaster/clauses.model';
import { ConveyanceService } from 'src/app/features/admin/Marine/ConveyanceMaster/conveyance.service';
import { InterestService } from 'src/app/features/admin/Marine/InterestMaster/interest.service';
import { PackagingService } from 'src/app/features/admin/Marine/PackagingMaster/packaging.service';
import { TransitTypeService } from 'src/app/features/admin/Marine/TransitTypeMaster/transitType.service';
import { IQuoteSlip, IMarineTemplate, MarineSIData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { MarineSiSplitDialogComponent } from 'src/app/features/broker/marine-si-split-dialog/marine-si-split-dialog.component';
import { CountryService } from 'src/app/features/service/countryservice';
import { MarineClausesDialogComponent } from '../../marine-clauses-dialog/marine-clauses-dialog.component';
import { QuotemarinetemplateService } from 'src/app/features/admin/Marine/quotemarinetemplate.service';

@Component({
  selector: 'app-marine-coverages-tab',
  templateUrl: './marine-coverages-tab.component.html',
  styleUrls: ['./marine-coverages-tab.component.scss']
})
export class MarineCoveragesTabComponent implements OnInit {
  visibleSplitDialog: boolean = false;

  optionsCountries: ILov[] = [];
  optionsTransitTypeLst: ILov[] = [];
  optionsIntrestLst: ILov[] = [];
  optionsConvaynceLst: ILov[] = [];
  optionsPackagingLst: ILov[] = [];
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedQuoteTemplate: IMarineTemplate;
  marineHeads: any
  showClauses: boolean = false
  SelectedHeader: string = ""
  filteredClaused: IClauses[] = []
  otherDetailsText: string = ""
  marineOtherDetails: string[] = []
  marineData: IMarineTemplate
  marineEdiData: IClauses[] = []
  otherDetails1: string = ""
  otherDetails2: string = ""
  otherDetails3: string = ""
  otherDetails4: string = ""
  otherDetails5: string = ""
  constructor(private quotemarinetemplateService: QuotemarinetemplateService, private clausesHeadsService: ClausesHeadsService, private dialogService: DialogService, private quoteService: QuoteService, private countryService: CountryService, private convayenceService: ConveyanceService, private intrestService: InterestService, private packagingService: PackagingService, private transitTypeService: TransitTypeService) {

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        if (this.quote?.marineDataId != undefined) {
          this.marineData = this.quote?.marineDataId as IMarineTemplate

          this.marineOtherDetails = this.quote?.marineDataId['otherDetails'];
          // this.otherDetails1 = this.quote?.marineDataId['otherDetails1'];
          // this.otherDetails2 = this.quote?.marineDataId['otherDetails2'];
          // this.otherDetails3 = this.quote?.marineDataId['otherDetails3'];
          // this.otherDetails4 = this.quote?.marineDataId['otherDetails4'];
          // this.otherDetails5 = this.quote?.marineDataId['otherDetails5'];
          this.marineEdiData = this.quote?.marineDataId['marineCoverAddOnCovers'];
          this.clausesHeadsService.getManyAsLovs(event).subscribe({
            next: records => {
              console.log(records);

              this.marineHeads = records.data.entities;

            },
            error: e => {
              console.log(e);
            }
          });
        }
      }
    })
  }

  saveTabs() {
    const updatePayload = this.marineOtherDetails
    this.marineData.otherDetails = updatePayload
    this.quotemarinetemplateService.update(this.quote?.marineDataId["_id"], this.marineData).subscribe({
      next: partner => {
        console.log("ttest");
      },
      error: error => {
        console.log(error);
      }
    });
  }
  addOtherDetails() {
    if (this.otherDetailsText != "") {
      this.marineOtherDetails.push(this.otherDetailsText)
      this.otherDetailsText = ""
    }
  }

  removeOther(items) {
    var index = this.marineOtherDetails.indexOf(items);
    if (index !== -1) {
      this.marineOtherDetails.splice(index, 1);
    }
  }
  checkDisableButton(id) {
    let isInterest = false;
    let isConyance = false;
    let isPackaging = false;
    let isTransitType = false;

    if (this.marineData.marineSIData[0] != undefined) {
      const insterest = this.marineData.marineSIData[0].interest;
      const conyance = this.marineData.marineSIData[0].conveyanveType;
      const packaging = this.marineData.marineSIData[0].packaging;
      const transitType = this.marineData.marineSIData[0].transitType;

      this.filteredClaused = this.marineEdiData.filter(x => x.headId["_id"] == id)

      isInterest = this.filteredClaused.some(x => x.interests.some(x => x.value == insterest))
      isTransitType = this.filteredClaused.some(x => x.transitTypes.some(x => x.value == transitType))
      if (conyance != null) {
        this.filteredClaused.forEach(element => {
          isConyance = this.findCommonElement(element.conveyances, conyance);
          if (isConyance) {
            throw 'break';
          }
        });
      }
      if (packaging != null) {
        this.filteredClaused.forEach(element => {
          isPackaging = this.findCommonElement(element.packagings, packaging);
          if (isPackaging) {
            throw 'break';
          }
        });
      }
      if (isConyance || isInterest || isPackaging || isTransitType) {
        return false;
      }
      else {
        return true;
      }
    }
    return true;
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

  editRecord(id) {

    this.filteredClaused = this.marineEdiData.filter(x => x.headId["_id"] == id)
    // this.showClauses = true

    const ref = this.dialogService.open(MarineClausesDialogComponent, {
      header: this.filteredClaused[0].headId["headName"],
      data: {
        quote: this.quote,
        filteredId: id
      },
      width: "50vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      this.loadQuoteDetails(this.quote._id);
    })
  }
  ngOnInit(): void {
    this.getHeads()

  }
  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
      },
      error: e => {
        console.log(e);
      }
    });
  }
  onItemDrop(event) {

  }
  getHeads() {
    this.clausesHeadsService.getManyAsLovs(event).subscribe({
      next: records => {
        console.log(records);

        this.marineHeads = records.data.entities;

      },
      error: e => {
        console.log(e);
      }
    });
  }

  closeModal() {
    this.showClauses = false;

  }
}
