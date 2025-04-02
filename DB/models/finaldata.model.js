import { model, Schema, Types } from 'mongoose';

const FinancialDataSchema = new Schema({
  companyid: {
    type: Types.ObjectId,
    ref: 'Company',
    required: true
  },
  FinReport_id:{
    type: Types.ObjectId,
    ref: 'finReport',
    required: true
  },
  createdby: {
    type: Types.ObjectId,
    ref: 'user',
    required: true
  },
  updatedby: {
    type: Types.ObjectId,
    ref: 'user',
    required: true
  },
  allclasses: [{
    classid: {
      type: Types.ObjectId,
      ref: 'class',
      required: true
    },
    subclassid: {
      type: Types.ObjectId,
      ref: 'subclass',
      default: null
    },
    subsubclassid: {
      type: Types.ObjectId,
      ref: 'subsubclass',
      default: null
    },
    accounts: [{
      accountid: {
        type: Types.ObjectId,
        ref: 'account',
        required: true
      },
      finaldata: [{
        subaccountid: {
          type: Types.ObjectId,
          ref: 'subaccount',
          default: null
        },
        amount: {
          type: Number,
        }
      }]
    }]
  }]
}, {timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}});

FinancialDataSchema.virtual('reports', {
  ref: 'finReport',
  localField: '_id',
  foreignField: 'companyid',
});

const FinancialDatamodel = model('FinancialData', FinancialDataSchema);

export { FinancialDatamodel };
