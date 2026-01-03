import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadEvent } from "primeng/api";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { ICity } from "../../city/city.model";
import { CityService } from "../../city/city.service";
import { ICountry } from "../../country/country.model";
import { CountryService } from "../../country/country.service";
import { IDistrict } from "../../district/district.model";
import { DistrictService } from "../../district/district.service";
import { IState } from "../../state/state.model";
import { StateService } from "../../state/state.service";
import { IPincode, OPTIONS_EARTHQUAKE_ZONES } from "../pincode.model";
import { PincodeService } from "../pincode.service";

@Component({
  selector: "app-pincode-form",
  templateUrl: "./pincode-form.component.html",
  styleUrls: ["./pincode-form.component.scss"]
})
export class PincodeFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;


  recordSingularName = "Pincode";
  recordPluralName = "Pincodes";
  modulePath: string = "/backend/admin/pincodes";

  optionsCities: ILov[] = [];
  optionsStates: ILov[] = [];
  optionsDistricts: ILov[] = [];
  optionsCountries: ILov[] = [];
  optionsEarthquakeZones: ILov[] = [];



  constructor(
    private recordService: PincodeService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private countryService: CountryService,
    private districtService: DistrictService,
    private stateService: StateService,
  ) {
    this.optionsEarthquakeZones = OPTIONS_EARTHQUAKE_ZONES;

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IPincode>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.name}`,
              routerLink: [`${this.modulePath}/new`]
            }
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

  createForm(pincode?: IPincode) {
    const district: IDistrict = pincode?.districtId as IDistrict;
    const city: ICity = pincode?.cityId as ICity;
    const country: ICountry = pincode?.countryId as ICountry;
    const state: IState = pincode?.stateId as IState;

    this.recordForm = this.formBuilder.group({
      _id: [pincode?._id],
      name: [pincode?.name, [Validators.required, Validators.pattern("^[0-9]+")]],
      districtId: [district ? { label: district.name, value: district._id } : null, [Validators.required]],
      cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
      stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
      countryId: [country ? { label: country.name, value: country._id } : null, [Validators.required]],
      earthquakeZone: [pincode?.earthquakeZone ? pincode?.earthquakeZone : 'I', [Validators.required]],
      active: [pincode?.active || false]
    });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);
    console.log(this.recordForm.valid);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["countryId"] = this.recordForm.value["countryId"].value;
      updatePayload["cityId"] = this.recordForm.value["cityId"].value;
      updatePayload["districtId"] = this.recordForm.value["districtId"].value;
      updatePayload["stateId"] = this.recordForm.value["stateId"].value;

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
    this.recordService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

  searchOptionsCities(event) {
    this.cityService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsStates(event) {
    this.stateService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsDistricts(event) {
    this.districtService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsDistricts = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsCountries(event) {
    this.countryService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
}
