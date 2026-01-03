import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { IMarineSIData, IMarineTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AppService } from 'src/app/app.service';
import { ToWords } from 'to-words';
import { IClauses } from 'src/app/features/admin/Marine/ClausesMaster/clauses.model';
import { ClausesHeadsService } from 'src/app/features/admin/Marine/ClausesHeadsMaster/clausesHeads.service';
import { QuotemarinetemplateService } from 'src/app/features/admin/Marine/quotemarinetemplate.service';
import { ConveyanceService } from 'src/app/features/admin/Marine/ConveyanceMaster/conveyance.service';
import { InterestService } from 'src/app/features/admin/Marine/InterestMaster/interest.service';
import { PackagingService } from 'src/app/features/admin/Marine/PackagingMaster/packaging.service';
import { TransitTypeService } from 'src/app/features/admin/Marine/TransitTypeMaster/transitType.service';
import { CountryService } from 'src/app/features/admin/country/country.service';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-sub-template-marine',
  templateUrl: './sub-template-marine.component.html',
  styleUrls: ['./sub-template-marine.component.scss']
})
export class SubTemplateMarineComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedQuoteTemplate: IMarineTemplate;
  marineSIData: IMarineSIData
  marineData: IMarineTemplate
  quoteId: string = "";
  marineCoverAddOnCovers: IClauses[] = []
  marineOtherDetails: string[] = []
  marineHeads: any[]=[];
  toWords = new ToWords();
  optionsCountries: ILov[] = [];
  optionsTransitTypeLst: ILov[] = [];
  optionsIntrestLst: ILov[] = [];
  optionsConvaynceLst: ILov[] = [];
  optionsPackagingLst: ILov[] = [];
  constructor(private quotemarinetemplateService: QuotemarinetemplateService, private countryService: CountryService, private convayenceService: ConveyanceService, private intrestService: InterestService, private packagingService: PackagingService, private transitTypeService: TransitTypeService, private clausesHeadsService: ClausesHeadsService, private quoteService: QuoteService, private appService: AppService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteId = this.quote._id;
        console.log(this.quote);
        if (this.quote?.marineDataId != undefined) {
          this.marineData = this.quote?.marineDataId as IMarineTemplate
          this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
          this.marineOtherDetails = this.quote?.marineDataId['otherDetails'];
          this.marineCoverAddOnCovers = this.quote?.marineDataId['marineCoverAddOnCovers'];
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
  filteredClaues(headId:string){
    return this.marineCoverAddOnCovers.filter(x=>x.headId["_id"] == headId && x.isClauseSelected == true)
  }
  ngOnInit(): void {
    this.getCountires();
    this.getConyances();
    this.getTransitType();
    this.getInterest();
    this.getPackaging()
    this.quoteService.get(`${this.quoteId}`, { allCovers: true, qcr: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        console.log(dto.data.entity)
        this.quoteService.setQuote(dto.data.entity)
        if (this.quote?.marineDataId != undefined) {
          this.marineData = this.quote?.marineDataId as IMarineTemplate
          this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
          this.marineOtherDetails = this.quote?.marineDataId['otherDetails'];
          this.marineCoverAddOnCovers = this.quote?.marineDataId['marineCoverAddOnCovers'];
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

      },
      error: e => {
        console.log(e);
      }
    });

    // this.getTpas();
  }
  getCountires() {
      this.countryService.getManyAsLovs(event).subscribe({
        next: data => {
          this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
        },
        error: e => { }
      });
  }

  showTransitType(transitType) {
    return this.optionsTransitTypeLst.find(x => x.value == transitType).label
  }
  showCountry(selectedCountry) {
    return this.optionsCountries.find(x => x.value == selectedCountry).label
  }
  getTransitType() {
    this.transitTypeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsTransitTypeLst = data.data.entities.map(entity => ({ label: entity.transitType, value: entity._id }));
      },
      error: e => { }
    });
  }

  getInterest() {
    this.intrestService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsIntrestLst = data.data.entities.map(entity => ({ label: entity.interest, value: entity._id }));
      },
      error: e => { }
    });
  }

  getPackaging() {
    this.packagingService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPackagingLst = data.data.entities.map(entity => ({ label: entity.packaging, value: entity._id }));
      },
      error: e => { }
    });
  }

  getConyances() {
    this.convayenceService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsConvaynceLst = data.data.entities.map(entity => ({ label: entity.conveyance, value: entity._id }));
      },
      error: e => { }
    });
  }
  ConvertStringToNumber(input: any) {

    if (input != null && input != undefined) {
      if (input.label == null || input.label == undefined) {
        return 0;
      }
    }
    else {
      return 0;
    }

    if (input.label.trim().length == 0) {
      return 0;
    }
    let siamt = input.label.replace(/\D/g, '');
    return Number(siamt);
  }

  convertToWords(si: number) {
    let result = this.toWords.convert((si) ?? 0, {
      currency: true,
      ignoreZeroCurrency: true
    })
    return result;
  }
}
