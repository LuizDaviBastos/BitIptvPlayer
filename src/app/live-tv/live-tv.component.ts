import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Provider, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Conta } from 'src/model/Conta.model';
import { FireBaseService } from 'src/services/firebase-service';
import Hls from 'hls.js';
import { StreamFileManager } from 'src/services/stream-file-manager-service';
import { Channel } from '../../model/channel';
import { DatabaseService } from 'src/services/database-service.mobile';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { IDatabaseService } from 'src/interfaces/database-service.interface';
import { DatabaseServiceWeb } from 'src/services/database-service.web';
import { Utils } from 'src/utils/utils';
import { XtreamService } from 'src/services/xtream-service';
import { ICategory } from 'src/interfaces/category.interface';
import { IChannel } from 'src/interfaces/channel.interface';

@Component({
    selector: 'live-tv',
    templateUrl: 'live-tv.component.html',
    styleUrls: ['live-tv.component.scss'],
})
export class LiveTvComponent {


    @ViewChild('video') videoRef?: ElementRef;
    public player: Hls = new Hls();
    public url: string = 'http://play.1list.vip/get.php?username=Robson1374&password=ch3av1jnzme&type=m3u_plus&output=m3u8';
    public channels: IChannel[] = [];
    private databaseService!: IDatabaseService;
    public pagedChannels: Channel[][] = Utils.paginateList<Channel[]>([]);
    public currentPage: number = 0;
    public search: string = '';
    public categories: ICategory[] = [];

    constructor(public fb: FireBaseService<Conta>, private route: Router, public alertController: AlertController, private platform: Platform,
        private streamFileManager: StreamFileManager, private xtreamService: XtreamService) {
        fb.configure(() => new Conta());

        this.platform.backButton.subscribeWithPriority(10, () => {
            //this.route.navigate(['tabs/tab1']);
        });

        if (!this.platform.is("desktop")) {
            ScreenOrientation.lock({ orientation: 'landscape' });
            this.databaseService = inject(DatabaseService)
        } else {
            this.databaseService = inject(DatabaseServiceWeb)
        }
    }

    async ngAfterViewInit() {
        if (!this.platform.is("desktop")) {
            await ScreenOrientation.lock({ orientation: 'landscape' });
        }

        this.player = new Hls();
        const video = this.videoRef?.nativeElement as HTMLVideoElement;
        this.player.attachMedia(video);

        this.player.on(Hls.Events.ERROR, (event, data) => {
            if (data.details == "bufferStalledError") return;
            console.log('HLS playback error:', data);
        });

        this.platform.ready().then(async () => {
            this.xtreamService.login({
                auth: {
                    username: 'Robson1374',
                    password: 'ch3av1jnzme'
                },
                baseUrl: 'http://play.1list.vip'
            })

            await this.databaseService.initializePlugin();
            this.listChannels();
        });
    }

    ngOnInit() {

    }


    ngOnDestroy() {
        if (this.player) {
            this.player.detachMedia();
            this.player.destroy();
        }
    }

    public clearChannels() {
        this.databaseService.clearChannels().then(() => {
            this.channels = [];
        });
    }

    public async onSearch() {
        console.log('onSearch');
        if (!this.search) {
            this.databaseService.loadChannels();
            this.pagedChannels = Utils.paginateList(await this.databaseService.getChannels());
            //this.channels = this.pagedChannels[this.currentPage];
        }
        var channelsC = await this.databaseService.searchChannels(this.search);
        this.pagedChannels = Utils.paginateList(channelsC);
        //this.channels = this.pagedChannels[this.currentPage];
    }

    public selectCategory(category: ICategory) {
        this.xtreamService.getLiveStreams(category.category_id).subscribe((lives) => {
            this.channels = lives;
        });
    }

    public async listChannels(event?: any) {

        this.xtreamService.getLiveStreamCategory().subscribe((categories) => {
            this.categories = categories;
        });

        return;
        if ((await this.databaseService.hasChannels())) {
            await this.databaseService.loadChannels();
            const channels = this.databaseService.getChannels();
            this.pagedChannels = Utils.paginateList(channels);
            //this.channels = this.pagedChannels[this.currentPage];
        }
        else {
            this.streamFileManager.downloadAndReadFile(this.url, (percent) => {
                console.log(percent);
            }).then((response) => {
                const channels = this.streamFileManager.parseChannels(response);
                this.pagedChannels = Utils.paginateList(channels);
                //this.channels = this.pagedChannels[this.currentPage];
                this.databaseService.addChannels(channels);
            });
        }
        event && event.target.complete();

    }

    public selectChannel(channel: IChannel) {
        const url = this.xtreamService.getChannelUrl(channel)
        this.player.loadSource(url);

        this.player.on(Hls.Events.MANIFEST_PARSED, () => {
            this.player.startLoad();
        });
    }

}
