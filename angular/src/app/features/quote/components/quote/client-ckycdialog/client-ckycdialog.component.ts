import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { ClientGroupService } from 'src/app/features/admin/client-group/client-group.service';
import { AllowedClientTypes, AllowedKycTypes, IApiDetails, IClient, OPTIONS_CLIENT_TYPES, OPTIONS_KYC_TYPES, OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP, OPTION_GENDER_LIST } from 'src/app/features/admin/client/client.model';
import { ClientService } from 'src/app/features/admin/client/client.service';
import { CreateClientGroupComponent } from 'src/app/features/broker/create-client-group/create-client-group.component';
import { ChoosePaymentModeDialogComponent } from '../choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { DatePipe } from '@angular/common';
import { ChooseVerificationModeDialogComponent } from '../../choose-verification-mode-dialog/choose-verification-mode-dialog.component';
import { CustomValidator } from 'src/app/shared/validators';
import { PincodeService } from 'src/app/features/admin/pincode/pincode.service';
import { StateService } from 'src/app/features/admin/state/state.service';
import { CityService } from 'src/app/features/admin/city/city.service';
import { ICity } from 'src/app/features/admin/city/city.model';
import { IDistrict } from 'src/app/features/admin/district/district.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { IState } from 'src/app/features/admin/state/state.model';
import { CkycVerifiedDialogComponent } from '../../ckyc-verified-dialog/ckyc-verified-dialog.component';
import { Encryption } from 'src/app/shared/encryption';

@Component({
  selector: 'app-client-ckycdialog',
  templateUrl: './client-ckycdialog.component.html',
  styleUrls: ['./client-ckycdialog.component.scss']
})
export class ClientCKYCDialogComponent implements OnInit, OnChanges {

  clientForm: FormGroup;
  optionKycTypes: ILov[] = [];
  optionKycTypesForCompanyAndGroup: ILov[] = [];
  optionsClientTypes: ILov[] = [];
  optionsClientGroups: ILov[] = [];
  optionsPincodes: ILov[] = [];
  optionsCities: ILov[] = [];
  optionsStates: ILov[] = [];
  optionGender: ILov[] = [];
  payload: any
  quote: any
  uploadUsingURL: boolean = true;
  proposal_id: string;
  isCKYCTemplate: boolean = false;
  AllowedKycTypes = AllowedKycTypes
  isDataFetched: boolean = false;
  submitted: boolean = false;
  isClientPresent: boolean = false;
  fgiClientId: string;
  fgiCreateClient: boolean = false ;


  constructor(
    public ref: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private dialogService: DialogService,
    private config: DynamicDialogConfig,
    private clientGroupService: ClientGroupService,
    public messageService: MessageService,
    public quoteService: QuoteService,
    private datepipe: DatePipe,
    private pincodeService: PincodeService,
    private cityService: CityService,
    private stateService: StateService
  ) {
    this.optionGender = OPTION_GENDER_LIST;
    this.optionsClientTypes = OPTIONS_CLIENT_TYPES;
    this.optionKycTypes = OPTIONS_KYC_TYPES;
    this.optionKycTypesForCompanyAndGroup = OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP
    this.isCKYCTemplate = this.config.data.isCKYCTemplate
  }

  ngOnInit(): void {
    this.createClientForm();
    this.quote = this.config.data.quote
    const clientId = this.config.data.quote.clientId._id

    this.clientService.get(clientId).subscribe(payload => {
      console.log(payload.data.entity)
      this.createClientForm(payload.data.entity)
      if (this.quote.totalIndictiveQuoteAmtWithGst < 100000) {
        this.clientForm.get('pancard')?.clearValidators()
        // this.clientForm.get('pancard')?.setValidators([Validators.required, CustomValidator.panValidator])
        this.clientForm.get('pancard')?.updateValueAndValidity()
      }
    })
  }

  ngOnChanges() {
    this.optionKycTypes = []
    this.clientForm.controls['clientType'].valueChanges.subscribe(clientType => {
      if (clientType == 'indvidual') {
        this.optionKycTypes = OPTIONS_KYC_TYPES
      } else {
        this.optionKycTypes = OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP
      }
    })
  }

  searchOptionsClientGroups(event) {
    this.clientGroupService.getMatchingClientGroups(event.query).subscribe({
      next: data => {

        const optionsClientGroups: ILov[] = [];
        for (let i = 0; i < data.data.entities.length; i++) {
          const entity = data.data.entities[i];
          optionsClientGroups.push({
            label: entity.clientGroupName,
            value: entity._id
          });
        }
        this.optionsClientGroups = optionsClientGroups;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  createClientForm(clientData?: any) {
    console.log(clientData)
    let pan
    let kycNumber
    if(clientData?.pan) pan = Encryption.decryptData(clientData?.pan)
    if(clientData?.kycNumber) kycNumber = Encryption.decryptData(clientData?.kycNumber)

    this.clientForm = this.formBuilder.group({
      _id: [clientData?._id],
      clientType: [clientData?.clientType, [Validators.required]],
      clientGroupId: [{ value: clientData?.clientType != 'individual' ? { label: clientData?.clientGroupId?.['clientGroupName'], value: clientData?.clientGroupId?.['_id'] } : null, disabled: true }, []],
      name: [clientData?.name ?? null, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      // shortName: [{value : clientData?.shortName , disabled : true}, [Validators.pattern("^[a-zA-Z -']+"), Validators.minLength(3)]],
      // pan: [clientData?.pan, [ Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")]],
      // gst: [clientData?.gst, [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
      // vin: [clientData?.vin, [Validators.required]],
      // leadGenerator: [clientData?.leadGenerator, [Validators.pattern("^[a-zA-Z -']+")]],
      // natureOfBusiness: [clientData?.natureOfBusiness, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      // claimsManager: [clientData?.claimsManager, [Validators.pattern("^[a-zA-Z -']+")]],
      // referralRM: [clientData?.referralRM, [Validators.pattern("^[a-zA-Z -']+")]],
      // referredCompany: [clientData?.referredCompany, [Validators.pattern("^[a-zA-Z -']+")]],
      // employeeStrength: [clientData?.employeeStrength, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      dateOfIncorporation: [clientData?.dateOfIncorporation ? String(clientData?.dateOfIncorporation).split('T')[0] : null, [Validators.required]],
      lastName: [clientData?.lastName],
      gender: [],
      contactNo: [, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      email: [, [Validators.required, CustomValidator.emailValidator]],
      street: [, [Validators.required]],
      street2: [],
      street3: [],
      kycType: [clientData?.kycType, [Validators.required]],
      kycNumber: [kycNumber ?? clientData?.kycNumber, [Validators.required, CustomValidator.panValidator]],
      pincodeId: [null, [Validators.required]],
      stateId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      fgiClientId : [],
      pancard: [pan ?? clientData?.pan, [CustomValidator.panValidator]],
      varifiedKycNumber : [clientData?.varifiedKycNumber]
    });

    this.clientForm.controls['pincodeId'].valueChanges.subscribe(pincode => {

      if (pincode) {

        this.pincodeService.get(pincode.value).subscribe({
          next: (dto: IOneResponseDto<IPincode>) => {
            console.log(dto.data.entity);

            const pincode = dto.data.entity as IPincode

            const city = pincode.cityId as ICity;
            const state = pincode.stateId as IState;
            const district = pincode.districtId as IDistrict

            this.clientForm.controls['districtId'].setValue({ value: district._id, label: district.name });
            this.clientForm.controls['cityId'].setValue({ value: city._id, label: city.name });
            this.clientForm.controls['stateId'].setValue({ value: state._id, label: state.name });
          }
        })
      }
    })

    this.clientForm.controls['clientType'].valueChanges.subscribe(value => {

      console.log(this.clientForm)
      if (value === AllowedClientTypes.GROUP) {
        this.clientForm.controls['clientGroupId'].enable()
      } else {
        this.clientForm.controls['clientGroupId'].disable()
      }
    })
  }

  onSaveClient() {
    const payload = { ...this.clientForm.value }
    console.log(this.clientForm.value)
    delete payload['pincodeId']
    delete payload['cityId']
    delete payload['stateId']
    delete payload['districtId']
    payload['cityId'] = this.clientForm?.value['cityId']?.value
    payload['stateId'] = this.clientForm?.value['stateId']?.value
    payload['districtId'] = this.clientForm?.value['districtId']?.value
    payload['pincodeId'] = this.clientForm?.value['pincodeId']?.value
    const formattedDate = this.datepipe.transform(payload['dateOfIncorporation'], 'yyyy-MM-dd');
    console.log(formattedDate)
    delete payload['dateOfIncorporation']
    payload['dateOfIncorporation'] = formattedDate
    if (this.clientForm?.value['pancard']) {
      payload['pan'] = Encryption.encryptData(this.clientForm?.value['pancard']) 
      delete payload['pancard']
    }
    if (this.clientForm?.value['kycType'] == AllowedKycTypes.PAN) {
      payload['pan'] = Encryption.encryptData(this.clientForm?.value['kycNumber']);
      // payload['vin'] = null;
    }
    if (this.clientForm?.value['kycType'] == AllowedKycTypes.CIN) {
      payload['vin'] = this.clientForm?.value['kycNumber'];
      // payload['pan'] = null;
    }
    payload['kycNumber'] = Encryption.encryptData(payload['kycNumber'])

    console.log(payload);

    this.clientService.update(payload._id, payload).subscribe(data => {
      console.log(data)
      this.messageService.add({ severity: 'success', summary: 'Data Successfully Updated' });
    })
  }

  openCreateClientGroupDialog() {
    const ref = this.dialogService.open(CreateClientGroupComponent, {
      header: "Create A Client Group",
      width: "50%",
      styleClass: "customPopup"
    });
  }


  checkClientKyc() {
    let kycFailed = false;
    console.log(this.clientForm.value)
    const payload = { ...this.clientForm.value }
    delete payload['pincodeId']
    delete payload['cityId']
    delete payload['stateId']
    delete payload['districtId']
    payload['cityId'] = this.clientForm?.value['cityId']?.value
    payload['stateId'] = this.clientForm?.value['stateId']?.value
    payload['districtId'] = this.clientForm?.value['districtId']?.value
    payload['pincodeId'] = this.clientForm?.value['pincodeId']?.value
    const formattedDate = this.datepipe.transform(payload['dateOfIncorporation'], 'dd-MM-yyyy');
    console.log(formattedDate)
    delete payload['dateOfIncorporation']
    payload['dateOfIncorporation'] = formattedDate
    if (this.clientForm?.value['pancard']) {
      payload['pan'] = Encryption.encryptData(this.clientForm?.value['pancard'])
      delete payload['pancard']
    }
    if (this.clientForm?.value['kycType'] == AllowedKycTypes.PAN) {
      payload['pan'] = Encryption.encryptData(this.clientForm?.value['kycNumber']);
      // payload['vin'] = null;
    }
    if (this.clientForm?.value['kycType'] == AllowedKycTypes.CIN) {
      payload['vin'] = this.clientForm?.value['kycNumber'];
      // payload['pan'] = null;
    }
    payload['quoteId'] = this.quote['_id']
    payload['kycNumber'] = Encryption.encryptData(payload['kycNumber'])
    this.quoteService.createKyc(payload).subscribe(response => {
      console.log(response)
      if (response?.['status'] == 'success') {
        kycFailed = false
        const formattedDate = this.datepipe.transform(payload['dateOfIncorporation'], 'yyyy-MM-dd');
        payload['dateOfIncorporation'] = formattedDate
        // @ts-ignore
        payload['varifiedKycNumber'] = response.data.entity.createKyc.result.ckyc_number
        delete payload['quoteId']
        this.clientService.update(payload._id, payload).subscribe(data => {
          this.messageService.add({ severity: 'success', summary: 'Data Successfully Updated' });
          this.ref.close()
          this.openVerificatioModeDialog()
        })
      }
      else {
        this.uploadUsingURL = false
        // @ts-ignore
        this.proposal_id = response.data.entity.createKyc.proposal_id
        this.messageService.add({
          severity: "error",
          summary: "Fail",
          detail: response?.['message'],
          life: 3000
        });
      }
    })
  }

  getClientDetais() {
    let payload = {
      "ID_Type": "PAN",
      "ID_Value": ""
    }
    if (!this.clientForm.controls['kycNumber'].errors?.['invalidPAN']) {
      payload.ID_Value = Encryption.encryptData(this.clientForm.value.kycNumber)

      this.quoteService.getClientDetails(payload).subscribe(response => {
        console.log(response)
        this.isDataFetched = true;
        this.submitted = true;
        if (response['data'].entity?.clientData) {
          this.messageService.add({ severity: 'success', summary: 'Client Data fetched successfully' });
          if(response['data'].entity?.clientData.proposalId) {
            this.isClientPresent = true;
          }
          else {
            this.isClientPresent = false;
          }
          let clientData = response['data'].entity?.clientData;
          this.proposal_id = response['data'].entity?.clientData.proposalId;
          this.fgiClientId = response['data'].entity?.clientData.fgiClientId;
          this.fgiCreateClient = response['data'].entity?.clientData.fgiCreateClient;

          this.clientForm.controls['fgiClientId'].setValue(this.fgiClientId);

          if (clientData?.pincodeId) {
            this.pincodeService.get(clientData?.pincodeId?._id).subscribe({
              next: (dto: IOneResponseDto<IPincode>) => {
                console.log(dto.data.entity);

                const pincode = dto.data.entity as IPincode

                const city = pincode.cityId as ICity;
                const state = pincode.stateId as IState;
                const district = pincode.districtId as IDistrict

                this.clientForm.controls['districtId'].setValue({ value: district._id, label: district.name });
                this.clientForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                this.clientForm.controls['stateId'].setValue({ value: state._id, label: state.name });
              }
            })
          }
          const pan = Encryption.decryptData(clientData?.pan)
          const kycNumber = Encryption.decryptData(clientData?.kycNumber)
          this.clientForm.patchValue({
            clientType: clientData?.clientType,
            clientGroupId: { value: clientData?.clientType != 'individual' ? { label: clientData?.clientGroupId?.['clientGroupName'], value: clientData?.clientGroupId?.['_id'] } : null, disabled: true },
            name: clientData?.name,
            dateOfIncorporation: clientData?.dateOfIncorporation ? String(clientData?.dateOfIncorporation).split('T')[0] : null,
            lastName: clientData?.lastName,
            gender: clientData?.gender,
            contactNo: clientData?.contactNo,
            email: clientData?.email,
            street: clientData?.street,
            street2: clientData?.street2,
            street3: clientData?.street3,
            kycType: clientData?.kycType,
            kycNumber: kycNumber,
            pincodeId: { label: clientData?.pincodeId?.['name'], value: clientData?.pincodeId?.['_id'] },
            pancard: pan,
            varifiedKycNumber : clientData?.varifiedKycNumber
          })
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'No client is present with this PAN' });
          this.isClientPresent = false;
          this.clientForm.patchValue({
            dateOfIncorporation: null,
            gender: null,
            contactNo: null,
            email: null,
            street: null,
            street2: null,
            street3: null,
            pincodeId: null,
            pancard: null,
            stateId: null,
            cityId: null,
            districtId: null,
            varifiedKycNumber : null
          })
        }
      }, error => {
        console.log(error);
      })
    }
    else {
      this.messageService.add({
        severity: "error",
        summary: "Invalid PAN",
        detail: "",
        life: 3000
      });
    }
  }

  saveFGIClient() {
    // let kycFailed = false;

    const payload = { ...this.clientForm.value }
    console.log(payload);
    delete payload['pincodeId']
    delete payload['cityId']
    delete payload['stateId']
    delete payload['districtId']
    payload['cityId'] = this.clientForm?.value['cityId']?.value
    payload['stateId'] = this.clientForm?.value['stateId']?.value
    payload['districtId'] = this.clientForm?.value['districtId']?.value
    payload['pincodeId'] = this.clientForm?.value['pincodeId']?.value
    const formattedDate = this.datepipe.transform(payload['dateOfIncorporation'], 'yyyy-MM-dd');
    payload['fgiClientId'] = this.fgiClientId;
    payload['fgiCreateClient'] = this.fgiCreateClient;
    let apiDetailsObj: IApiDetails = {
      isCKYC: true,
      partnerId: {
        _id: this.quote.partnerId["_id"],
        name: this.quote.partnerId["name"]
      },
      quoteNo: this.quote?.quoteNo,
      proposalId: this.proposal_id
    };
    const apiDetailsArray = this.quote.clientId["apiDetails"];
    apiDetailsArray.push(apiDetailsObj);
    payload['apiDetails'] = apiDetailsArray;


    delete payload['dateOfIncorporation']
    payload['dateOfIncorporation'] = formattedDate
    if (this.clientForm?.value['pancard']) {
      payload['pan'] = Encryption.encryptData(this.clientForm?.value['pancard'])
      delete payload['pancard']
    }
    if (this.clientForm?.value['kycType'] == AllowedKycTypes.PAN) {
      payload['pan'] = Encryption.encryptData(this.clientForm?.value['kycNumber']);
    }
    payload['kycNumber'] = Encryption.encryptData(payload['kycNumber'])
    console.log(payload);

    this.clientService.update(payload._id, payload).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Data Successfully Updated' });
      const formattedDate = this.datepipe.transform(payload['dateOfIncorporation'], 'dd-MM-yyyy');
      console.log(formattedDate)
      delete payload['dateOfIncorporation']
      payload['quoteId'] = this.quote['_id']
      payload['dateOfIncorporation'] = formattedDate
      this.ref.close()
      this.openVerificatioModeDialog()
      /* this.quoteService.createKyc(payload).subscribe(response => {
        console.log(response)
        if (response?.['status'] == 'success') {
          kycFailed = false
        }
        else {
          this.uploadUsingURL = false
          // @ts-ignore
          this.proposal_id = response.data.entity.createKyc.proposal_id
          this.messageService.add({
            severity: "error",
            summary: "Fail",
            detail: response?.['message'],
            life: 3000
          });
        }
      }) */
    })
  }

  openVerificatioModeDialog(kycFailed?: boolean) {
    const ref = this.dialogService.open(kycFailed ? ChooseVerificationModeDialogComponent : CkycVerifiedDialogComponent, {
      header: kycFailed ? 'Upload Document' : ' ',
      data: {
        quote: this.quote,
        kycFailed: kycFailed,
        proposal_id: this.proposal_id,
        isCKYCTemplate: this.isCKYCTemplate
      },
      width: kycFailed ? '45%' : '400px',
      // height: '40%',
      styleClass: kycFailed ? "customPopup" : "flatpopup"
    })

    ref.onClose.subscribe({
      next: () => {
        // this.quoteService.refresh()
      }
    })
    // this.ref?.close();
  }
  // openVerificatioModeDialog1() {
  //   const ref = this.dialogService.open(ChooseVerificationModeDialogComponent, {
  //     header: 'Kyc Authentication Failed! Upload Document',
  //     data: {
  //       quote: this.quote,
  //       // kycFailed : kycFailed
  //     },
  //     // width:  kycFailed ? '50%' : '320px',
  //     // height: '40%',
  //     // styleClass:  kycFailed ? "customPopup": "flatpopup"
  //   })

  //   ref.onClose.subscribe({
  //     next: () => {
  //       // this.quoteService.refresh()
  //     }
  //   })
  //   // this.ref?.close();
  // }

  addCustomValidors(event) {
    if (event.value == AllowedKycTypes.PAN) {
      this.clientForm.get('pancard')?.clearValidators()
      this.clientForm.get('pancard')?.updateValueAndValidity()
    } else if (event.value != AllowedKycTypes.PAN && this.quote.totalIndictiveQuoteAmtWithGst < 100000) {
      this.clientForm.get('pancard')?.clearValidators()
      this.clientForm.get('pancard')?.updateValueAndValidity()
    }
    else {
      this.clientForm.get('pancard')?.clearValidators()
      this.clientForm.get('pancard')?.setValidators([Validators.required, CustomValidator.panValidator])
      this.clientForm.get('pancard')?.updateValueAndValidity()
    }
    switch (event.value) {
      case AllowedKycTypes.AADHARCARD:
        this.clientForm.get('kycNumber')?.clearValidators()
        this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.aadharValidator])
        break;
      case AllowedKycTypes.VOTER:
        this.clientForm.get('kycNumber')?.clearValidators()
        this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.voterIDValidator])
        break;
      case AllowedKycTypes.PASSPORT:
        this.clientForm.get('kycNumber')?.clearValidators()
        this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.passportValidator])
        break;
      case AllowedKycTypes.DL:
        this.clientForm.get('kycNumber')?.clearValidators()
        this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.drivingLicenceValidator])
        break;
      case AllowedKycTypes.CIN:
        this.clientForm.get('kycNumber')?.clearValidators()
        this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.cinValidator])
        break;
      case AllowedKycTypes.PAN:
        this.clientForm.get('kycNumber')?.clearValidators()
        this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.panValidator])
        break;

      default:
        break;
    }
    this.clientForm.get('kycNumber')?.updateValueAndValidity()
  }

  searchOptionsPincodes(event) {
    this.pincodeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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

  searchOptionsStates(event) {
    this.stateService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }

}
