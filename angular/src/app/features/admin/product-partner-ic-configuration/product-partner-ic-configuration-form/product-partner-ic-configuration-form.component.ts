import { OPTIONS_BSC_COVER_RULES } from './../../bsc-cover/bsc-cover.model';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { FormMode, IBulkImportResponseDto, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { OccupancyRateService } from '../../occupancy-rate/occupancy-rate.service';
import { IMappedRmEmail, IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { IUser } from '../../user/user.model';
import { AllowedOtcTypes, IBscRule, IDiscountRule, IOccupancyRule, IProductPartnerIcConfigration, OPTIONS_ALLOWED_TYPES } from '../product-partner-ic-configuration.model';
import { ProductPartnerIcConfigurationService } from '../product-partner-ic-configuration.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from '../../list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from '../../list-of-value-master/list-of-value-master.service';
import { SubOccupancyService } from '../../sub-occupancy/sub-occupancy.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-product-partner-ic-configuration-form',
    templateUrl: './product-partner-ic-configuration-form.component.html',
    styleUrls: ['./product-partner-ic-configuration-form.component.scss']
})
export class ProductPartnerIcConfigurationFormComponent implements OnInit,AfterViewChecked {

    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;
    optionsProducts: ILov[] = [];
    optionsBrokerPartnerId: ILov[] = [];
    optionsInsurerPartnerId: ILov[] = [];
    optionsOccupancyId: ILov[] = [];
    optionBSCListOfValues : ILov[] = [];
    optionsOtcType: ILov[] = [];
    optionsOccupancyRules: ILov[] = [];
    optionsDiscountRules: ILov[] = [];
    opitionBSCDropDownRules: ILov[] = [];
    optionsSubOccupancy : ILov[] = [];
    recordSingularName = "Product Partner Ic Configuration";
    recordPluralName = "Product Partner Ic Configuration";
    modulePath: string = "/backend/admin/product-partner-ic-configuration";
    validateSI = false;
    product: IProductPartnerIcConfigration;
    isNstp = []

    user: IUser

    loading: boolean;
    totalRecords: number;
    records: IListOfValueMaster[];

    constructor(
        private productPartnerIcConfigurationService: ProductPartnerIcConfigurationService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private partnerService: PartnerService,
        private occupancyService: OccupancyRateService,
        private messageService: MessageService,
        private accountService: AccountService,
        private recordService: ListOfValueMasterService,
        private suboccupancyRateService: SubOccupancyService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private appService: AppService,
    ) {

        this.optionsOtcType = OPTIONS_ALLOWED_TYPES;

        this.opitionBSCDropDownRules = OPTIONS_BSC_COVER_RULES

        this.accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                console.log(this.user)
            }
        })
    }

    onValidateChanged() {
        this.validateSI = !this.validateSI;
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
      }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");
       
        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.productPartnerIcConfigurationService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IProductPartnerIcConfigration>) => {

                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            
                            label: `${dto.data.entity._id}`,
                            routerLink: [`${this.modulePath}`]
                        }
                    ]);
                    console.log(dto.data.entity)
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
        // this.createIOccupancyRuleFormRow()
        // this.createlistofvalueRulesArray()
        // this.createBscRuleFormRow()
    }


    loadBSCDropdownListOfValueId(event){
        
        let lazyloadevent : LazyLoadEvent = {
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                "lovType": [
                    {
                        "value": AllowedListOfValuesMasters.BSC_PORTABLE_EQUIPMENT_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_FIXED_PLATE_GLASS_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_ACCOMPANIED_BAGGAGE_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_FIDELITY_GURANTEE_RISK_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_SIGNAGE_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_LIABILITY_SECTION_RISK_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_WORKMEN_COMPENSATION_RISK_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_RISK_ALL_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_PEDAL_CYCLE_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      },
                      {
                        "value": AllowedListOfValuesMasters.BSC_PERSONAL_ACCIDENT_TYPE,
                        "matchMode": "equals",
                        "operator": "or"
                      } 
                ],
                // @ts-ignore
                "partnerId" : [
                    
                        {
                            value: this.recordForm.controls['brokerPartnerId'].value?.value,
                            matchMode: "equals",
                            operator: "and"
                          }
                    
                ],
                // @ts-ignore
                "productId" : [
                    
                    {
                        value: this.recordForm.controls['productId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                      }
                
            ]
                
            },
            globalFilter: null,
            multiSortMeta: null,
            rows : 100
        }
          this.loading = true;
          this.recordService.getMany(lazyloadevent).subscribe({
            next: records => {
              console.log(records);
              this.records = records.data.entities;
            this.optionBSCListOfValues = records.data.entities.map(item => ({label : item.lovType == 'BSC_PORTABLE_EQUIPMENT_TYPE' ?  'BSC_Electrical_And_Mechanical_Appliances - '+item.lovKey  :item.lovType+'-'+item.lovKey , value : item._id}))
            // this.optionBSCListOfValues = this.optionBSCListOfValues.map(item => {
            //     if(item.label.includes('BSC_PORTABLE_EQUIPMENT_TYPE')){
            //         item.label.replace('BSC_PORTABLE_EQUIPMENT_TYPE','BSC_Electrical_And_Mechanical_Appliances')
            //         return item
            //     }
            //     console.log(item.label)
            //     return item;
            // })
            console.log(this.optionBSCListOfValues)
            this.optionBSCListOfValues=this.optionBSCListOfValues.filter((item)=> item.label.toLowerCase().includes(event.query.toLowerCase()))
              this.loading = false;
            },
            error: e => {
              console.log(e);
            }
          });
    }

    // loadBscDropDowns(){
    //     this.opitionBSCDropDownRules = OPTIONS_BSC_COVER_RULES
    // }

    createForm(item?: IProductPartnerIcConfigration) {


        const productId = item?.productId as IProduct;
        const brokerPartner = item?.brokerPartnerId as IPartner;
        const insurerPartner = item?.insurerPartnerId as IPartner;
        // const discountRules = item?.discountRules as unknown as IDiscountRule;
        // const occupancyRules = item?.occupancyRules as unknown as IOccupancyRule;
        // const otcType = item?.otcType as unknown as AllowedOtcTypes;
        const otcType = this.optionsOtcType.find((type) => type.value == item?.otcType)


        this.recordForm = this.formBuilder.group({
            validateSI: [item?.validateSI ?? false],
            productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]],
            brokerPartnerId: [brokerPartner ? { label: brokerPartner.name, value: brokerPartner._id } : null, [Validators.required]],
            insurerPartnerId: [insurerPartner ? { label: insurerPartner.name, value: insurerPartner._id } : null, [Validators.required]],
            otcType: [otcType ? { label: otcType.label, value: otcType.value } : null, [Validators.required]],
            // occupancyRules: [occupancyRules ? { label: occupancyRules.sumInsured, value: occupancyRules._id }: null, [Validators.required]],
            // discountRules: [discountRules? { label: discountRules.discountFrom, value: productId._id }: null, [Validators.required]],
            //  occupancyRules: this.formBuilder.array(item?.occupancyRules?.length > 0 ? item?.occupancyRules?.map((icOccupancy: IOccupancyRule) => this.createIOccupancyRuleFormRow(icOccupancy)): [this.createIOccupancyRuleFormRow()]),
            //   discountRules: this.formBuilder.array(item?.discountRules?.length > 0 ? item?.discountRules?.map((icDiscount: IDiscountRule) => this.createIDiscountRuleFormRow(icDiscount)): [this.createIDiscountRuleFormRow()]),

            // mappedRmEmails: [item?.mappedRmEmails ? item?.mappedRmEmails?.map((rmEmail) => rmEmail.email) : null],
            fromSI: [item?.fromSI ?? 0, [Validators.min(0), Validators.max(5000000000000000000), Validators.required]],
            toSI: [item?.toSI ?? 0, [Validators.min(0), Validators.max(5000000000000000000), Validators.required]],

            discountFrom: [item?.discountRules?.discountFrom ?? 0, [Validators.min(0), Validators.max(99), Validators.required]],
            discountTo: [item?.discountRules?.discountTo ?? 0, [Validators.min(0), Validators.max(100), Validators.required]],
            isNstp: [item?.discountRules?.isNstp ?? false],
            NstpMaxDiscount: [item?.discountRules?.NstpMaxDiscount ?? 0, item?.discountRules?.isNstp ? [Validators.required, Validators.min(item?.discountRules?.discountFrom as number + 1),Validators.max(item?.discountRules?.discountTo as number - 1)]:[]],

            occupancyRulesArray: this.formBuilder.array([]),

            listofvalueRulesArray : this.formBuilder.array([]),

            bscCoverRulesArray : this.formBuilder.array([]),
            // applicableFrom: [item?.applicableFrom ? String(item?.applicableFrom).split('T')[0] : null],
            // applicableTo: [item?.applicableTo ? String(item?.applicableTo).split('T')[0] : null],

            active: [item?.active],

            wcConfigurationDiscount:[item?.wcConfigurationDiscount ?? 0, [Validators.min(0), Validators.max(100), Validators.required]],

        });
        
        if (item?.occupancyRules.length > 0) {

            item?.occupancyRules?.map(rule => {
                this.occupancyRulesArray.push(this.createOccupancyRuleFormRow(rule))
            })
        } else {
            this.createOccupancyRuleFormRow()
        }

        if (item?.lovRules?.length > 0) {
            item?.lovRules?.map(rule => {
                this.listofvalueRulesArray.push(this.createlistofvalueRulesArray(rule))
            })
        } 

        if(item?.bscCoverRules?.length > 0){ 
            item?.bscCoverRules?.map(rule => {
                this.bscCoverRulesArray.push(this.createBscRuleFormRow(rule))
            })
        }/* else{
            this.bscCoverRulesArray.push(this.createBscRuleFormRow())
        } */

        // this.recordForm.controls['occupancyRulesArray'].setValue(item?.occupancyRules?.length > 0 ? item?.occupancyRules?.map((rule) => this.createOccupancyRuleFormRow(rule)) :
        //     [
        //         this.createOccupancyRuleFormRow()
        //     ])


        this.recordForm.controls['isNstp'].valueChanges.subscribe({
            next: ({ label, value }) => {
                console.log(this.recordForm.value['isNstp'])
                if(!this.recordForm.value['isNstp']) {
                    this.recordForm.controls['NstpMaxDiscount'].addValidators([Validators.min(this.recordForm.value['discountFrom'] + 1),Validators.max(this.recordForm.value['discountTo'] - 1), Validators.required])
                    this.recordForm.controls['NstpMaxDiscount'].updateValueAndValidity();
                }
                else {
                    this.recordForm.controls['NstpMaxDiscount'].clearValidators();
                    this.recordForm.controls['NstpMaxDiscount'].setValue(0);
                    this.recordForm.controls['NstpMaxDiscount'].updateValueAndValidity();
                }
                console.log(this.recordForm);
            }
        })
        this.recordForm.controls['otcType'].valueChanges.subscribe({
            next: ({ label, value }) => {

                console.log(this.recordForm)
                console.log(value);
                this.occupancyRulesArray.clear()

                if (value == 'BOTH') {
                    // this.occupancyRulesArray.setValue([this.createOccupancyRuleFormRow()])
                    this.occupancyRulesArray.push(this.createOccupancyRuleFormRow())
                   
                } else {

                }
            }
        })

        this.recordForm.controls['brokerPartnerId'].valueChanges.subscribe({
            next: ({ label, value }) => {
                console.log(value);
                this.occupancyRulesArray.clear()
            }
        })
    }

    get occupancyRulesArray(): FormArray {
        return this.recordForm.get("occupancyRulesArray") as FormArray;
    }
    get listofvalueRulesArray():FormArray {
        return this.recordForm.get("listofvalueRulesArray") as FormArray;
    }
    get bscCoverRulesArray():FormArray {
        return this.recordForm.get('bscCoverRulesArray') as FormArray;
    }

    isAll: boolean;

    createlistofvalueRulesArray(rule? : any) : FormGroup {
        let form = this.formBuilder.group({
            listofValueId : [rule?.lovId ? {label : rule?.name , value: rule.lovId} : null,[]],
            select: [rule?.isAllowed ? rule?.isAllowed : false],
        })
        return form;
    }

    createOccupancyRuleFormRow(rule?: IOccupancyRule): FormGroup {

        // this.isAll = rule?.isAll;

        let form = this.formBuilder.group({
            isAll: [rule?.isAll ? rule.isAll : false],
            occupancyId: [rule?.occupancy ? { label: rule.occupancy.name, value: rule.occupancy._id } : null, []],
            subOccupancyId : [rule?.occupancySubType ? { label: rule.occupancySubType.shopName, value: rule.occupancySubType._id } : null, []],
            sumInsured: [rule?.sumInsured ?? 0, [
                Validators.min(this.recordForm?.value['fromSI']),
                Validators.max(this.recordForm?.value['toSI']),
                Validators.required
            ]],
            maxNstp : [rule?.maxNstp ?? 0,[Validators.max(Number(rule?.sumInsured))]]
        });

        form.controls['sumInsured'].valueChanges.subscribe(val => {
            console.log(val)
            form.get('maxNstp')?.clearValidators()
            form.controls['maxNstp'].addValidators(Validators.max(Number(val)));
            form.controls['maxNstp'].updateValueAndValidity();
        })
        // form.controls['isAll'].valueChanges.subscribe(isAll => {

        //     // this.isAll = isAll
        //     if (isAll) {

        //         form.controls['occupancyId'].disable()
        //     } else {
        //         form.controls['occupancyId'].enable()

        //     }
        // })

        this.recordForm.controls['fromSI'].valueChanges.subscribe(min => {
            // return min
            // console.log(min)

            form.controls['sumInsured'].setValidators(Validators.min(min))
            // if (form.value['sumInsured'] < min) form.controls['sumInsured'].setErrors({ min: true });
            form.controls['sumInsured'].setErrors(form.value['sumInsured'] < min ? { min: true }: null);

            // ! Removed as client dont wants it
            // if (form.value['sumInsured'] < min) form.controls['sumInsured'].setValue(min)

        })
        this.recordForm.controls['toSI'].valueChanges.subscribe(max => {
            // return max

            form.controls['sumInsured'].setValidators(Validators.max(max))
            form.controls['sumInsured'].setErrors(form.value['sumInsured'] > max ? { max: true }: null);
            // if (form.value['sumInsured'] > max) form.controls['sumInsured'].setErrors({ max: true });
            // form.controls['sumInsured'].setErrors('In valid')

            // ! Removed as client dont wants it
            // if (form.value['sumInsured'] > max) form.controls['sumInsured'].setValue(max)


        })


        return form;
    }

        createBscRuleFormRow(rule? : IBscRule) : FormGroup {
        let form  = this.formBuilder.group({
            isAllowed : [rule?.isAllowed ? rule?.isAllowed : false],
            bscCover : [rule?.name ?? null,[]],
            // sumInsured : [rule?.sumInsured ?? 0,[Validators.required]]
        })
        return form;
    }

    onAddOccupancyRuleRow(): void {
        this.occupancyRulesArray.push(this.createOccupancyRuleFormRow());
    }

    onAddlistofvalueRulesArray(): void {
        this.listofvalueRulesArray.push(this.createlistofvalueRulesArray());
    }

    onAddBscCoverRuleArray(): void {
        this.bscCoverRulesArray.push(this.createBscRuleFormRow())
    }

    onDeleteOccupancyRuleRow(rowIndex: number): void {
        this.occupancyRulesArray.removeAt(rowIndex);
    }

    onDeleteListOfValueRuleRow(rowIndex: number): void {
        this.listofvalueRulesArray.removeAt(rowIndex)
    }

    onDeleteBSCCoverRuleRow(rowIndex : number): void{
        this.bscCoverRulesArray.removeAt(rowIndex)
    }

    saveRecord() {
        this.productPartnerIcConfigurationService.setFilterValueExist(true);
        const payload = { ...this.recordForm.value };
            if (this.recordForm.valid) {
    
                console.log('payload', payload)
                payload["productId"] = payload["productId"].value;  
                payload["brokerPartnerId"] = payload["brokerPartnerId"].value;
                payload["insurerPartnerId"] = payload["insurerPartnerId"].value;
                payload["otcType"] = payload["otcType"].value;
                // payload["mappedRmEmails"] = payload["mappedRmEmails"].map((mappedRmEmail) => ({ email: mappedRmEmail }));
                console.log(payload['listofvalueRulesArray'])
                console.log(payload['occupancyRulesArray']);
                console.log(payload['bscCoverRulesArray'])
                
    
                payload['occupancyRules'] = payload['occupancyRulesArray'].length > 0 ? payload['occupancyRulesArray']?.map((item) => ({
                    isAll: item?.isAll,
                    occupancy: item?.occupancyId ? { _id: item.occupancyId.value, name: item.occupancyId.label } : {},
                    occupancySubType : item?.subOccupancyId ?  {_id:item.subOccupancyId.value , shopName : item.subOccupancyId.label} : {} ,
                    sumInsured: item?.sumInsured ?? 0,
                    maxNstp: item?.maxNstp ?? 0
                })) : []
    
                delete payload['occupancyRulesArray']
    
                payload['lovRules'] = payload['listofvalueRulesArray'].length > 0 ? payload['listofvalueRulesArray']?.map((item) => ({
                    name: item.listofValueId.label ,
                    isAllowed : item.select,
                    lovId : item.listofValueId.value
                })) : []
    
                delete payload['listofvalueRulesArray']

                payload['bscCoverRules'] = payload['bscCoverRulesArray'].length > 0 ? payload['bscCoverRulesArray']?.map((item)=> ({
                    
                    isAllowed : item?.isAllowed,
                    name : item?.bscCover ? item?.bscCover : null,
                    // sumInsured : item?.sumInsured
                })) : []

                delete payload['bscCoverRulesArray']

                payload['discountRules'] = ({
                    discountFrom: payload['discountFrom'],
                    discountTo: payload['discountTo'],
                    isNstp: payload['isNstp'],
                    NstpMaxDiscount: payload['NstpMaxDiscount']
                })
    
                delete payload['discountFrom']
                delete payload['discountTo']
                delete payload['isNstp']
                delete payload['NstpMaxDiscount']
    
                // updatePayload["occupancyRules"] = this.recordForm.value['occupancyRules'].map((icOccupancy: IOccupancyRule) => ({
                //     sumInsured: icOccupancy.sumInsured
                // }))
    
                // updatePayload["discountRules"] = this.recordForm.value['discountRules'].map((icDiscount: IDiscountRule) => ({
                //     discountFrom: icDiscount.discountFrom,
                //     discountTo: icDiscount.discountTo,
                // }))
    
                console.log(payload)
    
                if (this.mode === "edit") {
                    this.productPartnerIcConfigurationService.update(this.id, payload).subscribe({
                        next: partner => {
                            this.router.navigateByUrl(`${this.modulePath}`);
    
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                if (this.mode === "new") {
                    this.productPartnerIcConfigurationService.create(payload).subscribe({
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
        this.productPartnerIcConfigurationService.setFilterValueExist(true);
        this.router.navigateByUrl(`${this.modulePath}`);
    }

    searchOptionsProducts(event) {

        event = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                // partnerType: [
                //     {
                //         value: 'self',
                //         matchMode: "equals",
                //         operator: "and"
                //     },
                //     {
                //         value: 'broker',
                //         matchMode: "equals",
                //         operator: "or"
                //     }
                // ],
                // @ts-ignore
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

        this.productService.getMany(event).subscribe({
            next: data => {
                this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
            },
            error: e => { }
        });
    }
    searchOptionsBrokerPartnerId(event) {

        event = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                partnerType: [
                    {
                        value: 'self',
                        matchMode: "equals",
                        operator: "and"
                    },
                    {
                        value: 'broker',
                        matchMode: "equals",
                        operator: "or"
                    },
                    {
                        value: 'agent',
                        matchMode: "equals",
                        operator: "or"
                    },
                    {
                        value: 'banca',
                        matchMode: "equals",
                        operator: "or"
                    }
                ],
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
                this.optionsBrokerPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
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
                this.optionsInsurerPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchoccupancysubType(event?: any, form?: any){
        console.log(this.recordForm.value.productId.value);
        console.log(event);
        console.log(form?.value.occupancyId.value);
        this.suboccupancyRateService.getMatching({
            search: event?.query ?? '',
            productId: this.recordForm?.value?.productId?.value,
            occupancyId: form?.value?.occupancyId?.value,
            
        }).subscribe({
            next: records => {
                console.log(records);
                
                this.optionsSubOccupancy = records.data.entities.map(entity => ({label: entity.shopName, value: entity._id}))
                /* this.suboccupancies = records.data.entities;
                this.totalSubOccupancies = records.results;
                this.subloading = false; */
            },
            error: e => {
                console.log(e);
            }
        });
        
        /* event = {
            first: 0,
            // rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {

                // @ts-ignore
                partnerId: [
                    {
                        value: this.recordForm.controls['brokerPartnerId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                // @ts-ignore
                shopName: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ],
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.occupancysubTypeService.getMany(event).subscribe({
            next : data => {
                this.optionsSubOccupancy = data.data.entities.map(entity => ({label: entity.shopName, value: entity._id}))
                console.log(this.optionsSubOccupancy)
            }
        }) */
    }
    searchOptionsOccupancyId(event) {


        console.log(this.recordForm.controls['brokerPartnerId'].value?.value)
        event = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {

                // @ts-ignore
                partnerId: [
                    {
                        value: this.recordForm.controls['brokerPartnerId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                // @ts-ignore
                productId: [
                    {
                        value: this.recordForm.controls['productId'].value?.value,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],
                // @ts-ignore
                occupancyType: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ],
            },
            globalFilter: null,
            multiSortMeta: null
        }


        this.occupancyService.getMany(event).subscribe({
            next: data => {
                this.optionsOccupancyId = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));
            },
            error: e => { }
        });
    }
    // searchOptionsOtcType(event) {
    //   this.productPartnerIcConfigurationService.getManyAsLovs(event).subscribe({
    //     next: data => {
    //       this.optionsotcType = data.data.entities.map(entity => ({ label: entity.otcType, value: entity._id }));
    //     },
    //     error: e => { }
    //   });
    // }
    get occupancyRules(): FormArray {
        return this.recordForm.get("occupancyRules") as FormArray;
    };


    createIOccupancyRuleFormRow(icOccupancyRule?: IOccupancyRule): FormGroup {
        return this.formBuilder.group({
            sumInsured: [icOccupancyRule?.sumInsured, [Validators.required]],
        });
    };


    // searchOptionsOccupancyRules(event) {
    //   this.partnerService.getManyAsLovs(event).subscribe({
    //     next: data => {
    //       this.optionsOccupancyRules = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
    //     },
    //     error: e => { }
    //   });
    // }

    get discountRules(): FormArray {
        return this.recordForm.get("discountRules") as FormArray;
    };

    createIDiscountRuleFormRow(icDiscountRule?: IDiscountRule): FormGroup {
        return this.formBuilder.group({
            discountFrom: [icDiscountRule?.discountFrom, [Validators.required]],
            discountTo: [icDiscountRule?.discountTo, [Validators.required]],  // rmEmail: [['harish@test.com'], []],
        });
    };


    // searchOptionsDiscountRules(event) {
    //   this.partnerService.getManyAsLovs(event).subscribe({
    //     next: data => {
    //       this.optionsDiscountRules = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
    //     },
    //     error: e => { }
    //   });
    // }

    onIcRmEMailAdd($event) {

        let emails = this.recordForm.controls.mappedRmEmails.value;
        let value = $event.value;

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


        if (!emailRegex.test(value)) {

            this.messageService.add({
                summary: `${value} is an invalid email address`,
                severity: 'warn'

            });

            this.recordForm.controls.mappedRmEmails.setValue(emails.filter((email) => email != value))

        };
    }

    bulkImportGenerateSample() {
        this.productPartnerIcConfigurationService.bulkImportGenerateSample().subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                console.log(dto)
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    upload(e){
        console.log(e)
        const formData = new FormData();
        formData.append("bulk_import",e.currentFiles[0])
        this.productPartnerIcConfigurationService.upload(this.id,formData).subscribe(res =>{
            console.log(res)
            if(res['status'] != 'fail'){
                window.location.reload()
            }else{
                // @ts-ignore
                alert(res.data.entity?.errorMessage)
                // @ts-ignore
                if (res.data.entity?.downloadablePath) {
                // @ts-ignore
                    this.appService.downloadFileFromUrl('Sample Sheet', res.data.entity?.downloadablePath)
                }
            }
        })
    }

}
