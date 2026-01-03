import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IClauses } from '../clauses.model';
import { ClausesService } from '../clauses.service';
import { ClausesHeadsService } from '../../ClausesHeadsMaster/clausesHeads.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IClausesHeads } from '../../ClausesHeadsMaster/clausesHeads.model';

import { TransitTypeService } from '../../TransitTypeMaster/transitType.service';
import { InterestService } from '../../InterestMaster/interest.service';
import { PackagingService } from '../../PackagingMaster/packaging.service';
import { ConveyanceService } from '../../ConveyanceMaster/conveyance.service';

@Component({
  selector: 'app-clauses-form',
  templateUrl: './clauses-form.component.html',
  styleUrls: ['./clauses-form.component.scss']
})
export class ClausesFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Clause";
  recordPluralName = "Clauses";
  modulePath: string = "/backend/admin/clauses";
  
  optionsHeads: ILov[] = [];

  optionsTransitTypes: ILov[]=[]
  optionsInterests: ILov[] =[]
  optionsPackagings: ILov[]=[]
  optionsConveyances: ILov[]=[]

  selectedTransitTypes: ILov[]=[]
  selectedInterests: ILov[] =[]
  selectedPackagings: ILov[]=[]
  selectedConveyances: ILov[]=[]
  constructor(
    private clausesService: ClausesService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private clausesHeadsService:ClausesHeadsService,
    private transitTypeService:TransitTypeService,
    private conveyanceService:ConveyanceService,
    private packagingService:PackagingService,
    private interestService:InterestService,


  ) { 
  
    
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");


    this.transitTypeService.searchOptionsTransitTypes().then((response) => {
      this.selectedTransitTypes = response
      this.optionsTransitTypes = response
     });


     this.conveyanceService.searchOptionsConveyances().then((response) => {
      this.selectedConveyances = response
      this.optionsConveyances = response
     });


     this.packagingService.searchOptionsPackagings().then((response) => {
      this.selectedPackagings = response
      this.optionsPackagings = response
     });

     this.interestService.searchOptionsInterests().then((response) => {
      this.selectedInterests = response
      this.optionsInterests = response
     });

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.clausesService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClauses>) => {
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

  createForm(item?: IClauses) {
    const head = item?.headId as IClausesHeads
    if(item)
    {
    this.selectedTransitTypes=item.transitTypes;
    this.selectedInterests=item.interests;
    this.selectedPackagings=item.packagings;
    this.selectedConveyances=item.conveyances;
    }
    this.recordForm = this.formBuilder.group({
      
      clauseName: [item?.clauseName?item.clauseName:null,  [Validators.required]],
      headId: [head ? { label: head.headName, value: head._id } : null],
      transitTypes:[this.selectedTransitTypes],
      interests:[this.selectedInterests],
      packagings:[this.selectedPackagings],
      conveyances:[this.selectedConveyances],
      isActive: [item?.isActive],
    });
  }


  conveyancesWiseFilterChanged(value:any)
  {
    this.selectedConveyances=value;
  }

  packagingsWiseFilterChanged(value:any)
  {
    this.selectedPackagings=value;
  }

  InterestsWiseFilterChanged(value:any)
  {
    this.selectedInterests=value;
  
  }

  transitTypesWiseFilterChanged(value:any)
  {
    this.selectedTransitTypes=value;

  }

  saveRecord() {
    this.clausesHeadsService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["headId"] = this.recordForm.value["headId"].value;
        updatePayload["transitTypes"] = this.selectedTransitTypes;
        updatePayload["interests"] = this.selectedInterests;
        updatePayload["packagings"] = this.selectedPackagings;
        updatePayload["conveyances"] = this.selectedConveyances;
        updatePayload["isClauseSelected"] = false;
        updatePayload["selectedDescription"] = "";

      if (this.mode === "edit") {
        this.clausesService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
       
        this.clausesService.create(updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }
    
  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.clausesHeadsService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

  searchOptionsHeads(event) {
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
    this.clausesHeadsService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsHeads = data.data.entities.map(entity => ({ label: entity.headName, value: entity._id }));
      },
      error: e => { }
    });
  }

}
