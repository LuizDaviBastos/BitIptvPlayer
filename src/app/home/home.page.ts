import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { faTv, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { XtreamService } from 'src/services/xtream-service';
import { ChannelService } from 'src/services/channel-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  public faTv = faTv;
  public LIVEpercent: number = 0;
  public LIVEShowLoading: boolean = true;
  constructor(private route: Router, private platform: Platform, private xtreamService: XtreamService, 
    private channelService: ChannelService) {

  }
  ngAfterViewInit(): void {
    this.platform.ready().then(async () => {
      this.channelService.login().then(async () => {
          if (!(await this.channelService.hasLIVEChannels())) {
              this.channelService.downloadLIVEChannels().subscribe((percent) => {
                this.LIVEpercent = percent / 100;
                  //console.log(`LIVE Channels Downloading: ${percent}%`);
              }, () => { }, () => {
                this.LIVEShowLoading = false;
              });
          } else {
            this.LIVEShowLoading = false;
          }
      });
  });
  }

  public navigate(path: string) {
    if(this.LIVEShowLoading) return;
    
    this.route.navigate(['home', path]);
  }

  public getLiveInformation() {
    this.xtreamService.getLineInformation().subscribe((r) => {
      console.log(r);
    }, (e) => console.log(e));
  }



}
