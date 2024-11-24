import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IDatabaseService } from '../interfaces/database-service.interface';
import { IChannel } from 'src/interfaces';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DatabaseService implements IDatabaseService {
    private DB_USER = 'BitPlayerFb'
    private TABLE = 'channels'
    private DB_NAME = 'BitPlayerDB';
    private DB_VERSION = 1;

    constructor(private platform: Platform) {

    }


    private async getObjectStore(name: string, indexName?: string): Promise<IDBObjectStore | IDBIndex> {
        return new Promise<IDBObjectStore | IDBIndex>((resolver, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onsuccess = (event: any) => {
                const db: IDBDatabase = event.target.result;
                const transaction: IDBTransaction = db.transaction(name, 'readonly');
                const store: IDBObjectStore = transaction.objectStore(name);

                if (indexName) {
                    resolver(store.index(indexName))
                } else {
                    resolver(store)
                }

                resolver(store);
            };

            request.onerror = reject;
        });
    }

    private openCursor<T>(tableName: string, index?: string, indexValue?: string) {
        return new Observable<T>((subscriber) => {
            this.getObjectStore(tableName, index).then((store) => {
                const cursorRequest = store.openCursor(indexValue);
                cursorRequest.onsuccess = (event: any) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        subscriber.next(<T>cursor.value);
                        cursor.continue();
                    } else {
                        subscriber.complete();
                    }
                };
                cursorRequest.onerror = error => subscriber.error(error);
            })
        });
    }

    public async clearChannels(): Promise<void> {

    }

    public async searchChannels(term: string): Promise<IChannel[]> {
        return [];
    }

    public async initializePlugin() {
        try {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = (event: any) => {
                console.log('onupgradeneeded')
                const db: IDBDatabase = event.target.result;
                if (!db.objectStoreNames.contains(this.TABLE)) {
                    const objStore: IDBObjectStore = db.createObjectStore('channels', { keyPath: 'stream_id' });
                    objStore.createIndex("category_id", "category_id");
                }
            };

            request.onsuccess = () => {
                console.log('IndexedDB has been initialized!');
            };

            request.onerror = (event) => {
                console.error('Error to initialize IndexedDB:', event);
            };
            return true;
        }
        catch (e) {
            console.log(e)
            return false;
        }
    }

    public async deleteObject(name: string): Promise<void> {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
        request.addEventListener('success', (event: any) => {
            const db: IDBDatabase = event.target.result;
            db.deleteObjectStore(name);
        });
    }

    public getChannels(categoryId?: string) {
        return this.openCursor<IChannel>(this.TABLE, 'category_id', categoryId);
    }

    public async addChannel(channel: IChannel) {
        try {
            return new Promise<void>((resolve, reject) => {
                const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onsuccess = (event: any) => {
                    const db = event.target.result;
                    const transaction = db.transaction(this.TABLE, 'readwrite');
                    const store = transaction.objectStore(this.TABLE);

                    const addRequest = store.add(channel);
                    addRequest.onsuccess = () => {
                        console.log('Canal adicionado:', channel);
                        resolve();
                    };
                    addRequest.onerror = (err: any) => {
                        console.error('Erro ao adicionar canal:', err);
                        reject(err);
                    };
                };
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    public async addChannels(channels: IChannel[]) {
        try {
            for (let channel of channels) {
                this.addChannel(channel);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public async hasChannels() {
        try {
            return new Promise<boolean>((resolve, reject) => {
                const request: IDBOpenDBRequest = indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onsuccess = (event: Event) => {
                    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
                    const transaction: IDBTransaction = db.transaction(this.TABLE, 'readonly');
                    const store: IDBObjectStore = transaction.objectStore(this.TABLE);

                    const countRequest: IDBRequest<number> = store.count();
                    countRequest.onsuccess = () => {
                        const count = countRequest.result;
                        resolve(count > 0);
                    };

                    countRequest.onerror = (err: Event) => {
                        console.error('Erro ao contar registros:', err);
                        reject(err);
                    };
                };

                request.onerror = (err: Event) => {
                    console.error('Erro ao abrir o banco de dados:', err);
                    reject(err);
                };
            });
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}
