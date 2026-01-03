import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { AllowedProductBscCover, IProduct, OPTIONS_MONTH_YEAR, OPTIONS_PRODUCT_BSC_COVERS, OPTIONS_PRODUCT_TEMPLATES } from "../product.model";
import { ProductService } from "../product.service";
import {ICategoryProductMaster} from "../../category-product-master-features/category-product-master.model";
import {CategoryNamesService} from 'src/app/shared/category-names.service.ts';
import {SelectItem} from "primeng/api"; // Import the shared service

@Component({
    selector: "app-product-form",
    templateUrl: "./product-form.component.html",
    styleUrls: ["./product-form.component.scss"]
})
export class ProductFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;
    categoryNames: SelectItem[] = [];
    recordSingularName = "Product";
    recordPluralName = "Products";
    modulePath: string = "/backend/admin/products";
    optionsBscCovers: ILov[]
    optionsProductTemplate: ILov[]
    optionsMonthYear : ILov[]

    constructor(
        private recordService: ProductService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.optionsBscCovers = OPTIONS_PRODUCT_BSC_COVERS
        this.optionsProductTemplate = OPTIONS_PRODUCT_TEMPLATES
        this.optionsMonthYear = OPTIONS_MONTH_YEAR
    }

    ngOnInit(): void {
        this.recordService.getACategoryProductMaster().subscribe(
            (response: any) => {
                const data = response.data;
                // Check if data.entities is an array before using map
                if (Array.isArray(data.entities)) {
                    // Assuming your API response has an array of objects with 'name' and '_id' properties
                    this.categoryNames = data.entities.map(item => ({ label: item.name, value: item._id }));
                } else {
                    console.error('Invalid data received:', data);
                }
            },
            error => {
                console.error('Error fetching category names:', error);
            }
        );
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IProduct>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            label: `${dto.data.entity.status}`,
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

    createForm(product?: IProduct) {
        this.recordForm = this.formBuilder.group({
            _id: [product?._id],
            type: [product?.type, [Validators.required]],
            shortName: [product?.shortName, [Validators.required]],
            bscCovers: [product?.bscCovers],
            mandatoryCovers: [product?.mandatoryCovers],
            category: [product?.category || ''],
            categoryId: [product?.categoryId || ''],// If you want to pre-populate with existing data
            productTemplate: [product?.productTemplate],
            status: [product?.status ? true : false],
            renewalPolicyPeriodinMonthsoryears : [product?.renewalPolicyPeriodinMonthsoryears],
            is_validation_check : [product?.is_validation_check ?? false],
            isFlexaShow:[product?.isFlexaShow ?? false],
            isFire:[product?.isFire ?? false],
            isSTFI:[product?.isSTFI ?? false],
            isTerrorism:[product?.isTerrorism ?? false],
            isEarthQuake:[product?.isEarthQuake ?? false],
            isOccupancySubTypeShow:[product?.isOccupancySubTypeShow ?? false],
            isOccupancyWiseRate:[product?.isOccupancyWiseRate ?? false],
            isSubOccupancyWiseRate: [product?.isSubOccupancyWiseRate ?? false],
            numberOfYears:[product?.numberOfYears ?? 1],
            numberOfMonths:[product?.numberOfMonths ?? 3],
            isFireRequired: [product?.isFireRequired ?? false],
            isSTFIRequired: [product?.isSTFIRequired ?? false],
            isTerrorismRequired: [product?.isTerrorismRequired ?? false],
            isEarthQuakeRequired: [product?.isEarthQuakeRequired ?? false],
            isOccupancywiseTenure:[product?.isOccupancywiseTenure ?? false],
            isOccupancyWiseInbuiltaddonRate: [product?.isOccupancyWiseInbuiltaddonRate ?? false],
            isBuildingAndContentWiseRate:[product?.isBuildingAndContentWiseRate ?? false]
        });
    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        if (this.recordForm.valid) {
            const formData = { ...this.recordForm.value };
            console.log(formData)

            if (formData.mandatoryCovers && formData.bscCovers) {
                const mCovers = formData.mandatoryCovers;
                const bCovers = formData.bscCovers;
                const updatedCover = mCovers.filter(cover => bCovers.includes(cover));
                formData.mandatoryCovers = [...updatedCover];
            }

            delete formData.categoryLabel;

            if (formData.category) {
                // If category is selected, find the corresponding label and id
                const selectedCategory = this.categoryNames.find(
                    category => category.value === formData.category);
                formData.categoryLabel = selectedCategory ? selectedCategory.label : null;
                formData.categoryId = selectedCategory ? selectedCategory.value : null;
            }

            if (formData.categoryId) {
                formData.categoryId = formData.categoryId.toString();
            }

            if (this.mode === "edit") {
                this.recordService.update(this.id, formData).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            if (this.mode === "new") {
                this.recordService.create(formData).subscribe({
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
        this.recordService.setFilterValueExist(true);
        this.router.navigateByUrl(`${this.modulePath}`);
    }
}
