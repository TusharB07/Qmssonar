import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin } from 'rxjs';
import { ILov, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { BscPedalCycleService } from 'src/app/features/admin/bsc-cover/bsc-pedal-cycle/bsc-pedalcycle.service';
import { IBscPedalCycle } from 'src/app/features/admin/bsc-signage/bsc-signage.model';
import { BscSignageService } from 'src/app/features/admin/bsc-signage/bsc-signage.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-bsc-pedal-cycle-form-dialog',
  templateUrl: './bsc-pedal-cycle-form-dialog.component.html',
  styleUrls: ['./bsc-pedal-cycle-form-dialog.component.scss']
})
export class BscPedalCycleFormDialogComponent implements OnInit {

  pedalcycleForm: FormGroup;
  optionsSignageType: ILov[];
  submitted: boolean = false;
  bscPedalCycleCover: IBscPedalCycle[];
  currentUser$: Observable<IUser>;

  permissions: PermissionType[] = [];

  quote: IQuoteSlip
  minNSTP:any = 0;
  
  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private bscPedalCycleService: BscPedalCycleService,
    private listOfValueService: ListOfValueMasterService,
    private accountService: AccountService,
    private messageService: MessageService,
    private bscCoverService: BscCoverService
  ) {
    this.bscPedalCycleCover = config.data.bscPedalCycleCover;

    // this.bscPedalCycleCover = []

        this.currentUser$ = this.accountService.currentUser$

        this.quote = this.config.data.quote
   }

  ngOnInit(): void {
    this.createFormGroup(this.bscPedalCycleCover);

    this.currentUser$.subscribe({
        next: user => {
            let role: IRole = user?.roleId as IRole;
            if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

                this.permissions = ['read'];
            } else {

                this.permissions = ['read', 'update'];
            }
        }
    })
  }

  searchOptionsSignageType(event) {
    this.listOfValueService.current(AllowedListOfValuesMasters.BSC_PEDAL_CYCLE_TYPE, this.quote?.productId['_id']).subscribe({
        next: data => {
            this.optionsSignageType = data.data.entities.filter(val => this.config.data.quote.partnerId._id == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`,sumMin : entity?.fromSI , sumMax : entity?.toSI, maxNSTP:entity?.perEmployeeLimit ?? 0 }));
            // this.selectedEquipmentType = this.optionsSignageType[0];
        },
        error: e => { }
    })
}

  createFormGroup(items: IBscPedalCycle[]) {
    this.pedalcycleForm= this.fb.group({
        // If has item creates form for each either just creates one blank form
        formArray: this.fb.array(items.length > 0 ? items.map((item: IBscPedalCycle) => this.createForm(item)) : [this.createForm()]),
    });
}

  createForm(item?: IBscPedalCycle): FormGroup {
    // console.log()
    const signageType = item?.riskTypeId as IListOfValueMaster;
    return this.fb.group({
        _id: [item?._id],
        riskTypeId: [signageType ? { label: signageType.lovKey, value: signageType._id , sumMin : signageType?.fromSI , sumMax : signageType?.toSI, maxNSTP:signageType?.perEmployeeLimit ?? 0 } : null, [Validators.required]],
        // riskTypeId: [],
        riskDescription: [item?.riskDescription, [Validators.required, Validators.maxLength(255)]],
        sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
        fileInput: [item?.filePath]
    });
}


get formArray(): FormArray {
  return this.pedalcycleForm.get("formArray") as FormArray;
}

addFormToArray(): void {
  this.formArray.push(this.createForm());
}

deleteFormBasedOnIndex(rowIndex: number): void {

  if (this.bscPedalCycleCover[rowIndex]?._id) {
      console.log(this.bscPedalCycleCover[rowIndex]._id);

      this.bscPedalCycleService.delete(this.bscPedalCycleCover[rowIndex]._id).subscribe({
          next: res => {
              console.log(res);
              this.bscPedalCycleCover = this.bscPedalCycleCover.filter((item: IBscPedalCycle) => item._id != this.bscPedalCycleCover[rowIndex]._id)

              this.ref.close(this.bscPedalCycleCover);
          },
          error: e => {
              console.log(e.error.message);
          }
      });
  } else {
      this.formArray.removeAt(rowIndex);
  }
}

submitPedalCycleeForm() {
  if (this.pedalcycleForm.valid) {

      const formGroupData = { ...this.pedalcycleForm.value };

      const formArray = formGroupData["formArray"];
      console.log(formArray);
      const checkDulicateArray = formArray.map(item => item.riskTypeId.value)
      const isDuplicate = checkDulicateArray.filter((item,index) => checkDulicateArray.indexOf(item) !== index).length != 0

      if(isDuplicate) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
      }
      else{
          const createContactDetailObservables$ = [];

          for (let i = 0; i < formArray.length; i++) {
              const formData = formArray[i];
              let bscFormData = new FormData();
              bscFormData.append("riskDescription", formData['riskDescription']);
              bscFormData.append("riskTypeId", formData['riskTypeId']['value']);
              bscFormData.append("sumInsured", formData['sumInsured']);
              bscFormData.append("quoteId",this.config.data.quoteId)
              bscFormData.append("_id",formData['_id'] ? formData['_id']:'')
              bscFormData.append("file", formData['fileInput']);

              // createContactDetailObservables$.push(this.bscPedalCycleService.create(bscFormData));
              const payload = { ...formData };
              payload['riskTypeId'] = payload.riskTypeId.value;

              console.log(payload)
              if (payload._id) {
                  console.log('update')
                  // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

                  createContactDetailObservables$.push(this.bscPedalCycleService.update(payload._id, bscFormData));
              } else {
                  console.log('create')
                  // this.bscFidelityGuranteeCovers.push(payload)

                  payload['quoteId'] = this.config.data.quoteId;
                  createContactDetailObservables$.push(this.bscPedalCycleService.create(bscFormData));
              }


          }

          forkJoin(createContactDetailObservables$).subscribe({
              next: (items: IBscPedalCycle[]) => {
                  console.log(items)
                  this.bscPedalCycleCover = []
                  items.map((response: any) => {
                      console.log(response.data.entity)
                      this.bscPedalCycleCover.push(response.data.entity)
                      if (response.data.entity._id) {
                          this.bscPedalCycleCover = this.bscPedalCycleCover.map((item: IBscPedalCycle) => item._id != response.data.entity._id ? item : response.data.entity)
                          console.log('update')
                      } else {

                          console.log('create')
                          this.bscPedalCycleCover.push(response.data.entity)
                      }

                  })

                  this.ref.close(this.bscPedalCycleCover);

              },
              error: err => {
                  console.log(err);
              }
          });
      }

  }
}

cancel() {
  this.ref.close();
}

isFile(val): boolean { 
  console.log(typeof val);
  return typeof val === 'object'; 
}

onBasicUpload(e,index) {
  this.formArray.value[index].fileInput = e.currentFiles[0]
}

downloadFile(i){
  this.bscCoverService.downloadExcel(this.bscPedalCycleCover[i]?.filePath).subscribe(res => {

      let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';

      const a = document.createElement('a')
      const blob = new Blob([res.body], { type: res.headers.get('content-type') });
      const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
      const objectUrl = window.URL.createObjectURL(file);

      a.href = objectUrl
      a.download = fileName;
      a.click();

      // window.open(objectUrl, '_blank');
      URL.revokeObjectURL(objectUrl);

    })
}

deletefile(rowIndex){

  if(this.bscPedalCycleCover[rowIndex]?._id){
      let payload = {}
      payload['filePath']= this.bscPedalCycleCover[rowIndex]?.filePath
      payload['_id'] = this.bscPedalCycleCover[rowIndex]?._id
      console.log(payload)
      this.bscPedalCycleService.deleteFilePath(payload).subscribe(res => {
          // @ts-ignore
          if(res?.data.success){
              this.ref.close(this.bscPedalCycleCover[rowIndex])
          }
      })
  }

  // if(this.fileUpload!){
  //     this.fileUpload!.remove(e,0)
  //     this.fileUpload!.clear()
  //     this.fireLossOfProfitForm.value['fileInput'] = null
  //     console.log(this.fileUpload!)
  // }else{
  //     let payload = {}
  //     payload['filePath']= this.bscFireLossOfProfit.filePath
  //     payload['_id'] = this.bscFireLossOfProfit._id
  //     console.log(payload)
  //     this.bscFireLossOfProfitService.deleteFilePath(payload).subscribe(res => {
  //         // @ts-ignore
  //         if(res?.data.success){
  //             this.ref.close(this.bscFireLossOfProfit)
  //         }
  //     })
  // }
}


}

