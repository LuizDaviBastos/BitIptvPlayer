export abstract class Model<TModel> {
     public id?: string;
     public abstract parse(snapshot: firebase.database.DataSnapshot): TModel[];
}
