import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Conta } from 'src/model/Conta.model';
import { FireBaseService } from 'src/services/firebase-service';
import { StreamFileManager } from 'src/services/stream-file-manager-service';
import { Channel } from '../../model/channel';
import { DatabaseService } from 'src/services/database-service.mobile';
import { IDatabaseService } from 'src/interfaces/database-service.interface';
import { Utils } from 'src/utils/utils';
import { XtreamService } from 'src/services/xtream-service';
import { ICategory } from 'src/interfaces/category.interface';
import { IChannel } from 'src/interfaces/channel.interface';
import { PlayerComponent } from '../player/player.component';

@Component({
    selector: 'live-tv',
    templateUrl: 'live-tv.component.html',
    styleUrls: ['live-tv.component.scss'],
})
export class LiveTvComponent {


    @ViewChild('player')
    public player?: PlayerComponent;
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

        if (!this.platform.is("mobileweb")) {
            this.databaseService = inject(DatabaseService)
        } else {
            this.databaseService = inject(DatabaseService)
        }
    }

    async ngAfterViewInit() {

        this.platform.ready().then(async () => {
            this.xtreamService.login({
                auth: {
                    username: 'Rafael982',
                    password: '51ciuavl8np'
                },
                baseUrl: 'http://play.stmlist.vip'
            })

            await this.databaseService.initializePlugin();
            this.listChannels();
        });
    }

    public clearChannels() {
        this.databaseService.clearChannels().then(() => {
            this.channels = [];
        });
    }

    public async onSearch() {
        console.log('onSearch');
        if (!this.search) {
            this.databaseService.getChannels();
            this.pagedChannels = Utils.paginateList(await this.databaseService.getChannels());
            //this.channels = this.pagedChannels[this.currentPage];
        }
        var channelsC = await this.databaseService.searchChannels(this.search);
        this.pagedChannels = Utils.paginateList(channelsC);
        //this.channels = this.pagedChannels[this.currentPage];
    }

    public async selectCategory(category: ICategory) {
        let result = await this.databaseService.getChannels(category.category_id);
        if (result?.length > 0) {
            this.channels = result;
            console.log('has channel')
        } else {
            this.xtreamService.getLiveStreams(category.category_id).subscribe((lives) => {
                this.channels = lives;
                this.databaseService.addChannels(lives)
            });
        }
    }

    public async listChannels(event?: any) {
        this.xtreamService.getLiveStreamCategory().subscribe((categories) => {
            this.categories = categories;
        });

        event && event.target.complete();

    }

    public currentChannel?: IChannel;
    public selectChannel(channel: IChannel) {
        this.player?.selectChannel(channel);

    }
    public seconds: number = 0;


    public load(seconds: number, channel: IChannel) {

    }

}

