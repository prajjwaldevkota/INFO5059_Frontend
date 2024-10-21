import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/home/home.component';
import { VendorHomeComponent } from '@app/vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from '@app/product/product-home/product-home.component';
import { GeneratorComponent } from '@app/purchase-order/generator/PO-generator.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'CaseStudy - Home' },
  { path: '', component: HomeComponent, title: 'CaseStudy - Home' },
  {
    path: 'vendor',
    component: VendorHomeComponent,
    title: 'CaseStudy - Vendor',
  },
  {
    path: 'product',
    component: ProductHomeComponent,
    title: 'CaseStudy - Product',
  },
  {
    path: 'generator',
    component: GeneratorComponent,
    title: 'CaseStudy - Generator',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
