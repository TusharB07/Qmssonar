import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IExclusion } from '../../exclusion/exclusion.model';
import { IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';
import { IICRMContact } from '../icrm-contact.model';
import { IcrmContactService } from '../icrm-contact.service';
import { CustomValidator } from 'src/app/shared/validators';

@Component({
    selector: 'app-icrm-contact-form',
    templateUrl: './icrm-contact-form.component.html',
    styleUrls: ['./icrm-contact-form.component.scss']
})
export class IcrmContactFormComponent implements OnInit {

    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;
    recordSingularName = "ICMR Contact";
    recordPluralName = "ICMR Contact";
    modulePath: string = "/backend/admin/icrm-contact";


    optionsInsurerPartnerId: ILov[] = [];


    constructor(
        private icrmContactService: IcrmContactService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private partnerService: PartnerService,

    ) { }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        if (this.id !== "new") {
            this.mode = "edit";
            this.icrmContactService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IICRMContact>) => {

                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {

                            label: `${dto.data.entity._id}`,
                            routerLink: [`${this.modulePath}`]
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



        this.createForm();
    }

    createForm(item?: IICRMContact) {

        const icPartner: IPartner = item?.icPartnerId as IPartner

        this.recordForm = this.formBuilder.group({
            icPartnerId: [icPartner ? { label: icPartner?.name, value: icPartner?._id } : null, [Validators.required]],
            rmName: [item?.rmName, [Validators.required]],
            rmEmail: [item?.rmEmail, [Validators.required,CustomValidator.emailValidator]],
            active: [item?.active],
            mobileNo: [item?.mobileNo, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
        });
    }


    saveRecord() {


        if (this.recordForm.valid) {

            const updatePayload = { ...this.recordForm.value };

            console.log(updatePayload)

            updatePayload['icPartnerId'] = this.recordForm.value["icPartnerId"].value
            // updatePayload["productId"] = this.recordForm.value["productId"].value;
            // updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

            if (this.mode === "edit") {
                this.icrmContactService.update(this.id, updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);

                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            if (this.mode === "new") {
                this.icrmContactService.create(updatePayload).subscribe({
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

    searchOptionsInsurerPartnerId(event) {


        event = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                partnerType: [
                    {
                        value: 'insurer',
                        matchMode: "equals",
                        operator: "or"
                    }
                ],
            },
            globalFilter: null,
            multiSortMeta: null
        }


        this.partnerService.getMany(event).subscribe({
            next: data => {
                this.optionsInsurerPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }


}
