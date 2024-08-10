
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import queryString from 'query-string';
import { IVodInfo, ICategory, IChannel, IAuthInfo } from 'src/interfaces';

interface Config {
    auth: {
        username: string;
        password: string;
    }
    baseUrl: string;
}

@Injectable()
export class XtreamService {
    /**
     * @param {{ baseUrl: string, auth: { username: string, password: string } }} [config]
     */

    private config!: Config;
    constructor(private httpClient: HttpClient) {

    }

    public login(config: Config) {
        this.config = config;
    }


    /**
     * execute query on xtream server
     *
     * @param {string} [action]
     * @param {{ [ key: string ]: string }} [filter]
     * @returns {Promise<any>}
     */
    private execute<T>(action: string = '', filter: any = {}) {
        const query = { ...this.config.auth, action, ...filter };
        //const query = pickBy({ ...this.config.auth, action, ...filter })
        return this.httpClient.get<T>(`${this.config.baseUrl}/player_api.php?${queryString.stringify(query)}`);
    }

    public getAccountInfo() {
        return this.execute<IAuthInfo>().subscribe((response) => {
            if (response.user_info.auth === 0) {
                return Promise.reject(new Error('authentication error'))
            }
            return response.user_info
        });
    }

    public getLiveStreamCategory() {
        return this.execute<ICategory[]>('get_live_categories')
    }

    public getVODStreamCategories() {
        return this.execute<ICategory[]>('get_vod_categories')
    }

    public getSeriesCategories() {
        return this.execute<ICategory[]>('get_series_categories')
    }

    /**
     * @param {string} [categoryId]
     */
    public getLiveStreams(categoryId: string) {
        return this.execute<IChannel[]>('get_live_streams', { category_id: categoryId })
    }

    /**
     * @param {string} [categoryId]
     */
    public getVODStreams(categoryId: string) {
        return this.execute<IChannel[]>('get_vod_streams', { category_id: categoryId })
    }

    /**
    * @param {string} [categoryId]
    */
    public getSeries(categoryId: string) {
        return this.execute<IChannel[]>('get_series', { category_id: categoryId })
    }


    /**
     * GET VOD Info
     *
     * @param {number} id This will get info such as video codecs, duration, description, directors for 1 VOD
     */
    public getVODInfo(id: number) {
        if (!id) {
            return Promise.reject(new Error('Vod Id not defined'))
        }

        return new Promise((resolver, reject) => {
            this.execute<IVodInfo>('get_vod_info', { vod_id: id }).subscribe((T) => {
                if ((<any>T.info)?.length == 0) {
                    reject(new Error(`vod with id: ${id} not found`))
                }
                resolver(T);
            });
        })
    }

    /**
     * GET short_epg for LIVE Streams (same as stalker portal, prints the next X EPG that will play soon)
     *
     * @param {number} id
     * @param {number} limit You can specify a limit too, without limit the default is 4 epg listings
     */
    public getEPGLivetreams(id: number, limit: number) {
        return this.execute('get_short_epg', { stream_id: id, limit })
    }

    /**
     * GET ALL EPG for LIVE Streams (same as stalker portal, but it will print all epg listings regardless of the day)
     *
     * @param {number} id
     */
    public getAllEPGLiveStreams(id: number) {
        return this.execute('get_simple_data_table', { stream_id: id })
    }

    public getChannelUrl(channel: IChannel) {
        //m3u8
        const ext = channel.stream_type != 'live' ? 'mp4' : 'm3u8';
        return `${this.config.baseUrl}/${channel.stream_type}/${this.config.auth.username}/${this.config.auth.password}/${channel.stream_id}.${ext}`;
    }


    public getLineInformation() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const body = new HttpParams({
            fromObject: {
                "username": "Robson1374",
                "password": "ch3av1jnzme"
            }
        });
        return this.httpClient.post('http://127.0.0.1:80/api.php?action=user&sub=info', body.toString(), { headers })
    }
}