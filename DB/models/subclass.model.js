import {model, Schema, Types} from 'mongoose';

const subclassSchema= new Schema({
    subclass:{
        type:String, 
        required:[true,'Sub Class Name Is Required'],
        min:[3,'min length is 3'],
        max:[40, 'max length is 40'],
        unique:[true, 'Sub Class Name already exist']
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
     classid:{
        type: Types.ObjectId,
        ref:'class',
        required:true
    },
}, {timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

subclassSchema.virtual('subsubclasses',{
    ref:'subsubclass',
    localField:'_id',
    foreignField:'subclassid'
})



const subclassmodel= model('subclass', subclassSchema)

export {subclassmodel};