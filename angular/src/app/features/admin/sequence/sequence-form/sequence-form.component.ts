import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AllowedSequences, ISequence, OPTIONS_ALLOWED_SEQUENCE } from '../sequence.model';
import { SequenceService } from '../sequence.service';

@Component({
    selector: 'app-sequence-form',
    templateUrl: './sequence-form.component.html',
    styleUrls: ['./sequence-form.component.scss']
})
export class SequenceFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;

    recordSingularName = "Sequence";
    recordPluralName = "Sequence";
    modulePath: string = "/backend/admin/sequence";

    allowedSequences = OPTIONS_ALLOWED_SEQUENCE;


    constructor(
        private recordService: SequenceService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<ISequence>) => {
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

    createForm(item?: ISequence) {

        this.recordForm = this.formBuilder.group({
            _id: [item?._id],
            name: [item?.name, [Validators.required]],
            currentSequenceValue: [item?.currentSequenceValue, [Validators.required, Validators.min(0)]],
            paddingLeft: [item?.paddingLeft, []],
            paddingRight: [item?.paddingRight, []],
            paddingCharacter: [item?.paddingCharacter, []],
            fullLength: [item?.fullLength, [Validators.required]],

        });
    }

    saveRecord() {
        // console.log(this.userForm.value);

        if (this.recordForm.valid) {

            const updatePayload = { ...this.recordForm.value };

            if (this.mode === "edit") {
                this.recordService.update(this.id, updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            if (this.mode === "new") {
                this.recordService.create(updatePayload).subscribe({
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
}
