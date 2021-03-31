declare module "*.png" {
    const value: any;
    export default value;
  }


  declare module "*.svg" {
    const value: any;
    export default value;
  }


  interface ListTypes  {
    handleOptions:(type:string,id:string)=>void,
    dataId:string,
    classes:Record<string,string>
  }


 type ErrorType = {msg:string,field:string}