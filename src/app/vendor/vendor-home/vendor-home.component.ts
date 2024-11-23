import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { NewVendorService } from '@app/vendor/newvendor.service';

@Component({
  templateUrl: 'vendor-home.component.html',
})
export class VendorHomeComponent implements OnInit {
  msg: string;
  vendors: Vendor[] = [];
  vendor: Vendor;
  hideEditForm: boolean;
  todo: string;

  constructor(public newvendorService: NewVendorService) {
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
    this.hideEditForm = true;
    this.todo = '';
  } // constructor
  ngOnInit(): void {
    this.getAll();
  } // ngOnInit

  select(ven: Vendor): void {
    this.todo = 'update';
    this.vendor = ven;
    this.msg = `${ven.name} selected`;
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
    this.newvendorService.update(vendor).subscribe({
      // Create observer object
      next: (ven: Vendor) => {
        this.msg = `Vendor ${ven.name} updated!`;
        this.getAll();
      },
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update
  /**
   * getAll - retrieve everything
   */
  getAll(passedMsg: string = ''): void {
    this.newvendorService.getAll().subscribe({
      // Create observer object
      next: (ven: Vendor[]) => {
        this.vendors = ven;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAll
  /**
   * save - determine whether we're doing and add or an update
   */
  save(vendor: Vendor): void {
    vendor.id ? this.update(vendor) : this.add(vendor);
  } // save
  /**
   * add - send vendor to service, receive new vendor back
   */
  add(vendor: Vendor): void {
    vendor.id = 0;
    this.newvendorService.create(vendor).subscribe({
      // Create observer object
      next: (ven: Vendor) => {
        this.getAll(`Vendor ${ven.name} added!`);
      },
      error: (err: Error) => (this.msg = `Vendor not added! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm), // this calls unsubscribe
    });
  } // add
  /**
   * delete - send vendor id to service for deletion
   */
  delete(vendor: Vendor): void {
    this.newvendorService.delete(vendor.id).subscribe({
      // Create observer object
      next: (numOfVendorDeleted: number) => {
        let msg: string = '';
        numOfVendorDeleted === 1
          ? (msg = `Vendor ${vendor.name} deleted!`)
          : (msg = `Vendor ${vendor.name} not deleted!`);
        this.getAll(msg);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // delete
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
} // VendorHomeComponent
