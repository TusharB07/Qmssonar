import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from '../account.service';
import { ICity } from '../../admin/city/city.model';
import { CityService } from '../../admin/city/city.service';
import { ICountry } from '../../admin/country/country.model';
import { IDistrict } from '../../admin/district/district.model';
import { DistrictService } from '../../admin/district/district.service';
import { IMappedRmEmail, IMappedRmEmailICName, IPartner } from '../../admin/partner/partner.model';
import { PartnerService } from '../../admin/partner/partner.service';
import { IPincode } from '../../admin/pincode/pincode.model';
import { PincodeService } from '../../admin/pincode/pincode.service';
import { IState } from '../../admin/state/state.model';
import { StateService } from '../../admin/state/state.service';
import { IUser } from '../../admin/user/user.model';
import { CountryService } from '../../service/countryservice';
import { LazyLoadEvent } from 'primeng/api';
import { Encryption } from 'src/app/shared/encryption';
import { ThemeService } from './theme.service';
// import { ICity } from '../city/city.model';
// import { CityService } from '../city/city.service';
// import { ICountry } from '../country/country.model';
// import { CountryService } from '../country/country.service';
// import { IDistrict } from '../district/district.model';
// import { DistrictService } from '../district/district.service';
// import { IMappedRmEmail, IMappedRmEmailICName, IPartner, OPTIONS_PARTNER_TYPES } from '../partner/partner.model';
// import { PartnerService } from '../partner/partner.service';
// import { IPincode } from '../pincode/pincode.model';
// import { PincodeService } from '../pincode/pincode.service';
// import { IState } from '../state/state.model';
// import { StateService } from '../state/state.service';
// import { IUser } from '../user/user.model';

@Component({
  selector: 'app-my-organization',
  templateUrl: './my-organization.component.html',
  styleUrls: ['./my-organization.component.scss']
})
export class MyOrganizationComponent implements OnInit {

  id: string;
  mode: FormMode
  recordForm: FormGroup;
  submitted: boolean = false;
  model: any[] = [];
  // data: string;
  isDarkTheme = false;


  recordSingularName = "My-Organization";
  recordPluralName = "Partners";
  modulePath: string = "/backend/admin/partners";

  optionsStates: { label: string; value: string; }[];
  optionsCountries: { label: string; value: string; }[];
  optionsPincodes: { label: string; value: string; }[];
  optionsDistricts: { label: string; value: string; }[];
  optionsCities: { label: string; value: string; }[];



  constructor(
    private recordService: PartnerService,
    private cityService: CityService,
    private districtService: DistrictService,
    private pincodeService: PincodeService,
    private countryService: CountryService,
    private stateService: StateService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private themeService:ThemeService
  ) {
      // this.PartnerType = OPTIONS_PARTNER_TYPES;
      this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme')) || false;
  }
  user: IUser

  partnerData: IPartner;
  ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.paramMap.get("id");


      this.createForm();
      this.recordForm.disable();

      this.accountService.currentUser$.subscribe({
        next: (user: IUser) => {
            this.user = user;
            console.log(user)
            this.recordService.get(this.user.partnerId['_id']).subscribe({
              next:(dto:  IOneResponseDto<IPartner>) => {
                this.createForm(dto.data.entity)
                this.recordForm.disable();
                // console.log(dto.data.entity);

      }

            })
        }
    })



    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.user.partnerId['_id']).subscribe({
          next: (dto: IOneResponseDto<IPartner>) => {
              this.breadcrumbService.setItems([
                  { label: "Pages" },
                  {
                      label: `${dto.data.entity.name}`,
                      routerLink: [`${this.modulePath}/new`]
                  }

                ]);
                console.log(dto.data.entity.name);

              // this.createForm(dto.data.entity);
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
  // this.createForm();
  }

  onBack(){
    this.router.navigateByUrl("/backend")
  }
  
  createForm(partner?: IPartner) {
    // console.log(">>>>>123",partner);
      const city: ICity = partner?.cityId as ICity;
      const district: IDistrict = partner?.districtId as IDistrict;
      const pincode: IPincode = partner?.pincodeId as IPincode;
      const country: ICountry = partner?.countryId as ICountry;
      const state: IState = partner?.stateId as IState;
      let pan
      let gstin
      let cin
      if(partner?.pan) pan = Encryption.decryptData(partner?.pan)
      if(partner?.gstin) gstin = Encryption.decryptData(partner?.gstin)
      if(partner?.cin) cin = Encryption.decryptData(partner?.cin)

      console.log(partner)

      this.recordForm = this.formBuilder.group({


          _id: [partner?._id],
            partnerType: [partner?.partnerType, [Validators.required]],
            name: [partner?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            shortName: [partner?.shortName, [Validators.required]],
            status: [(partner?.status ?? true)],

            address: [partner?.address, [Validators.required]],
            pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
            cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
            districtId: [district ? { label: district.name, value: district._id } : null, [Validators.required]],
            stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
            countryId: [country ? { label: country.name, value: country._id } : null, [Validators.required]],

            pan: [pan ?? partner?.pan, [Validators.required, Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")]],
            gstin: [gstin ?? partner?.gstin, [Validators.required, Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
            cin: [cin ?? partner?.cin, [Validators.required]],

            contactPerson: [partner?.contactPerson, [Validators.required]],
            designation: [partner?.designation, [Validators.required]],
            mobileNumber: [partner?.mobileNumber, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            mappedIcNames: [partner?.mappedIcNames, [Validators.required]],
            // mappedIcNames: this.formBuilder.array(partner?.mappedIcNames?.length > 0 ? partner?.mappedIcNames.map((icName: IMappedRmEmailICName) =>{}):[]),//:[[partner?.mappedIcNames]]);


      });

      this.recordForm.controls['pincodeId'].valueChanges.subscribe(pincode => {

        if (pincode) {

            this.pincodeService.get(pincode.value).subscribe({
                next: (dto: IOneResponseDto<IPincode>) => {
                    console.log(dto.data.entity);

                    const pincode = dto.data.entity as IPincode

                    const country = pincode.countryId as ICountry;
                    const city = pincode.cityId as ICity;
                    const state = pincode.stateId as IState;
                    const district = pincode.districtId as IDistrict;

                    this.recordForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                    this.recordForm.controls['stateId'].setValue({ value: state._id, label: state.name });
                    this.recordForm.controls['districtId'].setValue({ value: district._id, label: district.name });
                    this.recordForm.controls['countryId'].setValue({ value: country._id, label: country.name });
                }
            })
        }
    })



  }

  saveRecord() {
    console.log(this.recordForm);

    if (this.recordForm.valid) {
        const updatePayload = { ...this.recordForm.value };
        updatePayload["cityId"] = this.recordForm.value["cityId"].value;
        updatePayload["districtId"] = this.recordForm.value["districtId"].value;
        updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;
        updatePayload["countryId"] = this.recordForm.value["countryId"].value;
        updatePayload["stateId"] = this.recordForm.value["stateId"].value;
        updatePayload['pan'] = Encryption.encryptData(updatePayload['pan'])
        updatePayload['gstin'] = Encryption.encryptData(updatePayload['gstin'])
        updatePayload['cin'] = Encryption.encryptData(updatePayload['cin'])

        updatePayload["mappedIcNames"] = this.recordForm.value['mappedIcNames'].map((icName: IMappedRmEmailICName) => ({
            name: icName.name,
            mappedRmEmails: icName.mappedRmEmails.map((rmEmail: IMappedRmEmail) => ({ email: rmEmail }))
        }))



        // console.log(">>>>>", updatePayload)

        if (this.mode === "edit") {
            this.recordService.update(this.user.partnerId['_id'], updatePayload).subscribe({
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
            // this.router.navigateByUrl(`${this.modulePath}`);
        }

    }
}



  onCancel() {
      this.router.navigateByUrl(`/`);
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

searchOptionsDistricts(event) {
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
    this.districtService.getMany(lazyLoadEvent).subscribe({
        next: data => {
            this.optionsDistricts = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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

// searchOptionsCountries(event) {
//     this.countryService.getMany(event).subscribe({
//         next: data => {
//             this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
//         },
//         error: e => { }
//     });
// }

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
// Insurance Company Mapping Recursive Form

get mappedIcNames(): FormArray {
    return this.recordForm.get("mappedIcNames") as FormArray;
};

createICMappingFormRow(mappedIcName?: IMappedRmEmailICName): FormGroup {
  console.log(">>>>>ICNAME",mappedIcName);

    return this.formBuilder.group({
        name: [mappedIcName?.name, [Validators.required]],
        // mappedRmEmails: [mappedIcName?.mappedRmEmails?.map((rmEmail: IMappedRmEmail) => rmEmail.email), [] ],  // rmEmail: [['harish@test.com'], []],
    });
};

onAddICMappingRow(): void {
    this.mappedIcNames.push(this.createICMappingFormRow());
};

onDeleteICMappingRow(rowIndex: number): void {
    this.mappedIcNames.removeAt(rowIndex);
}

toggleDarkMode(): void {
  this.isDarkTheme = !this.isDarkTheme;
  this.themeService.setTheme(this.isDarkTheme);
}



}
export class MyModel {

  // values: string[];

}
