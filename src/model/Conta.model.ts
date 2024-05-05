import { Model } from "../interfaces/model.interface";

export class Conta extends Model<Conta>{
    public parse(snapshot: firebase.database.DataSnapshot): Conta[]{
        let contas: Conta[] = [];
        snapshot.forEach(element => {
            const item = element.val();
            contas.push(<Conta>{
                id: element.key,
                nome: item?.nome,
                descricao: item?.descricao,
                email: item?.email,
                senha: item?.senha,
                codigo_recuperacao: item?.codigo_recuperacao,
            })
        })
        return contas;
    }

    public nome?: string;
    public descricao?: string;
    public email?: string;
    public senha?: string;
    public codigo_recuperacao?: string;
}