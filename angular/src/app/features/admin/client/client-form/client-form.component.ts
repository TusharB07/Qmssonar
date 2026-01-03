import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { ICity } from '../../city/city.model';
import { CityService } from '../../city/city.service';
import { IClientGroup } from '../../client-group/client-group.model';
import { ClientGroupService } from '../../client-group/client-group.service';
import { IPincode } from '../../pincode/pincode.model';
import { PincodeService } from '../../pincode/pincode.service';
import { StateService } from '../../state/state.service';
import { IClient } from '../client.model';
import { ClientService } from '../client.service';
import { CalendarModule } from 'primeng/calendar';
import { IState } from '../../state/state.model';
import { ClientKycService } from '../../client-kyc/client-kyc.service';
import { IClientKyc } from "../../client-kyc/client-kyc.model";
import { LazyLoadEvent } from 'primeng/api';
import { Encryption } from 'src/app/shared/encryption';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  date3: Date;

  recordSingularName = "Client";
  recordPluralName = "Clients";
  modulePath: string = "/backend/admin/clients";

  optionsCities: ILov[] = [];
  optionsClientGroups: ILov[] = [];
  optionsStates: ILov[] = [];
  optionsPincodes: ILov[] = [];
  optionsClientKyc: ILov[] = [];
  optionsClientTypes: ILov[] = [];

  constructor(
    private stateService: StateService,
    private cityService: CityService,
    private pincodeService: PincodeService,
    private clientGroupService: ClientGroupService,
    private recordService: ClientService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private clientKycService: ClientKycService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.optionsClientTypes = this.optionsClientTypes;
   }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClient>) => {
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
      this.breadcrumbService.setItems([{ label: "Pages" }, { label: `Add new ${this.recordSingularName}`, routerLink: [`${this.modulePath}/new`] }]);
    }

    // mode: New
    this.createForm();
  }

  createForm(client?: IClient) {
    console.log(client);
    console.log(String(client?.creationDate).split('T')[0])

    // const state: IState = client?.stateId as IState;
    // const city: ICity = client?.cityId as ICity;
    // const pincode: IPincode = client?.pincodeId as IPincode;
    const clientGroup: IClientGroup = client?.clientGroupId as IClientGroup;
    const clientKyc: IClientKyc = client?.clientKycMasterId as IClientKyc;
    let pan
    if(client?.pan) pan = Encryption.decryptData(client?.pan)

    this.recordForm = this.formBuilder.group({

      _id: [client?._id],
      clientType: [client?.clientType, [Validators.required]],
      name: [client?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      shortName: [client?.shortName, [Validators.pattern("^[a-zA-Z -']+")]],
      active: [client?.active, []],
      clientGroupId: [clientGroup ? { label: clientGroup.clientGroupName, value: clientGroup._id } : null, [Validators.required]],
      pan: [pan ?? client?.pan, []],
      copyOfPan: [client?.copyOfPan, []],
      vin: [client?.vin, [Validators.required]],
      leadGenerator: [client?.leadGenerator, [Validators.required]],
      natureOfBusiness: [client?.natureOfBusiness, [Validators.required]],
      creationDate: [client?.creationDate ? String(client?.creationDate).split('T')[0] : null, []],
      claimsManager: [client?.claimsManager, []],
      referralRM: [client?.referralRM, []],
      referredCompany: [client?.referredCompany, []],
      employeeStrength: [client?.employeeStrength, [Validators.required]],
      sameAddressVerification: [client?.sameAddressVerification, [Validators.required]],
    //   contactPerson: [client?.contactPerson, [Validators.required]],
    //   designation: [client?.designation, []],
    //   phone: [client?.phone, [Validators.required]],
    //   email: [client?.email, [Validators.required]],
    //   mobile: [client?.mobile, [Validators.required]],
    //   address: [client?.address, [Validators.required]],
    //   stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
    //   cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
    //   pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
    //   visitingCard: [client?.visitingCard, [Validators.required]],
      narration: [client?.narration, []],
      clientKycMasterId: [clientKyc ? { label: clientKyc.clientGroupName, value: clientKyc._id } : null, [Validators.required]],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["clientGroupId"] = this.recordForm.value["clientGroupId"].value;
      updatePayload["stateId"] = this.recordForm.value["stateId"].value;
      updatePayload["cityId"] = this.recordForm.value["cityId"].value;
      updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;
      updatePayload["clientKycMasterId"] = this.recordForm.value["clientKycMasterId"].value;
      updatePayload['pan'] = Encryption.encryptData(updatePayload['pan'])

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

  searchOptionsPincodes(event) {
    this.pincodeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsClientGroups(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          clientGroupName: [
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
    this.clientGroupService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsClientGroups = data.data.entities.map(entity => ({ label: entity.clientGroupName, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsClientKyc(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          clientGroupName: [
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
    this.clientKycService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsClientKyc = data.data.entities.map(entity => ({ label: entity.clientGroupName, value: entity._id }));
      },
      error: e => { }
    });
  }


}
// public class BasicInputPhoneController implements Serializable {

//   private static final long serialVersionUID = 1L;
//   private String phoneNumber;

//   public void onCountrySelect(final SelectEvent<Country> event) {
//       final Country country = event.getObject();
//       FacesContext.getCurrentInstance().addMessage(null,
//                   new FacesMessage(FacesMessage.SEVERITY_WARN, "Selected " + country.getName(), null));
//   }

//   public void submit() {
//       FacesContext.getCurrentInstance().addMessage(null,
//                   new FacesMessage(FacesMessage.SEVERITY_INFO, "Phone Number  " + phoneNumber, null));
//   }

//   public String getPhoneNumber() {
//       return phoneNumber;
//   }

//   public void setPhoneNumber(final String phoneNumber) {
//       this.phoneNumber = phoneNumber;
//   }

// }
