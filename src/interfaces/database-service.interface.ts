import { Channel } from "src/model/channel";
import { IChannel } from "./channel.interface";
import { Observable } from "rxjs";

export interface IDatabaseService {
    initializePlugin(): Promise<boolean>;
    getChannels(categoryId?: string): Observable<IChannel | undefined>;
    getChannelCount(categoryId?: string): Promise<number>;
    addChannel(channel: IChannel): Promise<void>;
    addChannels(channels: IChannel[]): Promise<void>;
    hasChannels(): Promise<boolean>;
    searchChannels(term: string): Promise<IChannel[]>;
    clearChannels(): Promise<void>;
    deleteObject(name: string) : Promise<void>;
}