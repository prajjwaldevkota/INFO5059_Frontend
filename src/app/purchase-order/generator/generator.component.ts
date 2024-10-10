import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.component';
import { PurchaseOrder } from '../purchase-order';
import { purchaseOrderService } from '../purchase-order.service';
import { PurchaseOrderLineItem } from '../purchase-order-line-item';
import { Vendor } from '@app/vendor/vendor';
import { NewVendorService } from '@app/vendor/newvendor.service';
import { ProductService } from '@app/product/product.service';
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
  templateUrl: './generator.component.html',
  styles: ``,
})
export class GeneratorComponent implements OnInit, OnDestroy {
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  quantity: FormControl;

  formSubscription?: Subscription;
  vendors: Vendor[] = [];
  products: Product[] = [];
  vendorProducts: Product[] = [];
  items: PurchaseOrderLineItem[] = [];
  selectedProducts: Product[] = [];
  selectedProduct: Product;
  selectedVendor: Vendor;

  pickedProduct: boolean;
  pickedVendor: boolean;
  generatedPO: boolean;
  hasProduct: boolean;
  msg: string;
  total: number;
  sub: number;
  tax: number;
  POnumber: number = 0;
  readonly TAX_RATE: number = 0.13;

  quantityOptions: (number | string)[] = ['EOQ',0, 1, 2, 3, 4, 5, 10, 15, 20];

  constructor(
    private builder: FormBuilder,
    private productService: ProductService,
    private vendorService: NewVendorService,
    private purchaseOrderService: purchaseOrderService
  ) {
    this.pickedProduct = false;
    this.pickedVendor = false;
    this.generatedPO = false;
    this.msg = '';
    this.vendorid = new FormControl();
    this.productid = new FormControl();
    this.quantity = new FormControl();

    this.generatorForm = builder.group({
      vendorid: this.vendorid,
      productid: this.productid,
      quantity: this.quantity
    });

    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
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
    this.hasProduct = false;
    this.sub = 0.0;
    this. tax = 0.0;
    this.total = 0.0;
  }

  ngOnInit(): void {
    this.onPickVendor();
    this.onPickProduct();
    this.onChangeQuantity();
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

  loadVendorPO(): void {
    this.vendorProducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      next: (products: Product[]) => {
        this.vendorProducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => {},
    });
  }

  onPickVendor(): void {
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
          id: '',
          vendorid: 0,
          name: '',
          costprice: 0,
          msrp: 0,
          rop: 0,
          eoq: 0,
          qoh: 0,
          qoo: 0,
          qrcode: '',
          qrcodetxt: '',
        };
        this.selectedVendor = val;
        this.loadVendorPO();
        this.pickedProduct = false;
        this.hasProduct = false;
        this.msg = 'Choose Product for Vendor';
        this.pickedVendor = true;
        this.generatedPO = false;
        this.items = [];
        this.selectedProducts = [];
      });
  }

  onPickProduct(): void {
    const productSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = val;
        this.pickedProduct = true;
        this.quantity.setValue('EOQ');
      });
    this.formSubscription?.add(productSubscription);
  }

  onChangeQuantity(): void {
    const quantitySubscription = this.generatorForm
      .get('quantity')
      ?.valueChanges.subscribe((val) => {
        if (this.selectedProduct) {
          const qty = val === 'EOQ' ? this.selectedProduct.eoq : val;
          this.updateOrAddItem(this.selectedProduct, qty);
          this.calculateTotal();
        }
      });
    this.formSubscription?.add(quantitySubscription);

  }

  updateOrAddItem(product: Product, quantity: number): void {
    const existingItemIndex = this.items.findIndex(i => i.productid === product.id);
    if (existingItemIndex > -1) {
      if (quantity === 0) {
        // Remove the item if quantity is 0
        this.items.splice(existingItemIndex, 1);
        this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
        this.msg = `${product.name} removed!`;
      } else {
        // Update existing item
        this.items[existingItemIndex].qty = quantity;
      }
    } else if (quantity > 0) {
      // Add new item
      const newItem: PurchaseOrderLineItem = {
        id: 0,
        poid: 0,
        productid: product.id,
        qty: quantity,
        price: product.costprice,
      };
      this.items.push(newItem);
      this.selectedProducts.push(product);
      this.msg = `${quantity} ${product.name} added!`;
    }
    this.hasProduct = this.items.length > 0;

  }

  calculateTotal(): void {
    this.sub = this.items.reduce((sum, item) => {
      const product = this.selectedProducts.find(p => p.id === item.productid);
      return sum + (item.qty * (product?.costprice || 0));
    }, 0);
    this.tax = this.sub * this.TAX_RATE;
    this.total = this.sub + this.tax;

  }


  createPO(): void {
    this.generatedPO = false;
    const po: PurchaseOrder = {
      id: 0,
      vendorid: this.selectedVendor.id,
      amount: this.total,
      items: this.items,
    };

    this.purchaseOrderService.create(po).subscribe({
      next: (po: PurchaseOrder) => {
        po.id > 0
          ? (this.msg = `Purchase Order ${po.id} created!`)
          : (this.msg = `Purchase Order not created!`);
        this.POnumber = po.id;
      },
      error: (err: Error) => (this.msg = `PO not added! - ${err.message}`),
      complete: () => {
        this.hasProduct = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.generatedPO = true;
        this.resetVendorSelection();
      },
    });
  }
  resetVendorSelection(): void {
    this.vendorid.reset();
    this.productid.reset();
    this.quantity.reset();
    this.pickedVendor = false;
    this.pickedProduct = false;
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
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.vendorProducts = [];
  }
}
