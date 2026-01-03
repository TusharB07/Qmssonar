import { Component, OnInit } from '@angular/core';
import { addDays } from '@fullcalendar/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { ConveyanceService } from 'src/app/features/admin/Marine/ConveyanceMaster/conveyance.service';
import { InterestService } from 'src/app/features/admin/Marine/InterestMaster/interest.service';
import { PackagingService } from 'src/app/features/admin/Marine/PackagingMaster/packaging.service';
import { TransitTypeService } from 'src/app/features/admin/Marine/TransitTypeMaster/transitType.service';
import { QuotemarinetemplateService } from 'src/app/features/admin/Marine/quotemarinetemplate.service';
import { CountryService } from 'src/app/features/admin/country/country.service';
import { IMarineSIData, IMarineTemplate, IQuoteGmcTemplate, IQuoteSlip, MarineDescription, MarineSIData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { MarineSiSplitDialogComponent } from 'src/app/features/broker/marine-si-split-dialog/marine-si-split-dialog.component';

@Component({
  selector: 'app-marine-suminsured-details-tab',
  templateUrl: './marine-suminsured-details-tab.component.html',
  styleUrls: ['./marine-suminsured-details-tab.component.scss']
})
export class MarineSuminsuredDetailsTabComponent implements OnInit {
  visibleSplitDialog: boolean = false;
  isCountryDisable: boolean = false
  optionsCountries: ILov[] = [];
  optionsTransitTypeLst: ILov[] = [];
  optionsIntrestLst: ILov[] = [];
  optionsConvaynceLst: ILov[] = [];
  optionsPackagingLst: ILov[] = [];
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedQuoteTemplate: IMarineTemplate;
  marineSIData: IMarineSIData
  marineData: IMarineTemplate
  constructor(private messageService: MessageService, private quotemarinetemplateService: QuotemarinetemplateService, private dialogService: DialogService, private quoteService: QuoteService, private countryService: CountryService, private convayenceService: ConveyanceService, private intrestService: InterestService, private packagingService: PackagingService, private transitTypeService: TransitTypeService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        // this.selectedQuoteTemplate = this.quote.marineDataId[]
        // console.log(this.quote);
        if (this.quote?.marineDataId != undefined) {
          this.marineData = this.quote?.marineDataId as IMarineTemplate
          this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
          this.marineSIData.policyStartDate = new Date(this.marineSIData.policyStartDate)
          this.marineSIData.policyEndDate = new Date(this.marineSIData.policyEndDate)
        }
        else {
          this.marineSIData.policyStartDate = new Date()
          this.marineSIData.policyEndDate = new Date();
        }
      }
    })
  }

  ngOnInit(): void {
    this.getCountires();
    this.getConyances();
    this.getTransitType();
    this.getInterest();
    this.getPackaging()
    // if (this.quote?.gmcTemplateDataId != undefined) {
  }
  saveTabs() {
    if (this.marineSIData.policyEndDate < this.marineSIData.policyStartDate) {
      this.messageService.add({
        severity: "error",
        summary: "Date Error",
        detail: `Policy Start Date should not be greater than End date`,
        life: 3000
      });
      return;
    }
    const updatePayload = this.marineSIData
    this.marineData.marineSIData = this.marineSIData
    this.quotemarinetemplateService.update(this.quote?.marineDataId["_id"], this.marineData).subscribe({
      next: partner => {
        console.log("ttest");
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getCountires() {
    this.countryService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id })).sort((a, b) => (a.label < b.label ? -1 : 1));
      },
      error: e => { }
    });
  }


  getTransitType() {
    this.transitTypeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsTransitTypeLst = data.data.entities.
          map(entity => ({ label: entity.transitType, value: entity._id }))
          .sort((a, b) => (a.label < b.label ? -1 : 1));;
        const type = this.optionsTransitTypeLst.find(x => x.value == this.marineSIData.transitType).label;
        if (type !== 'Export' && type !== 'Import') {
          this.isCountryDisable = true;
        }
        else {
          this.isCountryDisable = false;
        }
      },
      error: e => { }
    });
  }

  getInterest() {
    this.intrestService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsIntrestLst = data.data.entities.
          map(entity => ({ label: entity.interest, value: entity._id })).sort((a, b) => (a.label < b.label ? -1 : 1));;
      },
      error: e => { }
    });
  }

  getPackaging() {
    this.packagingService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPackagingLst = data.data.entities.map(entity => ({ label: entity.packaging, value: entity._id })).sort((a, b) => (a.label < b.label ? -1 : 1));
      },
      error: e => { }
    });
  }

  getConyances() {
    this.convayenceService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsConvaynceLst = data.data.entities.
          map(entity => ({ label: entity.conveyance, value: entity._id })).sort((a, b) => (a.label < b.label ? -1 : 1));;
      },
      error: e => { }
    });
  }

  onDDLChangeTransitType(event: any) {
    const type = this.optionsTransitTypeLst.find(x => x.value == event.value).label;
    if (type !== 'Export' && type !== 'Import') {
      this.marineSIData.selectedCountry = this.optionsCountries.find(x => x.label == 'India').value;
      this.isCountryDisable = true;
    }
    else {
      this.marineSIData.selectedCountry = ""
      this.isCountryDisable = false;
    }
  }

  onConvyance($event) {
    this.marineSIData.conveyanveType = []
    this.marineSIData.conveyanceList = []
    this.marineSIData.conveyanveType = $event
    this.marineSIData.conveyanveType.forEach(element => {
      let description = new MarineDescription()
      description.label = element.label;
      description.text = "";
      this.marineSIData.conveyanceList.push(description)
    });

  }

  onPackagingChange($event) {
    this.marineSIData.packaging = []
    this.marineSIData.packagingList = []
    this.marineSIData.packaging = $event
    this.marineSIData.packaging.forEach(element => {
      let description = new MarineDescription()
      description.label = element.label;
      description.text = "";
      this.marineSIData.packagingList.push(description)
    });
  }

  onIntrestChange($event) {
    this.marineSIData.interestList = []
    let description = new MarineDescription()
    description.label = this.optionsIntrestLst.filter(x => x.value == $event.value)[0].label
    description.text = "";
    this.marineSIData.interestList.push(description)
  }

  showDialog() {
    const ref = this.dialogService.open(MarineSiSplitDialogComponent, {
      header: "Sum Insured Split",
      data: {
        quote: this.quote,
      },
      width: "30vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      this.loadQuoteDetails(this.quote._id);
    })
  }


  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        if (this.quote?.marineDataId != undefined) {
          this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

}
