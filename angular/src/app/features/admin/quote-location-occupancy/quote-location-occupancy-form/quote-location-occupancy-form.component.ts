import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { OccupancyRateService } from '../../occupancy-rate/occupancy-rate.service';
import { QuoteService } from '../../quote/quote.service';
import { IQuoteLocationOccupancy } from '../quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../quote-location-occupancy.service';
import { IOccupancyRate } from "../../occupancy-rate/occupancy-rate.model";
import { IQuoteSlip } from '../../quote/quote.model';
import { ClientLocationService } from '../../client-location/client-location.service';
import { IClientLocation } from '../../client-location/client-location.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-quote-location-occupancy-form',
  templateUrl: './quote-location-occupancy-form.component.html',
  styleUrls: ['./quote-location-occupancy-form.component.scss']
})
export class QuoteLocationOccupancyFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Quote Location Occupancy";
  recordPluralName = "Quote Location Occupancy";
  modulePath: string = "/backend/admin/quote-location-occupancy";
  optionsClientLocations: ILov[] = [];
  optionsOccupancies: ILov[] = [];
  optionsQuotes: ILov[] = [];

  constructor(
    private recordService: QuoteLocationOccupancyService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    // private ClientLocationService: clientLocationService;
    private occupancyService: OccupancyRateService,
    private clientLocationService: ClientLocationService,
    private quoteService: QuoteService,

  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IQuoteLocationOccupancy>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            // {
            //   label: `${dto.data.entity.name}`,
            //   routerLink: [`${this.modulePath}/new`]
            // }
          ]);

          this.createForm(dto.data.entity);
        },
        error: e => {
          console.log(e);
        }
      });
    } else {
      this.breadcrumbService.setItems([{ label: "Pages" }, { label: `Add new ${this.recordSingularName}`, routerLink: [`${this.modulePath}/new`] }]);
    }

    // mode: New
    this.createForm();
  }

  createForm(item?: IQuoteLocationOccupancy) {

    console.log(item)
    const occupancy: IOccupancyRate = item?.occupancyId as IOccupancyRate;
    const quote: IQuoteSlip = item?.quoteId as IQuoteSlip;
    const clientLocation: IClientLocation = item?.clientLocationId as IClientLocation;

    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      clientLocationId: [clientLocation ? { label: clientLocation.address, value: clientLocation._id } : null, [Validators.required]],
      occupancyId: [occupancy ? { label: occupancy.occupancyType, value: occupancy._id } : null, [Validators.required]],
      quoteId: [quote ? { label: quote.quoteType, value: quote._id } : null, [Validators.required]],
      sumAssured: [item?.sumAssured, [Validators.required, Validators.min(0)]],
      flexaPremium: [item?.flexaPremium, [Validators.min(0)]],
      STFIPremium: [item?.STFIPremium,[Validators.min(0)]],
      earthquakePremium: [item?.earthquakePremium, [Validators.min(0)]],
      terrorismPremium: [item?.terrorismPremium, [Validators.min(0)]],
      totalPremium: [item?.totalPremium, [Validators.min(0)]],

      // name: [city?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      // state: [city?.state, [Validators.required]]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["clientLocationId"] = this.recordForm.value["clientLocationId"].value;
      updatePayload["quoteId"] = this.recordForm.value["quoteId"].value;
      updatePayload["occupancyId"] = this.recordForm.value["occupancyId"].value;

      if (this.mode === "edit") {
        this.recordService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }
  searchOptionsQuotes(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          quoteType: [
            {
              value: event.query,
              matchMode: "startsWith",
              operator: "or"
            }
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }
    this.quoteService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsQuotes = data.data.entities.map(entity => ({ label: entity.quoteType, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsOccupancies(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          occupancyType: [
            {
              value: event.query,
              matchMode: "startsWith",
              operator: "or"
            }
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }
    this.occupancyService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsOccupancies = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsClientLocations(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          address: [
            {
              value: event.query,
              matchMode: "startsWith",
              operator: "or"
            }
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }
    this.clientLocationService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsClientLocations = data.data.entities.map(entity => ({ label: entity.address, value: entity._id }));
      },
      error: e => { }
    });
  }
  // searchOptionsStates(event) {
  //   this.stateService.getManyAsLovs(event).subscribe({
  //     next: data => {
  //       this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
  //     },
  //     error: e => { }
  //   });
  // }
}
