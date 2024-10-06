import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import Hls from 'hls.js';
import { XtreamService } from 'src/services/xtream-service';
import { IChannel } from 'src/interfaces/channel.interface';

@Component({
    selector: 'bit-player',
    templateUrl: 'player.component.html',
    styleUrls: ['player.component.scss'],
})
export class PlayerComponent {


    @ViewChild('video') videoRef?: ElementRef;
    @ViewChild('videoContainer') videoContainer?: ElementRef;
    public player?: Hls = new Hls();
    public video?: HTMLVideoElement;
    
    public seconds: number = 0;
    public currentChannel?: IChannel;
    //public url: string = 'http://play.1list.vip/get.php?username=Robson1374&password=ch3av1jnzme&type=m3u_plus&output=ts';
    public errorcount: number = 0;
    public showCannotPlay: boolean = false;
    public showReconnecting: boolean = false;
    public showVideo: boolean = false;
    public showLoadingContainer: boolean = false;

    constructor(public alertController: AlertController, private platform: Platform,
        private xtreamService: XtreamService) {

    }

    async ngAfterViewInit() {
        //this.showLoading(true);
        this.videoContainer
        this.video = this.videoRef?.nativeElement as HTMLVideoElement;
        this.player = new Hls();
        this.player.attachMedia(this.video);

        this.player.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("MANIFEST_PARSED")
            this.player!.startLoad();
            this.seconds = 0;
            this.errorcount = 0;

            this.showReconnecting = false;
            this.showCannotPlay = false;
            this.showLoadingContainer = false;
            
            this.setVideoVisible(true);
        });

        this.player.on(Hls.Events.ERROR, (event, data) => {
            this.errorcount++;
            this.showLoadingContainer = false;
            this.setVideoVisible(false);

            if (this.errorcount <= 5) {
                this.showReconnecting = true;
                this.showCannotPlay = false;

                this.selectChannel(this.currentChannel!, false);
                this.setVideoVisible(false);
            }

            if (this.errorcount > 5) {
                this.setVideoVisible(false);
                this.showCannotPlay = true;
                this.showReconnecting = false;
            }
            if (data.details == "bufferStalledError") return;
            console.log('HLS playback error:', data);
        });

    }

    public ngOnDestroy() {
        if (this.player) {
            this.player.detachMedia();
            this.player.destroy();
        }
    }

    public selectChannel(channel: IChannel, force: boolean = true) {
        this.currentChannel = channel;
        if (!this.player) return;

        if (force) {
            this.showLoading(true);
            this.showCannotPlay = false;
            this.showReconnecting = false;
            this.errorcount = 0;
        }

        setTimeout(() => {
            if (!this.player) return;
            const url = this.xtreamService.getChannelUrl(channel);
            this.player.loadSource(url);
            this.video!.volume = 0;
        }, force ? 0 : 5000);

    }

    public destroyPlayer() {
        if (this.player) {
            this.player.detachMedia();
            this.player.destroy();
            this.player = undefined;
        }
    }

    public setVideoVisible(visible: boolean) {
        if(this.videoContainer?.nativeElement) {
            this.videoContainer.nativeElement.hidden = !visible;
        }
    }

    public showLoading(status: boolean) {
        this.showLoadingContainer = status;
        this.setVideoVisible(!status);
    }
}

