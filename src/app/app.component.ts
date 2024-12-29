import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
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
      StatusBar.setBackgroundColor({ color: "#000000" });
    }
  }

  async ngAfterViewInit() {
    console.log('app component')
  }


}
