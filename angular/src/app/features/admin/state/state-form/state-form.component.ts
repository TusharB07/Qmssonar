import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { ICountry } from '../../country/country.model';
import { CountryService } from '../../country/country.service';
import { IState } from '../state.model';
import { StateService } from '../state.service';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.scss']
})
export class StateFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "State";
  recordPluralName = "States";
  modulePath: string = "/backend/admin/states";

  optionsCountries: ILov[] = [];

  constructor(
    private recordService: StateService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private countryService: CountryService,

    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IState>) => {
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

  createForm(state?: IState) {

    const country: ICountry = state?.countryId as ICountry;

    this.recordForm = this.formBuilder.group({
      _id: [state?._id],
      name: [state?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      stateCode: [state?.stateCode, [Validators.required]],
      countryId: [country ? { label: country.name, value: country._id } : null, [Validators.required]],
    });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["countryId"] = this.recordForm.value["countryId"].value;

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

  searchOptionsCountries(event) {
    this.countryService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }


}
