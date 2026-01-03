import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IAddOnCover } from '../../addon-cover/addon-cover.model';
import { AddonCoverService } from '../../addon-cover/addon-cover.service';
import { IClientLocation } from '../../client-location/client-location.model';
import { ClientLocationService } from '../../client-location/client-location.service';
import { IQuoteSlip } from '../../quote/quote.model';
import { QuoteService } from '../../quote/quote.service';
import { IQuoteLocationAddonCovers } from '../quote-location-addon.model';
import { QuoteLocationAddonService } from '../quote-location-addon.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-quote-location-addon-form',
  templateUrl: './quote-location-addon-form.component.html',
  styleUrls: ['./quote-location-addon-form.component.scss']
})
export class QuoteLocationAddonFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Quote Location Addon";
  recordPluralName = "Quote Location Addons";
  modulePath: string = "/backend/admin/quote-location-addon";

  optionsQuotes: ILov[] = [];
  optionsLocations: ILov[] = [];
  optionsAddonCover: ILov[] = [];


  constructor(
    private recordService: QuoteLocationAddonService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private quoteService: QuoteService,
    private locationService: ClientLocationService,
    private addonCoverService: AddonCoverService,

  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IQuoteLocationAddonCovers>) => {
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

  createForm(item?: IQuoteLocationAddonCovers) {

    const quote: IQuoteSlip = item?.quoteId as IQuoteSlip;
    const location: IClientLocation = item?.locationId as IClientLocation;
    const addonCover: IAddOnCover = item?.addOnCoverId as IAddOnCover;

    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      quoteId: [quote ? { label: quote.quoteNo, value: quote._id } : null],
      locationId: [location ? { label: location.address, value: location._id } : null],
      addOnCoverId: [addonCover ? { label: addonCover.name, value: addonCover._id } : null],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["quoteId"] = this.recordForm.value["quoteId"].value;
      updatePayload["locationId"] = this.recordForm.value["locationId"].value;
      updatePayload["addOnCoverId"] = this.recordForm.value["addOnCoverId"].value;

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
  searchOptionsLocations(event) {
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
    this.locationService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsLocations = data.data.entities.map(entity => ({ label: entity.address, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsAddonCovers(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          name: [
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
    this.addonCoverService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsAddonCover = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

}
