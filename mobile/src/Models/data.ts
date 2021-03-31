export default class Data{
    _id:string;
    data:string;
    file_path:string;
    addedAt:number;
    addedBy:string;
    addedTo:string;
    deviceName:string;
    accessGroup:Array<string>
    constructor(id:string,data:string,file_path:string,addedAt:number,addedTo:string,addedBy:string,accessGroup:[string],deviceName:string){
        this._id = id;
        this.data = data;
        this.file_path = file_path;
        this.deviceName = deviceName;
        this.addedAt = addedAt;
        this.addedBy = addedBy;
        this.addedTo = addedTo;
        this.accessGroup = accessGroup;
    }

}    