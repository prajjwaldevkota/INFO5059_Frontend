//interface for product

export interface Product {
  id: string;
  vendorid: number;
  name: String;
  costprice: number;
  msrp:number;
  rop:number;
  eoq:number;
  qoh:number;
  qoo:number;
  qrcode:string;
  qrcodetxt:string;
}
