import isAuth from "../src/middlewares/is-auth";
import { Request,Response,NextFunction } from "express";
import { expect } from "chai";


it('check validation of authorization header is working or not',()=>{
    const req = {
        get:()=>null!,
    };
    const res:Response = null!;
    isAuth(req,res,()=>{});
    expect(isAuth.bind(this,req,res,()=>{})).to
    .throw(
        'Not authenticated'
    )
});
