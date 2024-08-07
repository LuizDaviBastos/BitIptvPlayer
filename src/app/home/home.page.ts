import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { faTv, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public faTv = faTv;
  constructor(private route: Router, private platform: Platform) {

  }

  public navigate(path: string) {
    this.route.navigate(['home', path]);
  }


}
