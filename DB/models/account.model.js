import {model, Schema, Types} from 'mongoose';

const accountSchema= new Schema({
    account:{
        type:String, 
        required:[true,'Account Name Is Required'],
        min:[3,'min length is 3'],
        max:[70, 'max length is 70'],
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
      subsubclassid:{
        type: Types.ObjectId,
        ref:'subsubclass',
        required:true
    },
    sectorid:{
                type: Types.ObjectId,
                ref:'sector',
                required:true
    },
}, {timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

accountSchema.virtual('subaccounts',{
    ref:'subaccount',
    localField:'_id',
    foreignField:'accountid'
})


const accountmodel= model('account', accountSchema)

export {accountmodel};