import {model, Schema, Types} from 'mongoose';

const finReportSchema= new Schema({
    companyid:{
        type: Types.ObjectId,
        ref:'Company',
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
     reportYear:{
         type: String,
        required: true 
    },
    status: {
        type: String, 
        enum : [ "Draft", "Published"],
        default: "Draft"
    },
    period: { type: String, enum: ["Q1", "H1", "9M", "YTD"], required: true },
    finaldataid:{
        type: Types.ObjectId,
        ref:'FinancialData',
     }
},  {timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}});

finReportSchema.virtual('repos', {
        ref: 'FinancialData',
        localField: '_id',
        foreignField: 'companyid',
      });

const finReportmodel= model('finReport', finReportSchema)

export {finReportmodel};