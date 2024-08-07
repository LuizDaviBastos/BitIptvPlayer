import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    if (!this.platform.is("mobileweb")) {
      ScreenOrientation.lock({ orientation: 'landscape' });
    }
  }

  async ngAfterViewInit() {

  }


}
