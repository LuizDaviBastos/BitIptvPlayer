import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ITABLE {
    PK: string,
    NAME: string,
    INDEX?: string
}

export interface ISCHEMA {
    LIVECHANNELS: ITABLE,
    LIVECATEGORIES: ITABLE,
    [index: string]: ITABLE
}

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    public SCHEMA: ISCHEMA = {
        LIVECHANNELS: <ITABLE>{
            PK: 'stream_id',
            NAME: 'live_channels',
            INDEX: 'category_id'
        },
        LIVECATEGORIES: <ITABLE>{
            PK: 'category_id',
            NAME: 'live_categories',
            INDEX: 'parent_id'
        },
    }
    private DB_NAME = 'BitPlayerDB';
    private DB_VERSION = 1;

    constructor() { }

    public async initializePlugin() {
        try {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = (event: any) => {
                const db: IDBDatabase = event.target.result;
                for (let prop in this.SCHEMA) {
                    const table: ITABLE = this.SCHEMA[prop];
                    if (!db.objectStoreNames.contains(table.NAME)) {
                        const objStore: IDBObjectStore = db.createObjectStore(table.NAME, { keyPath: table.PK });
                        if (table.INDEX) {
                            objStore.createIndex(table.INDEX, table.INDEX);
                        }
                    }
                }
            };
            request.onsuccess = () => { console.log('IndexedDB has been initialized!'); };
            request.onerror = (event) => { console.error('Error to initialize IndexedDB:', event); };
            return true;
        }
        catch (e) {
            console.log(e)
            return false;
        }
    }

    public async getObjectStore(name: string, indexName?: string, transactionMode: IDBTransactionMode = 'readwrite'): Promise<IDBObjectStore | IDBIndex> {
        return new Promise<IDBObjectStore | IDBIndex>((resolver, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onsuccess = (event: any) => {
                const db: IDBDatabase = event.target.result;
                const transaction: IDBTransaction = db.transaction(name, transactionMode);
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

    public openCursor<T>(tableName: string, index?: string, indexValue?: string) {
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


    public async clearObject(name: string): Promise<void> {
        return new Promise(async (resolver) => {
            const store = <IDBObjectStore>(await this.getObjectStore(name));
            const req = store.clear();
            req.onsuccess = () => resolver();
            req.onerror = () => resolver();
        });
    }

    public async deleteObject(name: string): Promise<void> {
        return new Promise((resolver) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.addEventListener('success', (event: any) => {
                try {
                    const db: IDBDatabase = event.target.result;
                    db.deleteObjectStore(name);
                    resolver();
                } catch {
                    resolver();
                }
            });
        })
    }

    public async getCount(tableName: string, indexName?: string, categoryId?: string) {
        const store = await this.getObjectStore(tableName, indexName, 'readonly');
        return new Promise<number>((resolver, reject) => {
            const request = store.count(categoryId);
            request.onsuccess = () => { resolver(request.result) };
        })
    }

    public async add<T>(tableName: string, object: T) {
        return new Promise<void>((resolve, reject) => {
            this.getObjectStore(tableName).then((store) => {
                const addRequest = (store as IDBObjectStore).add(object);
                addRequest.onsuccess = () => { resolve(); };
                addRequest.onerror = (err: any) => {
                    console.error('Error to add:', err);
                    reject(err);
                };
            });
        });
    }
}
