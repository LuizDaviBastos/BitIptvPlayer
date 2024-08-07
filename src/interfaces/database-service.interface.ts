import { Channel } from "src/model/channel";

export interface IDatabaseService {
    initializePlugin(): Promise<boolean>;
    loadChannels(): Promise<void>;
    addChannel(channel: Channel): Promise<void>;
    addChannels(channels: Channel[]): Promise<void>;
    getChannels(): Channel[];
    hasChannels(): Promise<boolean>;
    searchChannels(term: string): Promise<Channel[]>;
    clearChannels(): Promise<void>;
}