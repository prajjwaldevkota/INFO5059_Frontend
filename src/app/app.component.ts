import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-casestudy',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title: string = '';
  constructor(private location: Location) {
    let path = location.path();
    if (path && path.length > 1) {
      let header = path.substring(1, 2).toUpperCase();
      header += path.substring(2);
      this.setTitle(header);
    } else if (path === '') {
      this.setTitle('');
    }
  }
  setTitle(header: string) {
    this.title = header ? header : 'Home';
  }
}
