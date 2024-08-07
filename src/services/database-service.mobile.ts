import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';
import { Channel } from 'src/model/channel';
import { IDatabaseService } from '../interfaces/database-service.interface';


@Injectable({
    providedIn: 'root'
})
export class DatabaseService implements IDatabaseService {
    private DB_USER = 'BitPlayerFb'
    private TABLE = 'channels'
    private sqlLite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    private db!: SQLiteDBConnection;
    private channel: WritableSignal<Channel[]> = signal<Channel[]>([]);

    constructor(private platform: Platform) {

    }
    public async clearChannels(): Promise<void> {
        
    }

    public async searchChannels(term: string): Promise<Channel[]> {
        return [];
    }

    public async initializePlugin() {
        try {
            const schema = `CREATE TABLE IF NOT EXISTS ${this.TABLE} (id INTEGER PRIMARY KEY, name TEXT NULL, url TEXT NULL, groupName TEXT NULL, logo TEXT NULL, tvgId TEXT NULL)`;
            this.db = await this.sqlLite.createConnection(this.DB_USER, false, 'no-encryption', 1, false)
            await this.db.open();
            await this.db.execute(schema);
            this.loadChannels()
            return true;
        }
        catch(e) {
            console.log(e)
            return false;
        }
    }

    public async loadChannels() {
        try {
            const channels = await this.db.query(`SELECT * FROM ${this.TABLE};`);
            console.log('channels: ', channels);
            this.channel.set(channels.values || []);
        } catch(e) {
            console.log(e);
        }
    }

    public async addChannel(channel: Channel) {
        try {
            const query = `INSERT INTO ${this.TABLE}(name, url, groupName, logo, tvgId) VALUES ('${channel.name}', '${channel.url}', '${channel.groupName}', '${channel.logo}', '${channel.tvgId}');`;
            const result = await this.db.query(query);
            this.loadChannels();
        }
        catch(e) {
            console.log(e);
        }
    }

    public async addChannels(channels: Channel[]) {
        try {
            let query = ``;
            for (let i = 0; i < channels.length; i++) {
                query += `INSERT INTO ${this.TABLE} (name, url, groupName, logo, tvgId) VALUES ('${channels[i].name}', '${channels[i].url}', '${channels[i].groupName}', '${channels[i].logo}', '${channels[i].tvgId}'); \n`
            }
            console.log('query: ', query);
            const result = await this.db.query(query);
            this.loadChannels();
        }
        catch(e) {
            console.log(e);
        }
    }

    public getChannels() {
        return this.channel();
    }

    public async hasChannels() {
        try {
            console.log('hasChannels');
            const response = await this.db.query(`SELECT COUNT(*) FROM ${this.TABLE}`)
            const has = response.values![0] > 0
            return has;
        }
        catch(e) {
            console.log(e);
            return false;
        }
    }

}
