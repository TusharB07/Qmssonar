import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IClientLocation } from '../../client-location/client-location.model';
import { ClientLocationService } from '../../client-location/client-location.service';
import { QuoteLocationOccupancyService } from '../../quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from '../../quote/quote.model';
import { QuoteService } from '../../quote/quote.service';
import { IBscFixedPlateGlassCover } from '../bsc-fixed-plate-glass.model';
import { BscFixedPlateGlassService } from '../bsc-fixed-plate-glass.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-bsc-fixed-plate-glass-form',
  templateUrl: './bsc-fixed-plate-glass-form.component.html',
  styleUrls: ['./bsc-fixed-plate-glass-form.component.scss']
})
export class BscFixedPlateGlassFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "BSC Fixed Plate Glass";
  recordPluralName = "BSC Fixed Plate Glasses";
  modulePath: string = "/backend/admin/bsc-fixed-plate-glass-cover";
  optionsQuotes: ILov[] = [];
  optionsClientLocations: ILov[] = [];
  constructor(
    private quoteService: QuoteService,
    private clientLocationService: ClientLocationService,
    private recordService: BscFixedPlateGlassService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IBscFixedPlateGlassCover>) => {

          this.createForm(dto.data.entity);
        },
        error: e => {
          console.log(e);
        }
      });
    } else {
      this.breadcrumbService.setItems([
        { label: "Pages" },
        {
          label: `Add new ${this.recordSingularName}`,
          routerLink: [`${this.modulePath}/new`]
        }
      ]);
    }

    // mode: New
    this.createForm();
  }

  createForm(item?: IBscFixedPlateGlassCover) {
    const quote: IQuoteSlip = item?.quoteId as IQuoteSlip;
    // const clientLocation: IClientLocation = item?.clientLocationId as IClientLocation;
    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      plateGlassType: [item?.plateGlassType, [Validators.required]],
      description: [item?.description, [Validators.required]],
      sumInsured: [item?.sumInsured, [Validators.required, Validators.min(0)]],
      total: [item?.total, Validators.min(0)],
      quoteId: [quote ? { label: quote.quoteNo, value: quote._id } : null, [Validators.required]],
    //   clientLocationId: [clientLocation ? { label: clientLocation.locationName, value: clientLocation._id } : null, [Validators.required]],
      ratePerMile: [item?.ratePerMile, [Validators.required, Validators.min(0)]]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
    //   updatePayload['clientLocationId'] = updatePayload.clientLocationId.value;
      updatePayload['quoteId'] = updatePayload.quoteId.value;
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
        this.optionsClientLocations = data.data.entities.map(entity => ({ label: entity.locationName, value: entity._id }));
      },
      error: e => { }
    });
  } */

  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
