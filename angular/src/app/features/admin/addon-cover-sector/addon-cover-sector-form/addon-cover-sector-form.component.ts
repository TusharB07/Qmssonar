import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadEvent } from "primeng/api";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IAddOnCover } from "../../addon-cover/addon-cover.model";
import { AddonCoverService } from "../../addon-cover/addon-cover.service";
import { ISector } from "../../sector/sector.model";
import { SectorService } from "../../sector/sector.service";
import { IAddOnCoverSector } from "../addon-cover-sector.model";
import { AddonCoverSectorService } from "../addon-cover-sector.service";

@Component({
  selector: "app-addon-cover-sector-form",
  templateUrl: "./addon-cover-sector-form.component.html",
  styleUrls: ["./addon-cover-sector-form.component.scss"]
})
export class AddonCoverSectorFormComponent implements OnInit {
  addOnCoverId: string = "";

  id: string;
  loading: boolean;
  records: IAddOnCoverSector[];
  mode: FormMode = "new";
  recordForm: FormGroup;
  selectAddOnCoverForm: FormGroup;
  submitted: boolean = false;
  totalRecords: number;
  selectedAddOnCover: ILov
  addOnCover: IAddOnCover

  recordSingularName = "Addon Cover Sector";
  recordPluralName = "Addon Cover Sectors";
  modulePath: string = "/backend/admin/addon-cover-sectors";

  optionsAddonCovers: ILov[] = [];
  optionsSectors: ILov[] = [];

  constructor(
    private recordService: AddonCoverSectorService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private addonCoverService: AddonCoverService,
    private sectorService: SectorService,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.addOnCoverId = this.activatedRoute.snapshot.paramMap.get("addOnCoverId");

  console.log("jay",this.addOnCover);

  if(this.addOnCoverId) {
    this.modulePath = `/backend/admin/addon-covers/${this.addOnCoverId}`;

    if(this.addOnCoverId)
    this.addonCoverService.get(this.addOnCoverId).subscribe({
      next: (dto: IOneResponseDto<IAddOnCover>) => {
        this.addOnCover = dto.data.entity
      this.createForm();

      },
      error: e => {
        console.log(e);

      }
    });
  }

  // console.log(this.addOnCoverId)

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IAddOnCoverSector>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
            // {
            //     label: `${dto.data.entity.name}`,
            //     routerLink: [`${this.modulePath}/new`],
            // },
          ]);

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

  createForm(addonCoverSector?: IAddOnCoverSector) {
    const addonCover = this.addOnCoverId ? this.addOnCover: addonCoverSector?.addOnCoverId as IAddOnCover
    const sector = addonCoverSector?.sectorId as ISector


    console.log("yayyayya",addonCoverSector);
    this.recordForm = this.formBuilder.group({
      _id: [addonCoverSector?._id],
      addOnCoverId: [addonCover ? { label: addonCover.name, value: addonCover._id } : null],
      sectorId: [sector ? { label: sector.name, value: sector._id } : null],
      isApplicable: [addonCoverSector?.isApplicable],
      status: [addonCoverSector?.status]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["addOnCoverId"] = this.recordForm.value["addOnCoverId"].value;
      updatePayload["sectorId"] = this.recordForm.value["sectorId"].value;

      if (this.mode === "edit") {
        console.log("inside edit");
        
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
        console.log("inside new");
        
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

  onCreateAddOnCoverSector() {
    console.log("onCreateAddOnCoverSector", this.selectAddOnCoverForm);

    this.selectedAddOnCover = this.selectAddOnCoverForm.value.addOnCoverId
    console.log(this.selectedAddOnCover);

    this.createForm();

  }
  // searchOptionsAddonCover
  searchOptionsAddonCover(event) {
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
        this.optionsAddonCovers = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsSector(event) {
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
    this.sectorService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsSectors = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
}
