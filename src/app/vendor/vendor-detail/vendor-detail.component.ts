import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  input,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Form, Validators } from '@angular/forms';
import { ValidatePhone } from '@app/validator/phoneno.validator';
import { ValidatePostal } from '@app/validator/postal.validator';
import { Vendor } from '../vendor';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
})
export class VendorDetailComponent implements OnInit {
  @Input() selectedVendor: Vendor = {
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

  @Input() vendors: Vendor[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  vendorForm: FormGroup;
  address1: FormControl;
  city: FormControl;
  province: FormControl;
  postalcode: FormControl;
  phone: FormControl;
  type: FormControl;
  name: FormControl;
  email: FormControl;

  constructor(private builder: FormBuilder) {
    this.address1 = new FormControl('', Validators.compose([Validators.required]));
    this.city = new FormControl('', Validators.compose([Validators.required]));
    this.province = new FormControl('', Validators.compose([Validators.required]));
    this.postalcode = new FormControl('', Validators.compose([Validators.required, ValidatePostal]));
    this.phone = new FormControl('', Validators.compose([Validators.required, ValidatePhone]));
    this.type = new FormControl('', Validators.compose([Validators.required]));
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.email = new FormControl('', Validators.compose([Validators.required, Validators.email]));

    this.vendorForm = new FormGroup({
      address1: this.address1,
      city: this.city,
      province: this.province,
      postalcode: this.postalcode,
      phone: this.phone,
      type: this.type,
      name: this.name,
      email: this.email,
    });
  } //ctr

  ngOnInit(): void {
    this.vendorForm.patchValue({

      address1: this.selectedVendor.address1,
      city: this.selectedVendor.city,
      province: this.selectedVendor.province,
      postalcode: this.selectedVendor.postalcode,
      phone: this.selectedVendor.phone,
      type: this.selectedVendor.type,
      name: this.selectedVendor.name,
      email: this.selectedVendor.email,
    });
  }

  updateSelectedVendor(): void {
    this.selectedVendor = {
      id: this.selectedVendor.id,
      address1: this.vendorForm.value.address1,
      city: this.vendorForm.value.city,
      province: this.vendorForm.value.province,
      postalcode: this.vendorForm.value.postalcode,
      phone: this.vendorForm.value.phone,
      type: this.vendorForm.value.type,
      name: this.vendorForm.value.name,
      email: this.vendorForm.value.email,
    };
    this.saved.emit(this.selectedVendor);
  }
}
