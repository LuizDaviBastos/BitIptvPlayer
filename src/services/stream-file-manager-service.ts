import { HttpClient, HttpEventType } from "@angular/common/http";
import { Channel } from "../model/channel";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";


@Injectable()
export class StreamFileManager {
    constructor(private http: HttpClient) { }

    public downloadFile(url: string) {
        return new Observable<Channel[]>((resolver) => {

            this.http.get(url, { responseType: 'blob' }).subscribe((data: Blob) => {
                //this.readBlobAsText(data);
            }, error => {
                console.error('Error downloading file:', error);
                // Handle error appropriately, e.g., show error message to user
            });
            return;

            this.http.get(url, { responseType: 'text' }).subscribe((m3u8Content: string) => {
                const channels = this.parseChannels(m3u8Content);
                resolver.next(channels);
            }, (err) => {
                resolver.error(err);
            });
        })
    }

    /*downloadAndReadFile(url: string): void {
        this.http.get(url, { responseType: 'blob' }).subscribe((data: Blob) => {
            this.readBlobAsText(data);
        }, error => {
            console.error('Error downloading file:', error);
            // Handle error appropriately, e.g., show error message to user
        });
    }

    readBlobAsText(blob: Blob): void {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            console.log('File content:', text);
            // You can now use 'text' variable containing the content of the file
        };
        reader.readAsText(blob);
    }
    */

    public downloadAndReadFile(url: string, updatePercent?: (percent: string) => void): Promise<string> {
        return new Promise((resolver) => {
            this.http.get(url, { responseType: 'blob', reportProgress: true, observe: 'events' }).subscribe(event => {
                if (event.type === HttpEventType.DownloadProgress) {
                    const percentDone = Math.round(100 * event.loaded / (event.total || 0));
                    if(event.total) updatePercent && updatePercent(`${percentDone}%`);
    
                } else if (event.type === HttpEventType.Response) {
                    const reader = new FileReader();
                    reader.onload = () => { resolver(reader.result as string); };
                    reader.readAsText(event.body as Blob);
                }
            }, error => {
                console.error('Error downloading file:', error);
            });
        });
    }

    public parseChannels(data: string): Channel[] {
        const lines = data.split('\n');
        const channels: Channel[] = [];

        let currentChannel: Channel | null = null;

        lines.forEach(line => {
            if (line.startsWith('#EXTINF:')) {
                if (currentChannel) {
                    channels.push(currentChannel);
                }
                currentChannel = new Channel();
                const matches = line.match(/tvg-id="([^"]+)".+tvg-name="([^"]+)".+tvg-logo="([^"]+)".+group-title="([^"]+)"/);
                if (matches && matches.length === 5) {
                    currentChannel.id = matches[1];
                    currentChannel.name = matches[2];
                    currentChannel.logo = matches[3];
                    currentChannel.groupName = matches[4];
                }
            } else if (line.startsWith('http')) {
                if (currentChannel) {
                    currentChannel.url = line;
                }
            }
        });

        if (currentChannel) {
            channels.push(currentChannel);
        }

        return channels;
    }

    public parseM3U8(m3u8Content: string): Channel[] {
        const channels: Channel[] = [];
        const linhas = m3u8Content.split('\n');

        let currentChannel: Channel | null = null;

        for (const linha of linhas) {
            const trimmedLine = linha.trim();

            if (trimmedLine.startsWith('#EXTINF:')) {
                // Extract channel information from EXTINF line
                const channelInfo = trimmedLine.split(',')[1].trim(); // Get channel info after EXTINF:-1
                const regex = /"(.*?)"/g; // Regular expression for capturing values between quotes
                let match: RegExpExecArray | null;

                // Extract tvg-id
                match = regex.exec(channelInfo);
                if (match) {
                    const tvgId = match[1];
                    currentChannel = {
                        tvgId,
                        name: '', // Initialize name for later extraction
                        url: '', // URL will be set later
                        groupName: '', // Group will be set later
                        logo: '' // Logo will be set later
                    };
                }

                // Extract tvg-name
                match = regex.exec(channelInfo);
                if (match) {
                    currentChannel!.name = match[1];
                }

                // Extract tvg-logo
                match = regex.exec(channelInfo);
                if (match) {
                    currentChannel!.logo = match[1];
                }

                // Extract group-title
                match = regex.exec(channelInfo);
                if (match) {
                    currentChannel!.groupName = match[1];
                }

                // Extract channel name (after group-title)
                const remainingInfo = regex.exec(channelInfo);
                if (remainingInfo) {
                    currentChannel!.name = remainingInfo[1];
                }
            } else if (trimmedLine) {
                // This line likely contains the channel URL
                if (currentChannel) {
                    currentChannel.url = trimmedLine;
                    channels.push(currentChannel);
                    currentChannel = null; // Reset currentChannel for next iteration
                }
            }
        }

        return channels;
    }
}