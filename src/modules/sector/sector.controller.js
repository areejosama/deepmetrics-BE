import {sectormodel} from '../../../DB/models/sector.model.js';
import { pagination } from '../../services/Pagination.js';

export const createsector=async(req,res,next)=>{
        const {Sector}=req.body;
        try{
            const existingSector = await sectormodel.findOne({ Sector });

            if (existingSector) {
                return next(new Error('Sector already exists', { cause: 400 }));
            }
            const sector= await sectormodel.create({Sector, createdby:req.user._id, updatedby:req.user._id});
            if(sector){
                return res.status(200).json({message:'Sector Is Created Successfully'})
            }else{
                return next (new Error('Failed to create the sector',{cause:400}))
            }
        }catch (error) {
            console.error('Error creating sector:', error);
            return next(new Error('Internal Server Error', { cause: 500 }));
        }

}

export const deletesector= async(req,res,next)=>{
    const {sectorid}=req.params;
    const sector= await sectormodel.findOne({_id:sectorid})
    if(sector){
        const deletesector= await sectormodel.deleteOne({_id:sectorid})
        if(deletesector){
            return res.status(200).json({message:'Sector Is Deleted Successfully'})
        }else{
            return next (new Error('Unable to delete the sector',{cause:400}))
        }
    }else{
        return next(new Error('Sector Is not found',{cause:400}))
    }
}

export const updatesector= async (req,res,next)=>{
    const {sectorrid}=req.params;
    const sector= await sectormodel.findOne({_id:sectorrid});
    if(!sector){
        return next(new Error('Sector not found',{cause:400}))
    }else{
        if(!req.body.Sector.length >=3){
            return next(new Error('Name length must be equal or more than 3 digidts'))
        }
        req.body.updatedby=req.user._id;
        const updatedsector= await sectormodel.findOneAndUpdate({_id:sectorrid}, req.body, {new:false})
        if(!updatedsector){
            return next(new Error ("Faild to Update Sector", {cause:400}))
        }else{
            res.status(200).json({message:'Sector Is Updated Successfully', updatedsector})
        }
    }
}

export const allsectors= async (req,res,next)=>{
    const {page, size}=req.query;
    const{limit,skip}= pagination(page, size)
    const allsectors= await sectormodel.find({}).limit(limit).skip(skip).select('Sector');
    if(allsectors){
        return res.status(200).json({message:'Success', allsectors})
    }else{
        return next(new Error ("Faild To Get All Sectors", {cause:400}))
    }
 }