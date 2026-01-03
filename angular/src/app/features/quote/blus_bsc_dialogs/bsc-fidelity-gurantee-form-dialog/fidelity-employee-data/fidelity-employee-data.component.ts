import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IBscFidelityEmployee } from 'src/app/features/admin/bsc-fidelity-gurantee/bsc-fidelity-gurantee.model';

@Component({
  selector: 'app-fidelity-employee-data',
  templateUrl: './fidelity-employee-data.component.html',
  styleUrls: ['./fidelity-employee-data.component.scss']
})
export class FidelityEmployeeDataComponent implements OnInit,OnChanges {

  employeeFormGroup : FormGroup
  // bscFidelityEmployee : IBscFidelityEmployee[]
  @Input() permissions : any 

  @Input() submitflag : boolean

  @Input() bscFidelityEmployee :IBscFidelityEmployee[]

  @Output() newItemEvent = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
  ) {
  }
  
  
  ngOnInit(): void {
    this.createFormGroup(this.bscFidelityEmployee);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.bscFidelityEmployee = []
    console.log(changes)
    if(changes.submitflag.currentValue){
      this.newItemEvent.emit(this.employeeFormGroup);
    }
    if(changes.bscFidelityEmployee?.currentValue !=undefined){
      this.bscFidelityEmployee = changes.bscFidelityEmployee?.currentValue
    }
  }

  createFormGroup(items: any[]) {
    this.employeeFormGroup = this.fb.group({
        // If has item creates form for each either just creates one blank form
        formArray: this.fb.array(items.length > 0 ? items.map((item: any) => this.createForm(item)) : [this.createForm()]),
    });
}

createForm(item?: any): FormGroup {
    // const fidelityGuranteeType = item?.riskTypeId as IListOfValueMaster;
    return this.fb.group({
        employee: [item?.employee],
        sumInsured : [item?.sumInsured ?? 0,]
    });
}

  get formArray(): FormArray {
    return this.employeeFormGroup.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {

    // if (this.bscFidelityEmployee[rowIndex]?._id) {
    //     console.log(this.bscFidelityEmployee[rowIndex]._id);

    //     this.bscFidelityGuranteeService.delete(this.bscFidelityEmployee[rowIndex]._id).subscribe({
    //         next: res => {
    //             console.log(res);
    //             this.bscFidelityEmployee = this.bscFidelityGuranteeCovers.filter((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != this.bscFidelityGuranteeCovers[rowIndex]._id)

    //             this.ref.close(this.bscFidelityGuranteeCovers);
    //         },
    //         error: e => {
    //             console.log(e.error.message);
    //         }
    //     });
    // } else {
      // }
    this.formArray.removeAt(rowIndex);
}

  submitFidelityGuranteeForm(){
    
  }

}
