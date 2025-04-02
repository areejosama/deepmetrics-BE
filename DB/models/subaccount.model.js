import {model, Schema, Types} from 'mongoose';

const subaccountSchema= new Schema({
    subaccount:{
        type:String, 
        required:[true,'Sub Account Name Is Required'],
        min:[3,'min length is 3'],
        max:[40, 'max length is 40'],
        unique:[true, 'Sub Account Name already exist']
    },
    createdby:{
       type: Types.ObjectId,
       ref:'user',
       required:true
    },
    updatedby:{
        type: Types.ObjectId,
        ref:'user',
        required:true
     },   
      accountid:{
        type: Types.ObjectId,
        ref:'account',
    },
}, {timestamps:true});

const subaccountmodel= model('subaccount', subaccountSchema)

export {subaccountmodel};