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
import { ChannelService } from 'src/services/channel-service';

@Component({
    selector: 'live-tv',
    templateUrl: 'live-tv.component.html',
    styleUrls: ['live-tv.component.scss'],
})
export class LiveTvComponent {

    @ViewChild('player')
    public player?: PlayerComponent;
    public channels: IChannel[] = [];
    public pagedChannels: Channel[][] = Utils.paginateList<Channel[]>([]);
    public currentPage: number = 0;
    public search: string = '';
    public categories: ICategory[] = [];

    constructor(public fb: FireBaseService<Conta>, private route: Router, public alertController: AlertController, private platform: Platform,
        private streamFileManager: StreamFileManager, private xtreamService: XtreamService, private channelService: ChannelService) {
        fb.configure(() => new Conta());

        this.platform.backButton.subscribeWithPriority(10, () => {
            //this.route.navigate(['tabs/tab1']);
        });


    }

    async ngAfterViewInit() {
        this.platform.ready().then(async () => {
            this.listCategories();
        });
    }

    public clearChannels() {
        this.channelService.clearChannels().then(() => {
            this.channels = [];
        });
    }

    public async onSearch() {
        console.log('onSearch');

        var channelsC = await this.channelService.searchChannels(this.search);
        this.pagedChannels = Utils.paginateList(channelsC);
        //this.channels = this.pagedChannels[this.currentPage];
    }

    public async selectCategory(category: ICategory) {
        this.channels = [];
        this.channelService.getLIVEChannels(category.category_id).subscribe((channel) => {
            channel && this.channels.push(channel);
        }, console.error, () => {

        });
    }

    public async listCategories(event?: any) {
        console.log('listCategories');
        this.categories = [];
        this.channelService.getLIVECategories().subscribe((category) => {
            this.categories.push(category);
        }, console.error, ()=> this.selectCategory(this.categories[0]));
    }

    public currentChannel?: IChannel;
    public selectChannel(channel: IChannel) {
        this.player?.selectChannel(channel);

    }
}

