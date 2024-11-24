import { Channel } from "src/model/channel";
import { IChannel } from "./channel.interface";

export interface IDatabaseService {
    initializePlugin(): Promise<boolean>;
    getChannels(categoryId?: string): Promise<IChannel[]>;
    addChannel(channel: IChannel): Promise<void>;
    addChannels(channels: IChannel[]): Promise<void>;
    hasChannels(): Promise<boolean>;
    searchChannels(term: string): Promise<IChannel[]>;
    clearChannels(): Promise<void>;
    deleteObject(name: string) : Promise<void>;
}