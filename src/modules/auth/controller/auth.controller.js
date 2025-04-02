import {usermodel} from '../../../../DB/models/user.model.js';
import jwt from 'jsonwebtoken';
import hash from 'bcryptjs';


export const signup= async(req,res,next)=>{
  
    const {name, email, password}= req.body;
    
    const user = await usermodel.findOne({email})
    if(user){
        return next(new Error ("This User Is Already Have an Account",{cause:409}))
    }else{
      const hashpass = hash.hashSync(password, parseInt(process.env.saltround))
      const newuser= new usermodel({name, email, password:hashpass})
      if(newuser){
       const saveuser= await newuser.save();
       return res.status(200).json({message:'Success',saveuser})
      }else{
        return next(new Error("Rejected Email", {cause:400}))
      }
    
    }
}

export const signin=async (req,res,next)=>{
    const {email, password}=req.body;
    const user= await usermodel.findOne({email})
    if(!user){
        return next(new Error('You Do not Have An Account, Please Signup', {cause:400}))
    }else{
                const match= await hash.compare(password, user.password)
                if(!match){
                    return next(new Error('Incorrect Password',{cause:400}))
                }else{
                    const token=  jwt.sign({id:user._id, role:user.role}, process.env.secretkey)
                    return res.status(200).json({message:'Success',token})
                }
     }
}

export const forgetpassword= async(req,res,next)=>{
            const {email, code, newpassword}=req.body;
                const hashpass= hash.hashSync(newpassword, parseInt(process.env.saltround))
                const updateuser= await usermodel.findOneAndUpdate({email}, {password:hashpass}, {new:true})
                 res.status(200).json({message:'Success',updateuser})
}

        
