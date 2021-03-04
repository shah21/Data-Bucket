export default class Data{
    _id:string;
    data:string;
    file:string;
    addedAt:number;
    addedBy:string;
    addedTo:string;
    deviceName:string;
    accessGroup:Array<string>
    constructor(id:string,data:string,file:string,addedAt:number,addedTo:string,addedBy:string,accessGroup:[string],deviceName:string){
        this._id = id;
        this.data = data;
        this.file = file;
        this.deviceName = deviceName;
        this.addedAt = addedAt;
        this.addedBy = addedBy;
        this.addedTo = addedTo;
        this.accessGroup = accessGroup;
    }

}    