import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { ICity } from '../../city/city.model';
import { CityService } from '../../city/city.service';
import { IClient } from '../../client/client.model';
import { ClientService } from '../../client/client.service';
import { IPincode } from '../../pincode/pincode.model';
import { PincodeService } from '../../pincode/pincode.service';
import { IState } from '../../state/state.model';
import { StateService } from '../../state/state.service';
import { IClientLocation } from '../client-location.model';
import { ClientLocationService } from '../client-location.service';

@Component({
  selector: 'app-client-location-form',
  templateUrl: './client-location-form.component.html',
  styleUrls: ['./client-location-form.component.scss']
})
export class ClientLocationFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Client Location";
  recordPluralName = "Client Location";
  modulePath: string = "/backend/admin/client-locations";

  optionsStates: ILov[] = [];
  optionsCities: ILov[] = [];
  optionsPincodes: ILov[] = [];
  optionsClients: ILov[] = [];


  constructor(
    private recordService: ClientLocationService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private stateService: StateService,
    private cityService: CityService,
    private pincodeService: PincodeService,
    private clientService: ClientService,

  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClientLocation>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.locationName}`,
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

  createForm(clientLocation?: IClientLocation) {
    const city = clientLocation?.cityId as ICity;
    const state = clientLocation?.stateId as IState;
    const pincode = clientLocation?.pincodeId as IPincode;
    const client = clientLocation?.clientId as IClient;

    this.recordForm = this.formBuilder.group({
      _id: [clientLocation?._id],
      address: [clientLocation?.address, [ Validators.pattern("^[a-zA-Z0-9_-].*")]],
      cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
      stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
      pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
      locationName: [clientLocation?.locationName, [ Validators.pattern("^[a-zA-Z ']+$")]],
      clientId: [client ? { label: client.name, value: client._id } : null, [Validators.required]],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["stateId"] = this.recordForm.value["stateId"].value;
      updatePayload["cityId"] = this.recordForm.value["cityId"].value;
      updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;
      updatePayload["clientId"] = this.recordForm.value["clientId"].value;

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
    if(this.activatedRoute.snapshot.paramMap.get("clientId")){
      this.router.navigateByUrl(`/backend/admin/clients/${this.activatedRoute.snapshot.paramMap.get("clientId")}`);
    }
    else{
      this.router.navigateByUrl(`${this.modulePath}`);
    }
  }

  searchOptionsStates(event) {
    this.stateService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsCities(event) {
    this.cityService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsPincodes(event) {
    this.pincodeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsClients(event) {
    this.clientService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsClients = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

}
