import {model, Schema, Types} from 'mongoose';

const catSchema= new Schema({
    sectorid:{
        type: Types.ObjectId,
        ref:'sector',
        required:true
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
    categories:{
        class:{
            type:String, 
            required:[true,'Main Class Is Required'],
            min:[3,'min length is 3'],
            max:[20, 'max length is 20'],
            unique:[true, 'Main Class already exist']
        },
        subclass:{
            type:String, 
            required:[true,'Sub Class Is Required'],
            min:[3,'min length is 3'],
            max:[20, 'max length is 20'],
            unique:[true, 'Sub Class already exist']
        },
        subsubclass:{
            type:String, 
            required:[true,'Sub Sub Class Is Required'],
            min:[3,'min length is 3'],
            max:[20, 'max length is 20'],
            unique:[true, 'Sub Sub Class already exist']
        },
        account:{
            type:String, 
            required:[true,'Account Name Is Required'],
            min:[3,'min length is 3'],
            max:[20, 'max length is 20'],
            unique:[true, 'Account Name already exist']
        },
        subaccount:{
            type:String, 
            required:[true,'Sub Account Name Is Required'],
            min:[3,'min length is 3'],
            max:[20, 'max length is 20'],
            unique:[true, 'Sub Account Name already exist']
        },
    }

}, {timestamps:true});

const catmodel= model('cat', catSchema)

export {catmodel};