import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from '@app/product/product-home/product-home.component';
import { GeneratorComponent } from './purchase-order/generator/generator.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'CaseStudy - Home' },
  { path: 'vendor', component: VendorHomeComponent, title: 'CaseStudy - Vendor' },
  { path: '', component: HomeComponent, title: 'CaseStudy - Home' },
  {path:'product', component: ProductHomeComponent, title: 'CaseStudy - Product'},
  { path: 'generator', component: GeneratorComponent, title: 'CaseStudy - Generator' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
