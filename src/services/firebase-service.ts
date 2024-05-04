import { Injectable } from "@angular/core";
import { initializeApp } from "firebase";
import { environment } from "../environments/environment";
import * as firebase from "firebase";
import { Model } from "../interfaces/model.interface";
import { Conta } from "../model/Conta.model";

@Injectable()
export class FireBaseService<TModel extends Model<TModel>> {
    private app: firebase.app.App;
    private db?: firebase.database.Database;
    private collection?: firebase.firestore.CollectionReference;
    public list: TModel[] = [];
    private model?: TModel;
    public path: string = 'contas/';
    public edit: boolean = false;
    public id?: string;
    public title: string = 'Contas';
    public getModel(): TModel | undefined {
        if (this.edit) {
            return this.list.find(x => x.id == this.id);
        }
        else {
            return this.model;
        }
    }

    public async configure(instantiate: () => TModel, path: string = '') {
        this.db = this.app.database(environment.FIREBASE_CONFIG.databaseURL);
        (this.getRef()).orderByChild('nome').on('value', (r) => this.setList(r));

        this.model = instantiate();
        if (path != '') {
            this.path = path.includes('/') ? path : `${path}/`;
        }
    }

    constructor() {
        this.app = initializeApp(environment.FIREBASE_CONFIG);
    }

    private setList(snapshopt: any) {
        this.list = this.model!.parse(snapshopt);
    }

    private getRef(path: string = '') {
        return this.db!.ref((path != '' ? path : this.path));
    }

    public addItem(item: any) {
        let collection = (this.getRef()).push();
        collection.set(item);
    }

    public delete(id: any) {
        this.list = [];
        (this.getRef(`${this.path}${id}`)).remove().then(() => console.log('success')).catch((e) => console.log(e));
    }

    public refreshList(event: any) {
        this.list = [];
        (this.getRef()).off('value');
        (this.getRef()).orderByChild('nome').on('value', resp => {
            this.list = this.model!.parse(resp);
            event.target.complete();
        });
    }
    public async search(chield: string, text: string) {
        (this.getRef(this.path)).orderByChild(chield).startAt(text.toUpperCase()).on('value', (r) => this.setList(r));
    }
}

export class Factory {

}
