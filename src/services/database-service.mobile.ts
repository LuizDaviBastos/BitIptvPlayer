import { Injectable, WritableSignal, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Channel } from 'src/model/channel';
import { IDatabaseService } from '../interfaces/database-service.interface';
import { IChannel } from 'src/interfaces';


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
                if (!db.objectStoreNames.contains('channels')) {
                    let obj: IDBObjectStore = db.createObjectStore('channels', { keyPath: 'stream_id' });
                    obj.createIndex("category_id", "category_id");
                }
            };

            request.onsuccess = () => {
                console.log('IndexedDB inicializado com sucesso!');
            };

            request.onerror = (event) => {
                console.error('Erro ao inicializar IndexedDB:', event);
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

    public async getChannels(categoryId?: string) {
        try {
            return new Promise<any>((resolve, reject) => {
                const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onsuccess = (event: any) => {
                    const db: IDBDatabase = event.target.result;
                    const transaction: IDBTransaction = db.transaction('channels', 'readonly');
                    const store: IDBObjectStore = transaction.objectStore('channels');
                    let request: IDBRequest;

                    if (categoryId) {
                        const index = store.index('category_id');
                        request = index.getAll(categoryId);
                    } else {
                        request = store.getAll();
                    }

                    request.onsuccess = () => {
                        resolve(request.result);
                    };
                    request.onerror = (err) => {
                        console.error('Erro ao buscar canal:', err);
                        reject(err);
                    };
                };
            });
        } catch (e) {
            console.log(e);
        }
    }

    public async addChannel(channel: IChannel) {
        try {
            return new Promise<void>((resolve, reject) => {
                const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onsuccess = (event: any) => {
                    const db = event.target.result;
                    const transaction = db.transaction('channels', 'readwrite');
                    const store = transaction.objectStore('channels');

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
            for (let i = 0; i < channels.length; i++) {
                this.addChannel(channels[i]);
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
                    const transaction: IDBTransaction = db.transaction('channels', 'readonly');
                    const store: IDBObjectStore = transaction.objectStore('channels');

                    const countRequest: IDBRequest<number> = store.count();
                    countRequest.onsuccess = () => {
                        const count = countRequest.result;
                        resolve(count > 0); // Retorna true se existirem registros
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
