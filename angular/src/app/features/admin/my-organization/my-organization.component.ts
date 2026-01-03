import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from '../../account/account.service';
import { ICity } from '../city/city.model';
import { CityService } from '../city/city.service';
import { ICountry } from '../country/country.model';
import { CountryService } from '../country/country.service';
import { IDistrict } from '../district/district.model';
import { DistrictService } from '../district/district.service';
import { IMappedRmEmail, IMappedRmEmailICName, IPartner, OPTIONS_PARTNER_TYPES } from '../partner/partner.model';
import { PartnerService } from '../partner/partner.service';
import { IPincode } from '../pincode/pincode.model';
import { PincodeService } from '../pincode/pincode.service';
import { IState } from '../state/state.model';
import { StateService } from '../state/state.service';
import { IUser } from '../user/user.model';
import { Encryption } from 'src/app/shared/encryption';

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

  recordSingularName = "My- Organization";
  recordPluralName = "Partners";
  modulePath: string = "/backend/admin/partners";

  // optionsStates: { label: string; value: string; }[];
  // optionsCountries: { label: string; value: string; }[];
  // optionsPincodes: { label: string; value: string; }[];
  // optionsDistricts: { label: string; value: string; }[];
  // optionsCities: { label: string; value: string; }[];


  optionsCities: ILov[] = [];
  optionsDistricts: ILov[] = [];
  optionsStates: ILov[] = [];
  optionsPincodes: ILov[] = [];
  optionsCountries: ILov[] = [];
  optionsPartnerType: ILov[] = [];
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
    private accountService: AccountService
  ) {
      // this.PartnerType = OPTIONS_PARTNER_TYPES;
  }
  user: IUser

  ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.paramMap.get("id");


      this.createForm();

      this.accountService.currentUser$.subscribe({
        next: (user: IUser) => {
            this.user = user;
            console.log(user)
        }
    })

    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
          next: (dto: IOneResponseDto<IPartner>) => {
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

  createForm(partner?: IPartner) {
    console.log(">>>>>123",partner);
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

      this.recordForm = this.formBuilder.group({
        _id: [partner?._id],
        partnerType: [partner?.partnerType],
        name: [partner?.name, ],
        shortName: [partner?.shortName],
        status: [(partner?.status ?? true)],

        address: [partner?.address],
        pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null,],
        cityId: [city ? { label: city.name, value: city._id } : null, ],
        districtId: [district ? { label: district.name, value: district._id } : null],
        stateId: [state ? { label: state.name, value: state._id } : null],
        countryId: [country ? { label: country.name, value: country._id } : null, ],

        pan: [pan ?? partner?.pan],
        gstin: [gstin ?? partner?.gstin],
        cin: [cin ?? partner?.cin],

        contactPerson: [partner?.contactPerson, ],
        designation: [partner?.designation, ],
        mobileNumber: [partner?.mobileNumber, ],
        //   mappedIcNames: this.formBuilder.array(partner?.mappedIcNames?.length > 0 ? partner?.mappedIcNames.map((icName: IMappedRmEmailICName) =>{}): []),


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
            this.recordService.update(this.id, updatePayload).subscribe({
                next: partner => {
                    this.router.navigateByUrl(`${this.modulePath}`);
                },
                error: error => {
                    console.log(error);
                }
            });
            // this.router.navigateByUrl(`${this.modulePath}`);
          }

        // if (this.mode === "new") {
        //     this.recordService.create(updatePayload).subscribe({
        //         next: partner => {
        //             this.router.navigateByUrl(`${this.modulePath}`);
        //         },
        //         error: error => {
        //             console.log(error);
        //         }
        //     });
        //     // this.router.navigateByUrl(`${this.modulePath}`);
        // }

    }
}



  onCancel() {
      this.router.navigateByUrl(`${this.modulePath}`);
      this.router.navigateByUrl(`/`);
  }


  searchOptionsCities(event) {
      this.cityService.getManyAsLovs(event).subscribe({
          next: data => {
              this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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

  searchOptionsPincodes(event) {
      this.pincodeService.getManyAsLovs(event).subscribe({
          next: data => {
              this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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

  searchOptionsStates(event) {
      this.stateService.getManyAsLovs(event).subscribe({
          next: data => {
              this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
          },
          error: e => { }
      });
  }

}
export class MyModel {

  // values: string[];

}
