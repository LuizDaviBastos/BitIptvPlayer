import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Conta } from 'src/model/Conta.model';
import { FireBaseService } from 'src/services/firebase-service';
import Hls from 'hls.js';
import { StreamFileManager } from 'src/services/stream-file-manager-service';
import { Channel } from '../../model/channel';
import { DatabaseService } from 'src/services/database-service';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('video') videoRef?: ElementRef;
  public conta: Conta = new Conta;
  public player: Hls = new Hls();
  public newChannel: Channel = new Channel();
  public url: string = 'http://play.1list.vip/get.php?username=Toninho401&password=exitus03&type=m3u_plus&output=m3u8';
  public channels: Channel[] = [];
  public pagedChannels: Channel[][] = this.paginateList<Channel[]>(this.databaseService.getChannels());
  public currentPage: number = 1;
  public search: string = '';

  constructor(public fb: FireBaseService<Conta>, private route: Router, public alertController: AlertController, private platform: Platform,
    private streamFileManager: StreamFileManager,
    private databaseService: DatabaseService
  ) {
    fb.configure(() => new Conta());
    this.platform.backButton.subscribeWithPriority(10, () => {
      //this.route.navigate(['tabs/tab1']);
    });
  }
  async ngAfterViewInit() {
    await ScreenOrientation.lock({ orientation: 'landscape' });
    this.player = new Hls();
    const video = this.videoRef?.nativeElement as HTMLVideoElement;
    this.player.attachMedia(video);

    this.player.on(Hls.Events.ERROR, (event, data) => {
      if (data.details == "bufferStalledError") return;
      console.log('HLS playback error:', data);
    });

    this.platform.ready().then(async () => {
      this.listChannels();
      //await this.databaseService.initializePlugin();

    });
  }

  ngOnInit() {

  }

  public addChannel() {
    this.databaseService.addChannel(this.newChannel);
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.detachMedia();
      this.player.destroy();
    }
  }

  public onSearch() {
    if(!this.search) {

    }
    this.pagedChannels = this.paginateList(this.databaseService.getChannels().filter(x => x.name?.toLocaleLowerCase()?.includes(this.search?.toLocaleLowerCase())));
    this.channels = this.pagedChannels[this.currentPage];
  }

  public async listChannels(event?: any) {
    let channelsJson = localStorage.getItem('channels');
    if (channelsJson && channelsJson != "undefined") {
      this.channels = JSON.parse(channelsJson);
    } else {
      if (await this.databaseService.hasChannels()) {
        this.pagedChannels = this.paginateList(this.databaseService.getChannels());
      }
      else {
        this.streamFileManager.downloadAndReadFile(this.url).then((response) => {
          const channels = this.streamFileManager.parseChannels(response);
          this.pagedChannels = this.paginateList(channels);
          this.channels = this.pagedChannels[this.currentPage];
          this.databaseService.addChannels(channels);
        });
      }

      this.channels = this.pagedChannels[this.currentPage];
    }
    event && event.target.complete();
    localStorage.setItem('channels', JSON.stringify(this.channels))
  }

  public paginateList<T>(list: any[], pageSize: number = 20): any[][] {
    let paginatedList: T[][] = [];
    for (let i = 0; i < list.length; i += pageSize) {
      paginatedList.push(list.slice(i, i + pageSize));
    }
    return paginatedList;
  }

  public selectChannel(channel: Channel) {
    this.player.loadSource(channel.url!);

    this.player.on(Hls.Events.MANIFEST_PARSED, () => {
      this.player.startLoad();
    });
  }

}
