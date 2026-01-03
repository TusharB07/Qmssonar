import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode } from 'src/app/app.model';
import { GmcFileTemplate } from './gmc-file-template.model';
import { GmcFileTemplateService } from './gmc-file-template.service';
import { MessageService } from 'primeng/api';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-gmc-file-template',
  templateUrl: './gmc-file-template.component.html',
  styleUrls: ['./gmc-file-template.component.scss']
})
export class GmcFileTemplateComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  submitted: boolean = false;
  templateModel: GmcFileTemplate = new GmcFileTemplate();
  gmcForm: FormGroup;
  constructor(private messageService: MessageService, private fb: FormBuilder, private gmcFileTemplateService: GmcFileTemplateService) { }

  ngOnInit(): void {
    this.gmcForm = this.fb.group({
      empId: this.fb.array([]),
      empType: this.fb.array([]),
      memberName: this.fb.array([]),
      designation: this.fb.array([]),
      dob: this.fb.array([]),
      gender: this.fb.array([]),
      relationShip: this.fb.array([]),
      salary: this.fb.array([]),
      SI: this.fb.array([]),
      self: this.fb.array([]),
      spouse: this.fb.array([]),
      child: this.fb.array([]),
      siblings: this.fb.array([]),
      parent: this.fb.array([]),
      male: this.fb.array([]),
      female: this.fb.array([])
    });
    this.getTemplateData()
  }

  getTemplateData() {
    this.gmcFileTemplateService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        console.log(records);
        if (records.data.entities.length == 0) {
          this.resetForm();
        }
        else {
          this.mode = "edit";
          this.id = records.data.entities[0]._id
          this.createForm(records.data.entities[0]);
        }

      },
      error: e => {
        console.log(e);
      }
    });
  }
  resetForm() {
    this.gmcForm = this.fb.group({
      empId: this.fb.array([]),
      empType: this.fb.array([]),
      memberName: this.fb.array([]),
      designation: this.fb.array([]),
      dob: this.fb.array([]),
      gender: this.fb.array([]),
      relationShip: this.fb.array([]),
      salary: this.fb.array([]),
      SI: this.fb.array([]),
      self: this.fb.array([]),
      spouse: this.fb.array([]),
      child: this.fb.array([]),
      siblings: this.fb.array([]),
      parent: this.fb.array([]),
      male: this.fb.array([]),
      female: this.fb.array([])
    });
  }
  createForm(model?: GmcFileTemplate) {
    this.gmcForm = this.fb.group({
      _id: [model?._id],
      empId: this.fb.array(model?.empId || [], []),
      empType: this.fb.array(model?.empType || [], []),
      memberName: this.fb.array(model?.memberName || [], []),
      designation: this.fb.array(model?.designation || [], []),
      dob: this.fb.array(model?.dob || [], []),
      gender: this.fb.array(model?.gender || [], []),
      relationShip: this.fb.array(model?.relationShip || [], []),
      salary: this.fb.array(model?.salary || [], []),
      SI: this.fb.array(model?.SI || [], []),
      self: this.fb.array(model?.self || [], []),
      spouse: this.fb.array(model?.spouse || [], []),
      child: this.fb.array(model?.child || [], []),
      siblings: this.fb.array(model?.siblings || [], []),
      parent: this.fb.array(model?.parent || [], []),
      male: this.fb.array(model?.male || [], []),
      female: this.fb.array(model?.female || [], [])
    });
  }
  get empId(): FormArray {
    console.log("here")
    return this.gmcForm.get('empId') as FormArray;
  }
  get empType(): FormArray {
    return this.gmcForm.get('empType') as FormArray;
  }
  get memberName(): FormArray {
    return this.gmcForm.get('memberName') as FormArray;
  }
  get designation(): FormArray {
    return this.gmcForm.get('designation') as FormArray;
  }
  get dob(): FormArray {
    return this.gmcForm.get('dob') as FormArray;
  }
  get gender(): FormArray {
    return this.gmcForm.get('gender') as FormArray;
  }
  get relationShip(): FormArray {
    return this.gmcForm.get('relationShip') as FormArray;
  }
  get salary(): FormArray {
    return this.gmcForm.get('salary') as FormArray;
  }
  get SI(): FormArray {
    return this.gmcForm.get('SI') as FormArray;
  }


  get self(): FormArray { return this.gmcForm.get('self') as FormArray; }
  get spouse(): FormArray { return this.gmcForm.get('spouse') as FormArray; }
  get child(): FormArray { return this.gmcForm.get('child') as FormArray; }
  get siblings(): FormArray { return this.gmcForm.get('siblings') as FormArray; }
  get parent(): FormArray { return this.gmcForm.get('parent') as FormArray; }
  get male(): FormArray { return this.gmcForm.get('male') as FormArray; }
  get female(): FormArray { return this.gmcForm.get('female') as FormArray; }


  addField(control: FormArray): void {
    control.push(this.fb.control('', Validators.required));
  }

  removeField(control: FormArray, index: number): void {
    control.removeAt(index);
  }


  onSubmit(): void {
    if (this.gmcForm.valid) {
      if (this.mode === "edit") {
        this.gmcFileTemplateService.update(this.id, this.gmcForm.value).subscribe({
          next: partner => {
            console.log("success")
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.gmcFileTemplateService.create(this.gmcForm.value).subscribe({
          next: partner => {
            console.log("success")
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: `Template Saved Successfully`,
              life: 3000
            });
            this.getTemplateData();
          },
          error: error => {
            console.log(error);
          }
        });
      }
    } else {
      console.log('Form is invalid');
      this.messageService.add({
        severity: "error",
        summary: "Fail",
        detail: "Fill all texbox",
        life: 3000
      });
    }
  }
}
