import {model, Schema, Types} from 'mongoose';

const Sectorschema= new Schema({
    Sector:{
        type:String,
        required:[true, 'Sector Is Required'],
        min:[3, 'min length is 3'],
        max:[70, 'max length is 70'],
        unique: true 
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
},{timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

Sectorschema.virtual('companies', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'sectorid',
  });

const sectormodel= model ('sector', Sectorschema)

export {sectormodel}