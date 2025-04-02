import mongoose from "mongoose";

const connectDB = async ()=>{
    return await mongoose.connect(mongodb+srv://areejosama33:bYJ69KEE3vbvGLuy@cluster0.x4srn.mongodb.net/<deepmetrics>?retryWrites=true&w=majority)
    .then(res=>{
        console.log('connected')
    }).catch(err=>{
        console.log(`FAILED to connect to db ${err}`)
    })
};
export default connectDB;
