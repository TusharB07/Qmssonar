import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IEmpRates } from '../emprates.model';
import { EmpRatesService } from '../emprates.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-emprates-form',
  templateUrl: './emprates-form.component.html',
  styleUrls: ['./emprates-form.component.scss']
})
export class EmpRatesFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Employees Rate Template";
  recordPluralName = "Employees Rate Templates";
  modulePath: string = "/backend/admin/emprates";
  isEMPRatesFileuploaded: boolean = false;

  //xlsx
  productIdExcel: string;
  optionsProductsExcel: ILov[] = [];
  constructor(
    private empRatesService: EmpRatesService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    //private formBuilder: FormBuilder,
    private productService: ProductService,
    private appService: AppService,
    public messageService: MessageService,
  ) {


  }
  ngOnInit(): void {
   
  }

   //xlsx
  searchOptionsProductsExcel(event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        type: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          }
        ],
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
    this.productService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsProductsExcel = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => { }
    });
  }

  // Upload Download Version 2 --------------------------------------------------------------------------------------------------- START
  get bulkImportProps(): PFileUploadGetterProps {

    // if(this.productIdExcel!=null && this.productIdExcel!=undefined)
    // {
    //   this.messageService.add({
    //     severity: 'fail',
    //     summary: "Failed to download sample file",
    //     detail: "Please select product to download sample file",
    //   })
    // }
    return this.empRatesService.getBulkImportProps(this.productIdExcel, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
      if (dto.status == 'success') {
        window.location.reload();
      } else {
        alert(dto.data.entity?.errorMessage)
        if (dto.data.entity?.downloadablePath) {
          this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
        }
      }
    })
    
  }

  downloadEmpRatesDataSampleFile() {
    if (this.productIdExcel != undefined && this.productIdExcel != null) {
      this.empRatesService.downloadEmpRatesDataExcel(this.productIdExcel).subscribe({
        next: (response: any) => this.appService.downloadSampleExcel(response),
        error: e => {
          console.log(e)
        }
      })
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: "Failed to download sample file",
        detail: "Please select product to download sample file",
        
      })
    }
  }

  ProductChanged(value: any) {
    this.productIdExcel = value;
  }

}
