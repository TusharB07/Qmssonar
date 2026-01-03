import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ReplaySubject } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IOccupancyRate } from 'src/app/features/admin/occupancy-rate/occupancy-rate.model';
import { IQuoteLocaitonBreakupMaster } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sum-insured-details',
  templateUrl: './sum-insured-details.component.html',
  styleUrls: ['./sum-insured-details.component.scss']
})
export class SumInsuredDetailsComponent implements OnInit {

  quote: IQuoteSlip;
  cols: any[];
//   quoteId: string = '';
  files1: TreeNode[];


  model: any[] = [];
  sum: any[] = [];
  optionsQuotes: any[];

  private currentQuote: Subscription;

  constructor(
    private router: Router,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private quoteService: QuoteService,
    private listOfValuesMasterService: ListOfValueMasterService,
    private activatedRoute: ActivatedRoute,
  ) {
    // this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
        this.loadQuoteLocationOccupancies();
      }
    });
  }


  // quoteLocationOccupanciesList: IQuoteLocationOccupancy[] = [];

  quoteLocationOccupanciesList = new ReplaySubject<IQuoteLocationOccupancy[]>(null);
  quoteLocationOccupanciesList$ = this.quoteLocationOccupanciesList.asObservable();
  quoteLocationOccupanciesListValue: IQuoteLocationOccupancy[] = []

  quoteLocationBreakupList = new ReplaySubject<IQuoteLocaitonBreakupMaster[]>(null);
  quoteLocationBreakupList$ = this.quoteLocationBreakupList.asObservable();
  quoteLocationBreakupListValue: IQuoteLocaitonBreakupMaster[] = [];

  lovTreeMapping = new ReplaySubject<IListOfValueMaster[]>(null);
  lovTreeMapping$ = this.lovTreeMapping.asObservable();
  lovTreeMappingValue: IListOfValueMaster[] = [];


  ngOnInit(): void {
    /* this.quoteService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsQuotes = data.data.entities.map(entity => ({ label: entity.quoteNo, value: entity._id }));
        this.quote = this.optionsQuotes[0].value;
        console.log(this.quote);
        this.loadQuoteLocationOccupancies();
      },
      error: e => { }
    }); */
    this.loadLovTreeMapping();

    this.quoteLocationOccupanciesList$.subscribe({
      next: (quoteLocationOccupancies: IQuoteLocationOccupancy[]) => {
        this.quoteLocationOccupanciesListValue = quoteLocationOccupancies;

        this.cols = [{ _id: '', clientLocation: '', occupancy: '' },];

        quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
          let clientLocation: IClientLocation = quoteLocationOccupancy.clientLocationId as IClientLocation
          let occupancy: IOccupancyRate = quoteLocationOccupancy.occupancyId as IOccupancyRate

          this.cols.push({ _id: quoteLocationOccupancy._id, clientLocation: clientLocation, occupancy: occupancy, sumAssured: quoteLocationOccupancy.sumAssured, calculatedSumAssured: 0 })
        })

      }
    })

    this.lovTreeMapping$.subscribe({
      next: (lovTree) => {
        this.lovTreeMappingValue = lovTree;

        this.loadQuoteLocationBreakup();

      }
    })

    this.quoteLocationBreakupList$.subscribe({
      next: (quoteLocationBreakup) => {
        this.quoteLocationBreakupListValue = quoteLocationBreakup;

        console.log('breakup', quoteLocationBreakup)
        console.log(this.lovTreeMappingValue);
        //  this.files1 = this.parseTree(this.breakupMap);

        this.cols.map((col: any) => {
          this.sum[col._id] = [];
          this.sum[col._id]['calculatedSumAssured'] = 0
          // console.log(el.calculatedSumAssured)
        });


        this.files1 = this.parseTree(this.lovTreeMappingValue, quoteLocationBreakup);

        // console.log(this.files1);

      }
    })
  }

  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  //work on this
  calculateTree() {
    // return breakUpMap.map(item => {

    //     return item.children ? this.calculateTree(item) : item;
    // })

    // tree.map((node:any) => console.log(node))
  }

  loadLovTreeMapping() {
    this.listOfValuesMasterService.current(AllowedListOfValuesMasters.QUOTE_LOCATION_BREAKUP_L1).subscribe({
      next: (dto: IManyResponseDto<IListOfValueMaster>) => {
        this.lovTreeMapping.next(dto.data.entities)

        // this.breakupMap = dto.data.entities

      },
      error: e => { }

    })
  }

  loadQuoteLocationBreakup() {
    this.quoteLocationBreakupService.getMany({
      first: 0, rows: 20, sortField: null, sortOrder: 1, globalFilter: null, multiSortMeta: null,
      filters: {
        // @ts-ignore
        quoteId: [{ value: this.quote._id, matchMode: "equals", operator: "and" }],
      },
    }).subscribe({
      next: (dto: IManyResponseDto<IQuoteLocaitonBreakupMaster>) => {

        this.quoteLocationBreakupList.next(dto.data.entities)
      }
    });
  }

  loadQuoteLocationOccupancies() {
    this.quoteLocationOccupancyService.getMany({
      first: 0, rows: 20, sortField: null, sortOrder: 1, globalFilter: null, multiSortMeta: null,
      filters: { // @ts-ignore
        quoteId: [{ value: this.quote._id, matchMode: "equals", operator: "and" }]
      },
    }).subscribe({
      next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
        this.quoteLocationOccupanciesList.next(dto.data.entities);
      }
    });
  }

  parseTree(breakUpMap: IListOfValueMaster[], quoteLocationBreakupListValue: IQuoteLocaitonBreakupMaster[]) {

    return breakUpMap.map(item => {

      let res = [];
      // console.log(item._id)
      this.model[item._id] = [];

      this.cols.map(col => {
        // console.log(item?.children)

        if (col._id && item?.children.length == 0) {


          // console.log('dat',quoteLocationBreakupListValue)
          // console.log(item)

          // let quoteLocationBreakup = this.quoteLocationOccupancyBreakup.find(el => item._id == el.lovId && col._id == el.clientLocationId);
          let quoteLocationBreakup = quoteLocationBreakupListValue.find(el => item._id == el.lovId && col._id == el.quoteLocationOccupancyId);

          // console.log(item)
          // console.log(quoteLocationBreakup?.value)
          this.model[item._id][col._id] = quoteLocationBreakup?.value ?? 0;

          this.sum[col._id]['calculatedSumAssured'] = Number(this.sum[col._id]['calculatedSumAssured'] ?? 0) + Number(quoteLocationBreakup?.value ?? 0);

          console.log(this.sum[col._id]['calculatedSumAssured'])

          res[col._id] = {
            _id: quoteLocationBreakup?._id,
            lovId: item._id,
            lovType: item.lovType,
            lovKey: item.lovKey,
            lovReferences: item.lovReferences,
            value: quoteLocationBreakup?.value ?? 0
          }
          // col['calculatedSumAssured'] = Number(col.calculatedSumAssured ?? 0) + Number(quoteLocationBreakup?.value ?? 0)
          // console.log(col)
        } else {
          res[col._id] = { readonly: true, value: 0 }
        }
      })

      return {
        expanded: true,
        data: {
          name: item.lovKey,
          ...res
        },
        children: ((item?.children) ? this.parseTree(item?.children, quoteLocationBreakupListValue) : [])
      }
    })
  }

  valueUpdated(quoteLocationOccupancyId, lovId, lovType, lovKey, lovReferences, id) {


    const payload: IQuoteLocaitonBreakupMaster = {
      quoteId: this.quote._id,
      // clientLocationId: clientLocationId,
      quoteLocationOccupancyId: quoteLocationOccupancyId,
      lovId: lovId,
      lovType: lovType,
      lovKey: lovKey,
      lovReferences: lovReferences,
      value: this.model[lovId][quoteLocationOccupancyId],
    }
    console.log(payload)

    console.log(this.model[lovId][quoteLocationOccupancyId])

    // console.o
    if (id) {
      this.quoteLocationBreakupService.update(id, payload).subscribe({
        next: async (dto: IOneResponseDto<IQuoteLocaitonBreakupMaster>) => {
          console.log(dto.data.entity)

          let newQuoteLocationBreak = dto.data.entity;
          // console.log()

          let newList = this.quoteLocationBreakupListValue.map((quoteLocationBreak: IQuoteLocaitonBreakupMaster) => quoteLocationBreak._id == newQuoteLocationBreak._id ? newQuoteLocationBreak : quoteLocationBreak);
          // this.computeData();
          console.log(newList);
          this.quoteLocationBreakupList.next(newList)
        },
        error: error => {
          console.log(error);
        }
      });
    } else {
      this.quoteLocationBreakupService.create(payload).subscribe({
        next: (dto: IOneResponseDto<IQuoteLocaitonBreakupMaster>) => {
          console.log(dto.data.entity)
          // this.computeData();
          let newQuoteLocationBreak = dto.data.entity;

          this.quoteLocationBreakupListValue.push(newQuoteLocationBreak)

          this.quoteLocationBreakupList.next(this.quoteLocationBreakupListValue)
        },
        error: error => {
          console.log(error);
        }
      });

    }


  }

}
