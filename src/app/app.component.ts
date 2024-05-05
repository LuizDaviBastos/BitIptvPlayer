import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { CapacitorVideoPlayerWeb, Device } = Plugins;
import { Platform } from '@ionic/angular';
import { CapacitorVideoPlayer, CapacitorVideoPlayerPlugin, capVideoPlayerOptions } from 'capacitor-video-player';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) { }

  public videoPlayer?: CapacitorVideoPlayerPlugin;
  public url: string = '';
  async ngAfterViewInit() {
    if (this.platform.is('ios') || this.platform.is('android')) {

    } else {

    }
    this.videoPlayer = CapacitorVideoPlayer
  }

  async testVideoPlayerPlugin() {
    this.url = "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
    document.addEventListener(<any>'jeepCapVideoPlayerPlay', this.videoPlay, false);
    document.addEventListener(<any>'jeepCapVideoPlayerPause', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPause ', e.detail) }, false);
    document.addEventListener(<any>'jeepCapVideoPlayerEnded', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerEnded ', e.detail) }, false);
    const res: any = await this.videoPlayer!.initPlayer(<capVideoPlayerOptions>{ mode: "fullscreen", url: this.url });

  }

  public videoPlay(e: CustomEvent<any>) {
    console.log('e: ', e);
    console.log('video plau');
  }

}
