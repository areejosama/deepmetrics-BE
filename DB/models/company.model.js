import {model, Schema, Types} from 'mongoose';

const companySchema= new Schema({
    name:{
        type:String, 
        required:[true,'company name is required'],
        min:[3,'min length is 3'],
        max:[20, 'max length is 20'],
        unique:[true, 'company name already exist']
    },
    sectorid:{
        type: Types.ObjectId,
        ref:'sector',
        required:true
    },
    createdby:{
       type: Types.ObjectId,
       ref:'user',
    },
    updatedby:{
        type: Types.ObjectId,
        ref:'user',
     }, 
    image:String,
    imagepublicid:String,
    country:String, 
    currency:{
        type:String,
        default:'USD'
    }
},  {timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

companySchema.virtual('sectors',{
    ref:'sector',
    localField:'_id',
    foreignField:'companyid'
})

const companymodel= model('Company', companySchema)

export {companymodel};