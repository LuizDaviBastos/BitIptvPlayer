import { Injectable } from '@angular/core';
import { ICategory, IChannel } from 'src/interfaces';
import { DatabaseService, ISCHEMA } from './database-service.mobile';
import { XtreamService } from './xtream-service';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {
    private SCHEMA!: ISCHEMA;

    constructor(private databaseService: DatabaseService, private xtreamService: XtreamService) {
        this.SCHEMA = databaseService.SCHEMA;
    }

    public login(userName?: string, password?: string) {
        this.xtreamService.login({
            auth: {
                username: userName || 'timelord13',
                password: password || 'c8ghezompkr'
            },
            baseUrl: 'http://play.stmlist.vip'
        });
        console.log(this.xtreamService.config);
        return this.databaseService.initializePlugin();
    }

    public async hasLIVEChannels() {
        const count = await this.databaseService.getCount(this.SCHEMA.LIVECATEGORIES.NAME);
        return count > 0;
    }

    public downloadLIVEChannels() {
        return new Observable<number>((subscriber) => {
            this.databaseService.clearObject(this.SCHEMA.LIVECHANNELS.NAME).then(async () => {
                this.xtreamService.getLiveStreamCategory().subscribe(async (categories) => {
                    const length = categories.length;
                    const sourceChannels = await lastValueFrom(this.xtreamService.getAllLiveStreams());
                    const promises = [];
                    for (let categoryIndex = 0; categoryIndex < length; categoryIndex++) {
                        promises.push(new Promise<any>(async (resolver, reject) => {
                            const category: ICategory = categories[categoryIndex];
                            const channels = sourceChannels.filter(x => x.category_id == category.category_id);
                            category.channelCount = channels.length;
                            await this.addCategory(category);
                            await this.addChannels(channels);
                            subscriber.next(Math.floor(((categoryIndex + 1) * 100) / length));
                            resolver(null);
                        }))
                    }
                    await Promise.all(promises);
                    subscriber.complete();
                })
            });
        });
    }

    public downloadVODChannels() {
        return new Observable((subscriber) => {

        });
    }

    public downloadSERIEChannels() {
        return new Observable((subscriber) => {

        });
    }

    public getLIVEChannels(categoryId?: string) {
        return this.databaseService.openCursor<IChannel>(this.SCHEMA.LIVECHANNELS.NAME, this.SCHEMA.LIVECHANNELS.INDEX, categoryId);
    }

    public getLIVECategories() {
        return this.databaseService.openCursor<ICategory>(this.SCHEMA.LIVECATEGORIES.NAME);
    }

    public async addCategory(category: ICategory) {
        await this.databaseService.add(this.SCHEMA.LIVECATEGORIES.NAME, category);
    }

    public async addChannel(channel: IChannel) {
        await this.databaseService.add(this.SCHEMA.LIVECHANNELS.NAME, channel);
    }

    public async addChannels(channels: IChannel[]) {
        const promises: Promise<any>[] = []
        for (let channel of channels) {
            promises.push(this.addChannel(channel));
        }
        await Promise.all(promises);
    }

    public async hasChannels() {
        return (await this.databaseService.getCount(this.SCHEMA.LIVECHANNELS.NAME)) > 0
    }

    public async clearChannels(): Promise<void> {

    }

    public async searchChannels(term: string): Promise<IChannel[]> {
        return [];
    }

}
