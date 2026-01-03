import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { ICity } from '../../admin/city/city.model';
import { CityService } from '../../admin/city/city.service';
import { ClientGroupService } from '../../admin/client-group/client-group.service';
import { ICountry } from '../../admin/country/country.model';
import { CountryService } from '../../admin/country/country.service';
import { IPincode } from '../../admin/pincode/pincode.model';
import { PincodeService } from '../../admin/pincode/pincode.service';
import { IState } from '../../admin/state/state.model';
import { StateService } from '../../admin/state/state.service';

@Component({
    selector: 'app-create-client-group',
    templateUrl: './create-client-group.component.html',
    styleUrls: ['./create-client-group.component.scss']
})
export class CreateClientGroupComponent implements OnInit {



    constructor(
        private formBuilder: FormBuilder,
        private clientGroupService: ClientGroupService,
        private cityService: CityService,
        private stateService: StateService,
        private pincodeService: PincodeService,
        private ref: DynamicDialogRef,
        private countryService: CountryService,

    ) { }

    ngOnInit(): void {
        this.createClientGroupForm();

    }

    optionsCities: ILov[] = [];
    optionsStates: ILov[] = [];
    optionsPincodes: ILov[] = [];
    optionsCountries: ILov[] = [];


    clientGroupForm: FormGroup;
    submittedClientGroupForm: boolean = false;

    createClientGroupForm() {
        let form = this.clientGroupForm = this.formBuilder.group({
            vin: [null, [Validators.required]],
            clientGroupName: [null, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            clientGroupContactName: [null, [Validators.required]],
            address: [null, [Validators.required]],
            stateId: [{ value: null }, [Validators.required]],
            cityId: [{ value: null }, [Validators.required]],
            countryId: [{ value: null }, [Validators.required]],
            pincodeId: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            active: [null]
        });

        form.controls['pincodeId'].valueChanges.subscribe(pincode => {

            console.log(pincode)
            if (pincode?.value) {

                this.pincodeService.get(pincode.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        console.log(dto.data.entity);

                        const pincode = dto.data.entity as IPincode

                        const city = pincode.cityId as ICity;
                        const state = pincode.stateId as IState;

                        form.controls['cityId'].setValue({ value: city._id, label: city.name });
                        form.controls['stateId'].setValue({ value: state._id, label: state.name });
                    }
                })
            }
        })

        return form;
    }


    onSaveClientGroup() {
        console.log(this.clientGroupForm.value);
        if (this.clientGroupForm.valid) {
            const updatePayload = { ...this.clientGroupForm.value };
            updatePayload["cityId"] = this.clientGroupForm.value["cityId"].value;
            updatePayload["pincodeId"] = this.clientGroupForm.value["pincodeId"].value;

            this.clientGroupService.create(updatePayload).subscribe({
                next: partner => {
                    //   this.createClientActiveTabIndex = 2;

                    //   this.createClientForm();
                    this.ref.close();
                    // this.router.navigateByUrl(`${this.modulePath}`);
                },
                error: error => {
                    console.log(error);
                }
            });
        }
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

    searchOptionsCountries(event) {
        this.countryService.getMany(event).subscribe({
            next: data => {
                this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }



}
