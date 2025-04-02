import {model, Schema, Types} from 'mongoose';

const classSchema= new Schema({
    name: {
        type: String, 
        required: true,
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

}, {timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

classSchema.virtual('subclasses',{
    ref:'subclass',
    localField:'_id',
    foreignField:'classid'
})


const classmodel= model('class', classSchema)

export {classmodel};