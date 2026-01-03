import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ICity } from '../../city/city.model';
import { CityService } from '../../city/city.service';
import { IPincode } from '../../pincode/pincode.model';
import { PincodeService } from '../../pincode/pincode.service';
import { IState } from '../../state/state.model';
import { StateService } from '../../state/state.service';
import { IClientContact } from '../client-contact.model';
import { ClientContactService } from '../client-contact.service';

@Component({
  selector: 'app-client-contact-form',
  templateUrl: './client-contact-form.component.html',
  styleUrls: ['./client-contact-form.component.scss']
})
export class ClientContactFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Client Contact";
  recordPluralName = "Client Contacts";
  modulePath: string = "/backend/admin/client-contacts";

  // optionsStates: ILov[] = [];
  optionsCities: ILov[] = [];
  optionsStates: ILov[] = [];
  optionsPincodes: ILov[] = [];

  constructor(
    private recordService: ClientContactService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private stateService: StateService,
    private cityService: CityService,
    private pincodeService: PincodeService,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClientContact>) => {
          /* this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.name}`,
              routerLink: [`${this.modulePath}/new`]
            }
          ]); */

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

  createForm(item?: IClientContact) {
    // const state = city?.stateId as IState;
    const state: IState = item?.stateId as IState;
    const city: ICity = item?.cityId as ICity;
    const pincode: IPincode = item?.pincodeId as IPincode;

    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      contactPerson: [item?.contactPerson],
      designation: [item?.designation],
      phone: [item?.phone],
      email: [item?.email],
    //   mobile: [item?.mobile],
      address: [item?.address],
      stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
      cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
      pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
      visitingCard: [item?.visitingCard]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
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
    if(this.activatedRoute.snapshot.paramMap.get("clientId")){
      this.router.navigateByUrl(`/backend/admin/clients/${this.activatedRoute.snapshot.paramMap.get("clientId")}`);
    }
    else{
      this.router.navigateByUrl(`${this.modulePath}`);
    }
  }

  searchOptionsCities(event) {
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
    this.cityService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsStates(event) {
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
    this.stateService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsPincodes(event) {
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
    this.pincodeService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

}
