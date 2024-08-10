import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { faTv, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { XtreamService } from 'src/services/xtream-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public faTv = faTv;
  constructor(private route: Router, private platform: Platform, private xtreamService: XtreamService) {

  }

  public navigate(path: string) {
    this.route.navigate(['home', path]);
  }

  public getLiveInformation() {
    this.xtreamService.getLineInformation().subscribe((r) => {
      console.log(r);
    }, (e) => console.log(e));
  }

}
