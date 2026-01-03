import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { ICity } from "../../city/city.model";
import { CityService } from "../../city/city.service";
import { IPincode } from "../../pincode/pincode.model";
import { PincodeService } from "../../pincode/pincode.service";
import { IClientGroup } from "../client-group.model";
import { ClientGroupService } from "../client-group.service";

@Component({
  selector: "app-client-group-form",
  templateUrl: "./client-group-form.component.html",
  styleUrls: ["./client-group-form.component.scss"]
})
export class ClientGroupFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Client Group";
  recordPluralName = "Client Groups";
  modulePath: string = "/backend/admin/client-groups";

  optionsCities: ILov[] = [];
  optionsPincodes: ILov[] = [];

  constructor(
    private recordService: ClientGroupService,
    private cityService: CityService,
    private pincodeService: PincodeService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClientGroup>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.clientGroupName}`,
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

  createForm(client?: IClientGroup) {
    const city: ICity = client?.cityId as ICity;
    const pincode: IPincode = client?.pincodeId as IPincode;

    this.recordForm = this.formBuilder.group({
      _id: [client?._id],
      vin: [client?.vin, [Validators.required]],
      clientGroupName: [client?.clientGroupName, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      clientGroupContactName: [client?.clientGroupContactName, [Validators.required]],
      address: [client?.address, [Validators.required]],
      cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
      pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
      email: [client?.email, [Validators.required]],
      active: [client?.active],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["cityId"] = this.recordForm.value["cityId"].value;
      updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;

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
  searchOptionsCities(event) {

    this.cityService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  };

  searchOptionsPincodes(event) {
    this.pincodeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  };
}
