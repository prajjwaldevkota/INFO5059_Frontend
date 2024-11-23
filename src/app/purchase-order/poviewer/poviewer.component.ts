import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.component';
import { PurchaseOrder } from '../purchase-order';
import { purchaseOrderService } from '../purchase-order.service';
import { PurchaseOrderLineItem } from '../purchase-order-line-item';
import { Vendor } from '@app/vendor/vendor';
import { NewVendorService } from '@app/vendor/newvendor.service';
import { ProductService } from '@app/product/product.service';
import { PDFURL } from '@app/constants';
import { Product } from '@app/product/product';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './poviewer.component.html',
  styles: ``,
})
export class POViewerComponent implements OnInit, OnDestroy {
  viewerForm: FormGroup;
  vendorid: FormControl;
  POid: FormControl;
  formSubscription?: Subscription;
  vendors: Vendor[] = [];
  msg: string;
  selectedVendor: Vendor;

  vendorProducts: Product[] = [];
  POProducts?: any[];
  POReports: PurchaseOrder[] = [];
  selectedPO?: PurchaseOrder;
  pickedVendor: boolean;
  pickedPO: boolean;
  products: Product[] = [];
  total = 0.0;

  constructor(
    private builder: FormBuilder,
    private productService: ProductService,
    private vendorService: NewVendorService,
    private purchaseOrderService: purchaseOrderService
  ) {
    this.msg = '';
    this.vendorid = new FormControl();
    this.POid = new FormControl();
    this.pickedVendor = false;
    this.pickedPO = false;

    this.viewerForm = builder.group({
      vendorid: this.vendorid,
      POid: this.POid,
    });
    this.selectedVendor = {
      id: 0,
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      name: '',
      email: '',
    };
  }
  ngOnInit(): void {
    this.onPickVendor();
    this.onPickPO();
    this.msg = 'loading vendors from server...';
    this.getAllVendors();
  }
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  }
  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
        this.msg = '';
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  }

  loadVendorPO(id: number): void {
    this.msg = 'loading expenses...';
    this.productService
      .getSome(id)
      .subscribe((product) => (this.vendorProducts = product));

    this.productService.getSome(id).subscribe((p) => (this.products = p));
  }

  loadVendorReports(id: number): void {
    this.purchaseOrderService.getSome(id).subscribe({
      next: (PO) => {
        this.POReports = PO;
      },
      error: (err) => {
        this.msg = 'Error loading reports';
        console.error(err);
      },
    });
  }

  onPickVendor(): void {
    this.formSubscription = this.viewerForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedVendor = val;
        this.loadVendorPO(this.selectedVendor.id);
        this.loadVendorReports(this.selectedVendor.id);
        this.pickedVendor = true;
        this.msg = 'Choose Product for Vendor';
      });
  }

  onPickPO(): void {
    const reportSubscription = this.viewerForm
      .get('POid')
      ?.valueChanges.subscribe((val) => {
        this.selectedPO = val;
        if (this.selectedPO && this.selectedPO.items && this.vendorProducts) {
          this.POProducts = this.selectedPO.items.map((item) => {
            const product = this.vendorProducts.find(
              (product) => product.id === item.productid
            );
            const price = product ? product.costprice : 0;
            const total = price * item.qty; // Calculate total for each item
            return {
              id: item.id,
              poid: this.selectedPO?.id,
              productid: item.productid,
              qty: item.qty,
              price: product ? product.costprice : 0,
              name: product ? product.name : '',
              total: total
            };
          });
          this.total = this.POProducts.reduce((acc, item) => acc + item.total, 0);
        }

        this.pickedPO = true;
        this.msg = `Details for PO ${this.selectedPO?.id}`;
      });
    this.formSubscription?.add(reportSubscription);
  }

  viewPDF(POno?: number): void {
    window.open(`${PDFURL}${POno}`, '_blank');
  }
}
