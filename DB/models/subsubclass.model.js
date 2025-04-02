import {model, Schema, Types} from 'mongoose';

const subsubclassSchema= new Schema({
    subsubclass:{
        type:String, 
        required:[true,'Sub Sub Class Name Is Required'],
        min:[3,'min length is 3'],
        max:[40, 'max length is 40'],
        unique:[true, 'Sub Sub Class Name already exist']
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
    subclassid:{
        type: Types.ObjectId,
        ref:'subclass',
    },
}, {timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

subsubclassSchema.virtual('accounts',{
    ref:'account',
    localField:'_id',
    foreignField:'subsubclassid'
})

const subsubclassmodel= model('subsubclass', subsubclassSchema)

export {subsubclassmodel};