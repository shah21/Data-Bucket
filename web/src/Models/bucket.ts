export default class Bucket{
    _id:string;
    name:string;
    ownedBy:string;
    createdAt:number;
    access:[string];

    constructor(
        _id:string,
        name:string,
        ownedBy:string,
        createdAt:number,
        access:[string]
        ){
            this._id = _id;
            this.name = name;
            this.ownedBy = ownedBy;
            this.createdAt = createdAt;
            this.access = access;
        } 
}        