import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseOrder } from './purchase-order';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root',
})
export class purchaseOrderService extends GenericHttpService<PurchaseOrder> {
  constructor(http: HttpClient) {
    super(http, `purchaseorders`);
  }
}
