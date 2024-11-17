import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { Vendor } from '@app/vendor/vendor';
import { VendorModule } from '@app/vendor/vendor.module';
import { NewVendorService } from '@app/vendor/newvendor.service';
import { VendorDetailComponent } from '@app/vendor/vendor-detail/vendor-detail.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    CommonModule,
    MatComponentsModule,
    VendorModule,
    ProductDetailComponent,
  ],
  templateUrl: './product-home.component.html',
})
export class ProductHomeComponent implements OnInit {
  products: Product[] = [];
  productInterface: Product;
  displayedColumns: string[] = ['id', 'productName', 'vendorId'];
  msg: string = '';
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();

  vendors: Vendor[] = [];
  hideEditForm: boolean = true;

  constructor(
    public vendorService: NewVendorService,
    public productService: ProductService
  ) {
    this.msg = '';
    this.productInterface = {
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
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllVendors();
  } //ngOnInit

  getAllProducts(passedMsg: string = ''): void {
    this.productService.getAll().subscribe({
      //create new observer object
      next: (products: Product[]) => {
        this.products = products;
        this.dataSource.data = this.products;
      },
      error: (err: any) =>
        (this.msg = `Couldn't get products = ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Products Loaded!`),
    });
  } //getAllProducts

  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get Products = ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Products Loaded!`),
    });
  } //getAllVendors

  select(selectedProduct: Product): void {
    this.productInterface = selectedProduct;
    this.msg = `Product ${selectedProduct.id} selected`;
    this.hideEditForm = !this.hideEditForm;
  } //select

  cancel(msg?: string): void {
    this.msg = msg ? msg : 'Operation Cancelled!';
    this.hideEditForm = !this.hideEditForm;
  } //cancel

  update(selectedProduct: Product): void {
    this.productService.update(selectedProduct).subscribe({
      next: (updatedProduct: Product) => {
        let msg = `Product ${updatedProduct.id} updated!`;
        this.getAllProducts(msg);
      },
      error: (err: Error) =>
        (this.msg = `Product not updated = ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } //update

  save(product: Product): void {
    const exists = this.products.find((p) => p.id === product.id);
    exists ? this.update(product) : this.add(product);
  }

  add(newProduct: Product): void {
    this.productService.create(newProduct).subscribe({
      next: (addedProduct: Product) => {
        let msg = `Product ${addedProduct.name} added!`;
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Product not added = ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } //add

  delete(selectedProduct: Product): void {
    this.productService.productDelete(selectedProduct.id).subscribe({
      next: (numOfDeletedProduct: number) => {
        let msg = '';
        numOfDeletedProduct === 1
          ? (msg = `Product ${selectedProduct.id} deleted!`)
          : (msg = `Product ${selectedProduct.id} not deleted!`);
        this.getAllProducts(msg);
      },
      error: (err: Error) =>
        (this.msg = `Product not deleted = ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } //delete

  newProduct(): void {
    this.productInterface = {
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
    this.msg = 'New Product';
    this.hideEditForm = !this.hideEditForm;
  } //newProduct

  sortProductWithObjectLiterals(sort: Sort) {
    const literals = {
      //sort on vendor id
      vendorId: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.vendorid - b.vendorid
              : b.vendorid - a.vendorid // descending
        )),
    };
    literals[sort.active as keyof typeof literals]();
  }
  pageSize = 5;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.dataSource.paginator = paginator;
  }
} //getHomeComponent
