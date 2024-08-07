import { Injectable, WritableSignal, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Channel } from 'src/model/channel';
import { IDatabaseService } from '../interfaces/database-service.interface';
import { Storage } from '@ionic/storage-angular';
import { Utils } from 'src/utils/utils';

@Injectable({
    providedIn: 'root'
})
export class DatabaseServiceWeb implements IDatabaseService {
    private channel: WritableSignal<Channel[]> = signal<Channel[]>([]);
    private tableName: string = 'channels'

    constructor(private platform: Platform, private storage: Storage) {

    }

    public async initializePlugin() {
        try {
            await this.storage.create();
            return true;
        }
        catch (e) {
            console.log(e)
            return false;
        }
    }

    public async loadChannels() {
        try {
            const channels: Channel[] = [];
            for(let key of (await this.storage.keys()).filter(x => x.includes(this.tableName))) {
                channels.push(<Channel>(await this.storage.get(key)));
            }

            this.channel.set(channels);
        } catch (e) {
            console.log(e);
        }
    }

    public async searchChannels(term: string) {
        try {
            const channels: Channel[] = [];
            for(let key of (await this.storage.keys()).filter(x => x.includes(this.tableName) && x.toLocaleLowerCase().includes(term.toLocaleLowerCase()))) {
                channels.push(<Channel>(await this.storage.get(key)));
            }
            return channels;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    public async addChannel(channel: Channel) {
        try {
            this.storage.set(`${this.tableName}:${channel.name}`, channel);
        }
        catch (e) {
            console.log(e);
        }
    }

    public async addChannels(channels: Channel[]) {
        try {
            var pagedChannels = Utils.paginateList(channels, 100);
            const promises = [];
            for(let channels of pagedChannels) {
                let currentPromise = new Promise((resolve) => {
                    for(let channel of channels) {
                        this.addChannel(channel);
                    }
                    resolve(`${channels.length} channels added`);
                    console.log(`${channels.length} channels added`);
                });
                promises.push(currentPromise);
            }
            await Promise.all(promises);
        }
        catch (e) {
            console.log(e);
        }
    }

    public getChannels() {
        return this.channel();
    }

    public async hasChannels() {
        try {
            const keys = await this.storage.keys();
            return !!(keys).find(x => x.includes(this.tableName));;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public async clearChannels() {
        await this.storage.clear()
    }

}
