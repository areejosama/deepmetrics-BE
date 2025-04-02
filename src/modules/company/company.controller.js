import { companymodel } from "../../../DB/models/company.model.js";
import { pagination } from "../../services/Pagination.js";
import cloudinary from '../../services/cloudinary.js';

export const createcompany= async(req,res,next)=>{
    if(!req.file){
        return next(new Error ('Company Image Is Required', {cause:400}))
    }else{
        const {name, country, sectorid, currency}=req.body;
        if(!req.body.name.length >=3){
            return next(new Error('Name length must be equal or more than 3 digidts'))
        }
        const {secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,
            {folder:'deepmetrics/company'})
        const data= await companymodel.create({name, createdby:req.user._id, updatedby:req.user._id, image:secure_url, imagepublicid: public_id, country, sectorid, currency})
        if(data){
            return res.status(200).json({message:'Company Created Successfully',data })
        }else{
            return next (new Error('Failed To Add A Company, Try Again', {cause:400}))
        }
    }
}

export const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await companymodel.find()
        .populate({
          path: 'sectorid', // العلاقة مع نموذج القطاعات
          select: 'Sector' // استرجاع حقل الاسم فقط من القطاع
        }).select ('name currency image country')
      if (!companies) {
        return res.status(404).json({ message: 'No companies found' });
      }
  
      return res.status(200).json({ 
        message: 'Companies retrieved successfully', 
        companies 
      });
    } catch (error) {
      return next(new Error('Failed to retrieve companies, try again', { cause: 500 }));
    }
  };


//   export const updateCompany = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { name, country, sectorid, currency } = req.body;
//         const company = await companymodel.findById(id);
       
//         if (!company) {
//             return next(new Error('Company not found', { cause: 404 }));
//         }

//         // تحديث الصورة إذا تم رفع صورة جديدة
//         let secure_url = company.image;
//         let public_id = company.imagepublicid;

//         if (req.file) {
//             // حذف الصورة القديمة من Cloudinary
//             await cloudinary.uploader.destroy(public_id);
            
//             // رفع الصورة الجديدة إلى Cloudinary
//             const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'deepmetrics/company' });
//             secure_url = uploadResult.secure_url;
//             public_id = uploadResult.public_id;
//         }

//         // تحديث بيانات الشركة
//         req.body.name= name;
//         company.name = name || company.name;
//         company.country = country || company.country;
//         company.sectorid = sectorid || company.sectorid;
//         company.currency = currency || company.currency;
//         company.image = secure_url;
//         company.imagepublicid = public_id;
//         company.updatedby = req.user._id;

//         await company.save();

//         return res.status(200).json({ message: 'Company updated successfully', company });
//     } catch (error) {
//         return next(new Error('Failed to update company, try again', { cause: 500 }));
//     }
// };

export const deleteCompany = async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const company= await companymodel.findById(companyId)
      if(company){
          await cloudinary.uploader.destroy(company.imagepublicid)
          const dcompany= await companymodel.deleteOne({_id:companyId})
          if(dcompany){
              return res.status(200).json({message:'Company Deleted Successfully'})
          }else{
              return next (new Error('Unable To Delete The Company, Please Try Again', {cause:400}))
          }
      }else{
          return next (new Error('Company Not Found', {cause:400})) 
      }
    } catch (error) {
        return next(new Error('Failed to delete company, try again', { cause: 500 }));
    }



};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Request Body:', req.body); // تسجيل req.body بعد تحليلها بواسطة multer
    console.log('Content-Type:', req.headers['content-type']); // تسجيل نوع البيانات
    console.log('Files:', req.files); // تسجيل الملفات إذا كنتِ ترسلين ملفات

    const company = await companymodel.findById(id);
    
    if (!company) {
        return next(new Error('Company not found', { cause: 404 }));
    }

    let secure_url = company.image;
    let public_id = company.imagepublicid;

    if (req.files && req.files.length > 0) { // التأكد من وجود ملفات
        // حذف الصورة القديمة من Cloudinary
        await cloudinary.uploader.destroy(public_id);
        
        // رفع الصورة الجديدة إلى Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.files[0].path, { folder: 'deepmetrics/company' });
        secure_url = uploadResult.secure_url;
        public_id = uploadResult.public_id;
    }

    // الحصول على البيانات من req.body مع التحقق من الوجود
    const name = req.body.name || company.name; // استخدام Sector بدلاً من name إذا كنتِ تعملين على القطاعات
    const country = req.body.country || company.country;
    const sectorid = req.body.sectorid || company.sectorid;
    const currency = req.body.currency || company.currency;

    console.log('Parsed Values:', { name, country, sectorid, currency }); // تسجيل القيم المحللة

    // تحديث بيانات الشركة
    company.name = name;
    company.country = country;
    company.sectorid = sectorid;
    company.currency = currency;
    company.image = secure_url;
    company.imagepublicid = public_id;
    company.updatedby = req.user._id;

    await company.save();

    return res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    return next(new Error('Failed to update company, try again', { cause: 500 }));
  }
};