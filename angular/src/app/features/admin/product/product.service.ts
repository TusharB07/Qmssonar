import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { AllowedRoles } from "../role/role.model";
import { IUser } from "../user/user.model";
import { IProduct } from "./product.model";
import { ICategoryProductMaster } from "../category-product-master-features/category-product-master.model";

@Injectable({
    providedIn: "root"
})
export class ProductService extends CrudService<IProduct> {
    user: IUser

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/products`, http, accountService);
        accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
            }
        });
    }

    //   products-for-logged-in-broker

    // Load Products if no ic found
    getAllProductsForLoggedInBroker(categoryId?: string): Observable<IManyResponseDto<IProduct>> {
        let url = `${this.baseUrl}/products-for-logged-in-broker`;
        return this.http.get<IManyResponseDto<IProduct>>(url, { headers: this.accountService.bearerTokenHeader() });
    }

    getACategoryProductMaster() {
        return this.http.get(`${environment.apiUrl}/CategoryProductMaster`, {
            headers: this.accountService.bearerTokenHeader()
        })
    }

    async searchOptionsProducts(event?: any): Promise<ILov[]> {

        let optionsProducts: ILov[] = []

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                type: [
                    {
                        value: event?.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        // this.getMany(lazyLoadEvent).subscribe({
        //     next: data => {
        //         this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
        //     },
        //     error: e => { }
        // });
        let response;
        if ([
            AllowedRoles.BROKER_CREATOR,
            AllowedRoles.BROKER_CREATOR_AND_APPROVER,
            AllowedRoles.BROKER_APPROVER,
            AllowedRoles.SALES_CREATOR,
            AllowedRoles.SALES_APPROVER,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR,
            AllowedRoles.PLACEMENT_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.user.roleId['name'])) {
            response = await this.getAllProductsForLoggedInBroker().toPromise()
        } else if ([
            AllowedRoles.BROKER_CREATOR,
            AllowedRoles.BROKER_CREATOR_AND_APPROVER,
            AllowedRoles.BROKER_APPROVER,
            AllowedRoles.SALES_CREATOR,
            AllowedRoles.SALES_APPROVER,
            AllowedRoles.SALES_CREATOR_AND_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR,
            AllowedRoles.PLACEMENT_APPROVER,
            AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.user.roleId['name'])) {
            response = await this.getMany(lazyLoadEvent).toPromise()
        } else {
            response = await this.getMany(lazyLoadEvent).toPromise()
        }

        optionsProducts = response.data.entities.map((product) => ({ label: product.type, value: product._id }))

        return optionsProducts
    }

}
