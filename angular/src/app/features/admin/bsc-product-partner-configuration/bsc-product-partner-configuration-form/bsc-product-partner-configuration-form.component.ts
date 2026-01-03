import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto, RsmD } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IClaimExperience } from '../../claim-experience/claim-experience.model';
import { ClaimExperienceService } from '../../claim-experience/claim-experience.service';
import { IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';
import { ProductPartnerConfigurationService } from '../../product-partner-configuration/product-partner-configuration.service';
import { AllowedProductBscCover, IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { IBscProductPartnerConfiguration } from '../bsc-product-partner-configuration.model';
import { BscProductPartnerConfigurationService } from '../bsc-product-partner-configuration.service';

@Component({
    selector: 'app-bsc-product-partner-configuration-form',
    templateUrl: './bsc-product-partner-configuration-form.component.html',
    styleUrls: ['./bsc-product-partner-configuration-form.component.scss']
})
export class BscProductPartnerConfigurationFormComponent implements OnInit {

    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;

    optionsProducts: ILov[] = [];
    optionsPratnerId: ILov[] = [];


    recordSingularName = "Bsc Product Partner Configuration";
    recordPluralName = "Bsc Product Partner Configurations";
    modulePath: string = "/backend/admin/bsc-product-partner-configuration";


    product: IBscProductPartnerConfiguration;
    constructor(
        private bscProductPartnerConfigurationService: BscProductPartnerConfigurationService,

        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private partnerService: PartnerService,
        private productPartnerConfigurationService: ProductPartnerConfigurationService

    ) {


    }





    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.bscProductPartnerConfigurationService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IBscProductPartnerConfiguration>) => {

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

    AllowedBscCover = AllowedProductBscCover

    mapping: AllowedProductBscCover[];

    createForm(item?: IBscProductPartnerConfiguration) {

        const productId = item?.productId as IProduct;
        const partnerId = item?.partnerId as IPartner;

        this.mapping = productId?.bscCovers;
        console.log(this.mapping)

        this.recordForm = this.formBuilder.group({

            productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]],
            partnerId: [partnerId ? { label: partnerId.name, value: partnerId._id } : null, [Validators.required]],

            bscSignageCover: [item?.bscSignageCover],
            bscPortableEquipmentsCover: [item?.bscPortableEquipmentsCover],
            bscMoneyTransitCover: [item?.bscMoneyTransitCover],
            bscMoneySafeTillCover: [item?.bscMoneySafeTillCover],
            bscLiabilitySectionCover: [item?.bscLiabilitySectionCover],
            bscFixedPlateGlassCover: [item?.bscFixedPlateGlassCover],
            bscFireLossOfProfitCover: [item?.bscFireLossOfProfitCover],
            bscFidelityGuaranteeCover: [item?.bscFidelityGuaranteeCover],
            bscElectronicEquipmentsCover: [item?.bscElectronicEquipmentsCover],
            bscBurglaryHousebreakingCover: [item?.bscBurglaryHousebreakingCover],
            bscAccompaniedBaggageCover: [item?.bscAccompaniedBaggageCover,],


            floaterCoverAddOn: [item?.floaterCoverAddOn],
            declarationPolicy: [item?.declarationPolicy],
            loseOfRent: [item?.loseOfRent],
            rentForAlternativeAccomodation: [item?.rentForAlternativeAccomodation],
            personalAccidentCover: [item?.personalAccidentCover],
            valuableContentsOnAgreedValueBasis: [item?.valuableContentsOnAgreedValueBasis],

            active: [item?.active]
        });


        this.recordForm.controls['productId'].valueChanges.subscribe({
            next: ({ label, value }) => {
                console.log(value)

                if (value) {

                    this.productService.get(value).subscribe({
                        next: (dto: IOneResponseDto<IProduct>) => {

                            this.mapping = dto.data.entity.bscCovers
                            console.log(this.mapping)
                        }
                    })

                }

            }
        })

        this.recordForm.controls['partnerId'].valueChanges.subscribe({
            next: ({ label, value }) => {
                console.log(value)
                // this.recordForm.controls['productId'].setValue(null)
                this.recordForm.controls['productId'].reset({ label: null, value: null })


            }
        })
    }

    saveRecord() {


        if (this.recordForm.valid) {

            const updatePayload = { ...this.recordForm.value };
            updatePayload["productId"] = this.recordForm.value["productId"].value;
            updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

            if (this.mode === "edit") {
                this.bscProductPartnerConfigurationService.update(this.id, updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);

                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            if (this.mode === "new") {
                this.bscProductPartnerConfigurationService.create(updatePayload).subscribe({
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

    searchOptionsProducts(event) {


        event = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                partnerId: [
                    {
                        value: this.recordForm.controls['partnerId']?.value?.value,
                        matchMode: "equals",
                        operator: "and"
                    },
                ],

            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.productPartnerConfigurationService.getMany(event).subscribe({
            next: data => {
                // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
                this.optionsProducts = data.data.entities.filter(entity => entity.productId && entity.productId["status"] === true).map(entity => ({ label: (entity.productId as IProduct)?.type, value: (entity.productId as IProduct)?._id }));

            },
            error: e => { }
        });
    }
    searchOptionsPartnerId(event) {


        event = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                // name: [
                //     {
                //         value: event.query,
                //         matchMode: "startsWith",
                //         operator: "and"
                //     }
                // ],
                status: [
                    {
                        value: true,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.partnerService.getMany(event).subscribe({
            next: data => {
                this.optionsPratnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }




}
