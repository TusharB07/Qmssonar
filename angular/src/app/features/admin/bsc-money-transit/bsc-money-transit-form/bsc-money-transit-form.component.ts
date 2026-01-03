import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IClientLocation } from '../../client-location/client-location.model';
import { ClientLocationService } from '../../client-location/client-location.service';
import { IQuoteSlip } from '../../quote/quote.model';
import { QuoteService } from '../../quote/quote.service';
import { IBscMoneyTransitCover } from '../bsc-money-transit.model';
import { BscMoneyTransitService } from '../bsc-money-transit.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-bsc-money-transit-form',
  templateUrl: './bsc-money-transit-form.component.html',
  styleUrls: ['./bsc-money-transit-form.component.scss']
})
export class BscMoneyTransitFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "BSC Money Transit";
  recordPluralName = "BSC Money Transits";
  modulePath: string = "/backend/admin/bsc-money-transits";

  optionsQuotes: ILov[] = [];
  optionsClientLocations: ILov[] = [];


  constructor(
    private quoteService: QuoteService,
    private clientLocationService: ClientLocationService,
    private recordService: BscMoneyTransitService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IBscMoneyTransitCover>) => {
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

  createForm(item?: IBscMoneyTransitCover) {
    const quote: IQuoteSlip = item?.quoteId as IQuoteSlip;
    // const clientLocation: IClientLocation = item?.clientLocationId as IClientLocation;
    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      transitFrom: [item?.transitFrom],
      transitTo: [item?.transitTo],
      singleCarryingLimit: [item?.singleCarryingLimit],
      annualTurnover: [item?.annualTurnover],
      total: [item?.total],
      quoteId: [quote ? { label: quote.quoteNo, value: quote._id } : null, [Validators.required]],
    //   clientLocationId: [clientLocation ? { label: clientLocation.locationName, value: clientLocation._id } : null, [Validators.required]],

      // name: [city?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      // state: [city?.state, [Validators.required]]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      if (this.mode === "edit") {
        this.recordService.update(this.id, this.recordForm.value).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(this.recordForm.value).subscribe({
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

  searchOptionsQuotes(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          quoteNo: [
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
        this.optionsQuotes = data.data.entities.map(entity => ({ label: entity.quoteNo, value: entity._id }));
      },
      error: e => { }
    });
  }

  /* searchOptionsClientLocations(event) {
    this.clientLocationService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsClientLocations = data.data.entities.map(entity => ({ label: entity.address, value: entity._id }));
      },
      error: e => { }
    });
  } */

  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
