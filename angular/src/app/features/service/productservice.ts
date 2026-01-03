import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../account/account.service";
import { IProduct } from "../admin/product/product.model";

import { Product } from "../domain/product";

@Injectable()
export class ProductService extends CrudService<IProduct>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/products`, http, accountService);
  }

  getProductsSmall() {
    return this.http
      .get<any>("assets/demo/data/products-small.json")
      .toPromise()
      .then(res => res.data as Product[])
      .then(data => data);
  }

  getProducts() {
    return this.http
      .get<any>("assets/demo/data/products.json")
      .toPromise()
      .then(res => res.data as Product[])
      .then(data => data);
  }

  getProductsMixed() {
    return this.http
      .get<any>("assets/demo/data/products-mixed.json")
      .toPromise()
      .then(res => res.data as Product[])
      .then(data => data);
  }

  getProductsWithOrdersSmall() {
    return this.http
      .get<any>("assets/demo/data/products-orders-small.json")
      .toPromise()
      .then(res => res.data as Product[])
      .then(data => data);
  }
}
