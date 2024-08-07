export class Utils {
    public static paginateList<T>(list: any[], pageSize: number = 20): any[][] {
        let paginatedList: T[][] = [];
        for (let i = 0; i < list.length; i += pageSize) {
            paginatedList.push(list.slice(i, i + pageSize));
        }
        return paginatedList;
    }
}