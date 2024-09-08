import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  templateUrl: 'vendor-home.component.html',
})
export class VendorHomeComponent implements OnInit {
  msg: string;
  vendors$?: Observable<Vendor[]>;
  vendor: Vendor;
  hideEditForm: boolean;
  todo: string;
  initialLoad: boolean;

  constructor(public vendorService: VendorService) {
    this.vendor = {
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
    this.msg = '';
    this.initialLoad = true;
    this.hideEditForm = true;
    this.todo = '';
  } // constructor

  ngOnInit(): void {
    (this.vendors$ = this.vendorService.get()),
      catchError((err) => (this.msg = err.message));
  } // ngOnInit

  select(vendor: Vendor): void {
    this.todo = 'update';
    this.vendor = vendor;
    this.msg = `${vendor.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    msg ? (this.msg = 'Operation cancelled') : null;
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
   * update - send changed update to service
   */
  update(vendor: Vendor): void {
    this.vendorService.update(vendor).subscribe({
      // Create observer object
      next: (ven: Vendor) => (this.msg = `Vendor ${ven.name} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update

  /**
   * save - determine whether we're doing and add or an update
   */

  save(vendor: Vendor): void {
    vendor.id ? this.update(vendor) : this.add(vendor);
  }

  /**
   * add - send new vendor to service
   */

  add(vendor: Vendor): void {
    vendor.id = 0;
    this.vendorService.add(vendor).subscribe({
      next: (ven: Vendor) => (this.msg = `Vendor ${ven.id} added!`),
      error: (err: Error) => (this.msg = `Add failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // add

  /**
   * delete - send vendor id to delete to service
   */
  delete(vendor: Vendor): void {
    this.vendorService.delete(vendor.id).subscribe({
      // Create observer object
      next: (numOfVendorsDeleted: number) => {
        numOfVendorsDeleted === 1
          ? (this.msg = `Vendor ${vendor.name} deleted!`)
          : (this.msg = `vendor not deleted`);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // delete

  /**
   * new - create new vendor object
   */

  newVendor(): void {
    this.vendor = {
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
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'New vendor';
    }
}// VendorHomeComponent
