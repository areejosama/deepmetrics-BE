import { classmodel } from "../../../DB/models/class.model.js";
import { companymodel } from "../../../DB/models/company.model.js";
import { subclassmodel } from "../../../DB/models/subclass.model.js";
import { subsubclassmodel } from "../../../DB/models/subsubclass.model.js";
import { pagination } from "../../services/Pagination.js";
import { accountmodel } from "../../../DB/models/account.model.js";
import { subaccountmodel } from "../../../DB/models/subaccount.model.js";
import { FinancialDatamodel } from "../../../DB/models/finaldata.model.js";
import { finReportmodel } from "../../../DB/models/financialReport.model.js";
import { sectormodel } from "../../../DB/models/sector.model.js";

export const getmainclass= async (req,res,next) =>{
    try{
        const { page, size } = req.query;
        const { limit, skip } = pagination(page, size);
        const allmainclass = await classmodel.find({}).skip(skip).limit(limit).exec();
        if(allmainclass){
            return res.status(201).json({ message: 'all classes are here!' , data: allmainclass});
        }
    }catch(error){
        return next(new Error('can not show all main classes', { cause: 500 }));
    }
};
export const createclass = async (req,res,next) =>{
    const {name}= req.body;
    const findclass = await classmodel.findOne({name})
    if(findclass){
        return next (new Error ('Class is alreay exist!', {cause:409}))
    }else{
        const saveclas= await classmodel.create({name,createdby: req.user._id, updatedby: req.user._id});
        console.log(saveclas)
        return res.status(201).json({ message: 'Class Created Successfully',  createclass});
    }
};

export const createsubclass = async (req, res, next) => {
    try {
        const { classid, subclass } = req.body; 
        if (!await classmodel.findById(classid)) {
            return next(new Error('Class not found', { cause: 404 }));
        }
        if (await subclassmodel.exists({ subclass })) {
            return next(new Error('Subclass already exists', { cause: 400 }));
        }
        await subclassmodel.create({
            subclass,
            classid, 
            createdby: req.user._id,
            updatedby: req.user._id,
        });

        return res.status(201).json({ message: 'Subclass Created Successfully' });
    } catch (error) {
        console.error('Error creating subclass:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const getsubclass= async (req,res,next) =>{
    try{
        const { page, size } = req.query;
        const { limit, skip } = pagination(page, size);
        const allmainclass = await subclassmodel.find({}).skip(skip).limit(limit).exec();
        if(allmainclass){
            return res.status(201).json({ message: 'all classes are here!' , data: allmainclass});
        }
    }catch(error){
        return next(new Error('can not show all main classes', { cause: 500 }));
    }
};

export const updatesubclass = async (req, res, next) => {
    try {
        const { subclassId } = req.params; 
        const { subclass, classid } = req.body; 
        const existingSubClass = await subclassmodel.findById(subclassId);
        if (!existingSubClass) {
            return next(new Error('Subclass not found', { cause: 404 }));
        }
        if (!await classmodel.findById(classid)) {
            return next(new Error('Main Class not found', { cause: 404 }));
        }
        const duplicateSubClass = await subclassmodel.findOne({ subclass, _id: { $ne: subclassId } });
        if (duplicateSubClass) {
            return next(new Error('Subclass name already exists', { cause: 400 }));
        }
        const updatedSubClass = await subclassmodel.findByIdAndUpdate(
            subclassId,
            {
                subclass,
                classid,
                updatedby: req.user._id,
            },
            { new: true } 
        );

        return res.status(200).json({ message: 'Subclass Updated Successfully', data: updatedSubClass });
    } catch (error) {
        console.error('Error updating subclass:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const deletesubclass = async (req, res, next) => {
    try {
        const { subclassId } = req.params; // معرف الكلاس الفرعي من المسار

        // التحقق من وجود الكلاس الفرعي
        const existingSubClass = await subclassmodel.findById(subclassId);
        if (!existingSubClass) {
            return next(new Error('Subclass not found', { cause: 404 }));
        }

        // حذف الكلاس الفرعي
        await subclassmodel.findByIdAndDelete(subclassId);

        return res.status(200).json({ message: 'Subclass Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting subclass:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const createsubsubclass = async (req, res, next) => {
    try {
        const { subclassid, subsubclass, sectorid } = req.body;
        if (!await subclassmodel.findById(subclassid)) {
            return next(new Error('Subclass not found', { cause: 404 }));
        }
        if (await subsubclassmodel.exists({ subsubclass })) {
            return next(new Error('Subsubclass already exists', { cause: 400 }));
        }
        await subsubclassmodel.create({ subsubclass, subclassid, sectorid ,createdby: req.user._id, updatedby: req.user._id });
        return res.status(201).json({ message: 'Subsubclass Created Successfully' });
    } catch (error) {
        console.error('Error creating subsubclass:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const getsubsubclass= async (req,res,next) =>{
    try{
        const { page, size } = req.query;
        const { limit, skip } = pagination(page, size);
        const allmainclass = await subsubclassmodel.find({}).populate('subclassid', 'subclass')
        .populate('sectorid', 'Sector').skip(skip).limit(limit).exec();
        if(allmainclass){
            return res.status(201).json({ message: 'all classes are here!' , data: allmainclass});
        }
    }catch(error){
        return next(new Error('can not show all main classes', { cause: 500 }));
    }
};

export const updatesubsubclass = async (req, res, next) => {
    try {
        const { subSubClassId } = req.params; 
        const { subsubclass, subclassid, sectorid } = req.body; 
        const existingSubSubClass = await subsubclassmodel.findById(subSubClassId);
        if (!existingSubSubClass) {
            return next(new Error('Sub Sub Class not found', { cause: 404 }));
        }

        // التحقق من وجود الكلاس الفرعي
        if (!await subclassmodel.findById(subclassid)) {
            return next(new Error('Sub Class not found', { cause: 404 }));
        }

        // التحقق من عدم تكرار اسم الكلاس الفرعي الفرعي (باستثناء السجل الحالي)
        const duplicateSubSubClass = await subsubclassmodel.findOne({
            subsubclass,
            _id: { $ne: subSubClassId },
        });
        if (duplicateSubSubClass) {
            return next(new Error('Sub Sub Class name already exists', { cause: 400 }));
        }

        const updatedSubSubClass = await subsubclassmodel.findByIdAndUpdate(
            subSubClassId,
            {
                subsubclass,
                subclassid,
                sectorid,
                updatedby: req.user._id,
            },
            { new: true } 
        );

        return res.status(200).json({
            message: 'Sub Sub Class Updated Successfully',
            data: updatedSubSubClass,
        });
    } catch (error) {
        console.error('Error updating sub sub class:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const deletesub2class = async (req, res, next) => {
    try {
        const { subSubClassId } = req.params; 
        const existingSubSubClass = await subsubclassmodel.findById(subSubClassId);
        console.log(existingSubSubClass)
        if (!existingSubSubClass) {
            return next(new Error('Sub Sub Class not found', { cause: 404 }));
        }
        await subsubclassmodel.findByIdAndDelete(subSubClassId);
        return res.status(200).json({ message: 'Sub Sub Class Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting sub sub class:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const createaccount = async (req, res, next) => {
    try {
        const { subsubclassid ,account, sectorid } = req.body;
        if (!await subsubclassmodel.findById(subsubclassid)) {
            return next(new Error('Subsubclass not found', { cause: 404 }));
        }
        if (await accountmodel.exists({ account })) {
            return next(new Error('Account already exists', { cause: 400 }));
        }
        await accountmodel.create({ account, subsubclassid, sectorid,createdby: req.user._id, updatedby: req.user._id });
        return res.status(201).json({ message: 'Account Created Successfully' });
    } catch (error) {
        console.error('Error creating account:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const getmainaccount = async (req, res, next)=>{
    try{
        const { page, size } = req.query;
        const { limit, skip } = pagination(page, size);
        const allmainaccount = await accountmodel.find({}).populate('subsubclassid', 'subsubclass')
        .populate('sectorid', 'Sector').skip(skip).limit(limit).exec();
        if(allmainaccount){
            return res.status(201).json({ message: 'all accounts are here!' , data: allmainaccount});
        }
    }catch(error){
        return next(new Error('can not show all main accounts', { cause: 500 }));
    }

};

export const updateAccount = async (req, res, next) => {
    try {
        const { mainAccountId } = req.params; // معرف الحساب الرئيسي من المسار
        const { account, subsubclassid, sectorid } = req.body; // الاسم الجديد ومعرف الكلاس الفرعي الفرعي من البيانات المرسلة

        // التحقق من وجود الحساب الرئيسي
        const existingAccount = await accountmodel.findById(mainAccountId);
        if (!existingAccount) {
            return next(new Error('Main Account not found', { cause: 404 }));
        }

        // التحقق من وجود الكلاس الفرعي الفرعي
        if (!await subsubclassmodel.findById(subsubclassid)) {
            return next(new Error('Sub Sub Class not found', { cause: 404 }));
        }

        // التحقق من عدم تكرار اسم الحساب (باستثناء الحساب الحالي)
        const duplicateAccount = await accountmodel.findOne({
            account,
            _id: { $ne: mainAccountId },
        });
        if (duplicateAccount) {
            return next(new Error('A Main Account with this name already exists', { cause: 400 }));
        }

        // تحديث الحساب الرئيسي
        const updatedAccount = await accountmodel.findByIdAndUpdate(
            mainAccountId,
            {
                account,
                subsubclassid,
                sectorid,
                updatedby: req.user._id,
            },
            { new: true } // لإرجاع السجل المحدث
        );

        return res.status(200).json({
            message: 'Main Account Updated Successfully',
            data: updatedAccount,
        });
    } catch (error) {
        console.error('Error updating main account:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const deleteMainAccount = async (req, res, next) => {
    try {
        const { mainAccountId } = req.params; // معرف الحساب الرئيسي من المسار

        // التحقق من وجود الحساب الرئيسي
        const existingAccount = await accountmodel.findById(mainAccountId);
        if (!existingAccount) {
            return next(new Error('Main Account not found', { cause: 404 }));
        }

        // حذف الحساب الرئيسي
        await accountmodel.findByIdAndDelete(mainAccountId);

        return res.status(200).json({ message: 'Main Account Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting main account:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const getSubAccounts = async (req, res, next) => {
    try {
        const subAccounts = await subaccountmodel.find().populate('accountid', 'account').populate('sectorid', 'Sector'); // جلب اسم الحساب الرئيسي
        return res.status(200).json({
            message: 'Sub Accounts Retrieved Successfully',
            data: subAccounts,
        });      
    } catch (error) {
        console.error('Error fetching sub accounts:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const createSubAccount = async (req, res, next) => {
    try {
        const { subaccount, accountid, sectorid } = req.body;

        // التحقق من وجود الحساب الرئيسي
        if (!await accountmodel.findById(accountid)) {
            return next(new Error('Main Account not found', { cause: 404 }));
        }

        // التحقق من عدم تكرار اسم الحساب الفرعي
        if (await subaccountmodel.exists({ subaccount })) {
            return next(new Error('Sub Account already exists', { cause: 400 }));
        }

        const newSubAccount = await subaccountmodel.create({
            subaccount,
            accountid,
            sectorid,
            createdby: req.user._id,
            updatedby: req.user._id,
        });

        return res.status(201).json({
            message: 'Sub Account Created Successfully',
            data: newSubAccount,
        });
    } catch (error) {
        console.error('Error creating sub account:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const updateSubAccount = async (req, res, next) => {
    try {
        const { subAccountId } = req.params;
        const { subaccount, accountid, sectorid } = req.body;

        // التحقق من وجود الحساب الفرعي
        const existingSubAccount = await subaccountmodel.findById(subAccountId);
        if (!existingSubAccount) {
            return next(new Error('Sub Account not found', { cause: 404 }));
        }

        // التحقق من وجود الحساب الرئيسي
        if (!await accountmodel.findById(accountid)) {
            return next(new Error('Main Account not found', { cause: 404 }));
        }

        // التحقق من عدم تكرار اسم الحساب الفرعي (باستثناء الحساب الحالي)
        const duplicateSubAccount = await subaccountmodel.findOne({
            subaccount,
            _id: { $ne: subAccountId },
        });
        if (duplicateSubAccount) {
            return next(new Error('A Sub Account with this name already exists', { cause: 400 }));
        }

        // تحديث الحساب الفرعي
        const updatedSubAccount = await subaccountmodel.findByIdAndUpdate(
            subAccountId,
            {
                subaccount,
                accountid,
                sectorid,
                updatedby: req.user._id,
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'Sub Account Updated Successfully',
            data: updatedSubAccount,
        });
    } catch (error) {
        console.error('Error updating sub account:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const deleteSubAccount = async (req, res, next) => {
    try {
        const { subAccountId } = req.params;

        // التحقق من وجود الحساب الفرعي
        const existingSubAccount = await subaccountmodel.findById(subAccountId);
        if (!existingSubAccount) {
            return next(new Error('Sub Account not found', { cause: 404 }));
        }

        // حذف الحساب الفرعي
        await subaccountmodel.findByIdAndDelete(subAccountId);

        return res.status(200).json({ message: 'Sub Account Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting sub account:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const createFinancialData = async (req, res) => {
    try {
      const { reportYear, period, companyid, status } = req.body;
  
      if (!reportYear || !period || !companyid || !status === undefined) {
        return res.status(400).json({ success: false, message: 'All Fields Are Required' });
      }
      const financialData = new finReportmodel({reportYear, period, companyid, status, createdby: req.user._id, updatedby: req.user._id});
      const savedata = await financialData.save();
      res.status(201).json({ message: 'Success',  savedata });
    } catch (error) {
      res.status(500).json({ success: false, message: 'an error occaured with adding the report', error: error.message });
    }
  };

export const getFinancialData = async (req, res, next) => {
    try {
        const financialData = await finReportmodel.find({}).populate('companyid');
        return res.status(200).json({
            message: 'Financial Data Retrieved Successfully',
            data: financialData,
        });
    } catch (error) {
        console.error('Error fetching financial data:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const deleteFinancialData = async (req, res, next) => {
    try {
        const { repoid } = req.params; // جلب معرف السجل من المسار
        const deletedData = await finReportmodel.findByIdAndDelete(repoid);
        if (!deletedData) {
            return res.status(404).json({ message: 'Financial Data not found' });
        }
        return res.status(200).json({
            message: 'Financial Data deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting financial data:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const updateFinancialData = async (req, res) => {
    try {
      const { id } = req.params;
      const { reportYear, period, companyid, status, finaldataid } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Financial Report ID is required' });
      }
      if (!reportYear && !period && !companyid && status === undefined && !finaldataid) {
        return res.status(400).json({ success: false, message: 'At least one field (reportYear, period, companyid, status, or finaldataid) is required to update' });
      }
        const financialData = await finReportmodel.findById(id);
      if (!financialData) {
        return res.status(404).json({ success: false, message: 'Financial report not found' });
      }
  
      if (req.user.role !== 'admin' && financialData.createdby.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update this report' });
      }
      if (reportYear) {
        if (typeof reportYear !== 'string') {
          return res.status(400).json({ success: false, message: 'reportYear must be a string' });
        }
        financialData.reportYear = reportYear;
      }
      if (period) {
        const validPeriods = ['Q1', 'H1', '9M', 'YTD'];
        if (!validPeriods.includes(period)) {
          return res.status(400).json({ success: false, message: 'period must be one of: Q1, H1, 9M, YTD' });
        }
        financialData.period = period;
      }
      if (companyid) {
        const companyExists = await companymodel.findById(companyid);
        if (!companyExists) {
          return res.status(400).json({ success: false, message: 'Company not found' });
        }
        financialData.companyid = companyid;
      }
      if (status !== undefined) {
        const validStatuses = ['Draft', 'Published'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ success: false, message: 'status must be one of: Draft, Published' });
        }
        financialData.status = status;
      }
      if (finaldataid) {
        const financialDataExists = await FinancialDatamodel.findById(finaldataid);
        if (!financialDataExists) {
          return res.status(400).json({ success: false, message: 'FinancialData not found' });
        }
        financialData.finaldataid = finaldataid;
      }
      financialData.updatedby = req.user._id;
      const updatedData = await financialData.save();
      await updatedData.populate('companyid createdby updatedby repos');
      res.status(200).json({ message: 'Financial report updated successfully', data: updatedData });
    } catch (error) {
      res.status(500).json({ success: false, message: 'An error occurred while updating the report', error: error.message });
    }
};

export const addFinancialData = async (req, res, next) => {
    const { FinReport_id, allclasses, companyId } = req.body;

    if (!FinReport_id || !allclasses) {
      return res.status(400).json({ error: 'Missing required fields (FinReport_id, allclasses)' });
    }
  
    const reportData = new FinancialDatamodel({
      companyid: companyId,
      FinReport_id,
      createdby: req.user._id, updatedby: req.user._id,
      allclasses: allclasses.map(cls => ({
        classid: cls.classid,
        subclassid: cls.subclassid || null,
        subsubclassid: cls.subsubclassid || null,
        accounts: cls.accounts.map(acc => ({
          accountid: acc.accountid,
          finaldata: acc.finaldata.map(fd => ({
            subaccountid: fd.subaccountid,
            amount: fd.amount
          }))
        }))
      })),
    });
  
    try {
      const savedReport = await reportData.save();
      console.log(`Data added for company ${req.params.companyId}:`, savedReport);
      res.status(201).json({
        message: 'Financial data added successfully',
        data: savedReport,
        latest_report: savedReport
      });
    } catch (error) {
      console.error('Error saving data:', error);
      return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const getFinancialRepo = async (req, res, next) => {
    try {
        const financialData = await FinancialDatamodel.find({})
            .populate('companyid', 'name image') // جلب اسم الشركة
            .populate('FinReport_id', 'reportYear period') // جلب تفاصيل التقرير المرتبط
            .populate('createdby', 'name') // جلب اسم المستخدم الذي أنشأ السجل
            .populate('updatedby', 'name') // جلب اسم المستخدم الذي عدّل السجل
            .populate('allclasses.classid', 'name') // جلب اسم الفئة
            .populate('allclasses.subclassid', 'subclass') // جلب اسم الفئة الفرعية
            .populate('allclasses.subsubclassid', 'subsubclass') // جلب اسم الفئة الفرعية الفرعية
            .populate('allclasses.accounts.accountid', 'account') // جلب اسم الحساب
            .populate('allclasses.accounts.finaldata.subaccountid', 'subaccount') // جلب اسم الحساب الفرعي
            .populate({ // جلب بيانات reports عبر virtual field
                path: 'reports',
                select: 'reportYear period'
            });

        // التحقق من وجود بيانات
        if (!financialData || financialData.length === 0) {
            return res.status(404).json({ message: 'No Financial Data found' });
        }

        return res.status(200).json({
            message: 'Financial Data retrieved successfully',
            data: financialData,
        });
    } catch (error) {
        console.error('Error fetching financial data:', error);
        return next(new Error('Internal Server Error', { cause: 500 }));
    }
};

export const deleteFinancialRepo = async (req, res, next) => {
    try{
    const { id } = req.params;
    const financialReport = await FinancialDatamodel.findById(id);
    if (!financialReport) {
      return res.status(404).json({ message: 'Financial report not found' });
    }
    await FinancialDatamodel.findByIdAndDelete(id);
    res.status(200).json({
      message: 'Financial report deleted successfully',
      data: { _id: id },
    });
  } catch (error) {
    console.error('Error deleting financial report:', error);
    res.status(500).json({
      message: 'Failed to delete financial report',
      error: error.message,
    });
  }
};

export const getClassWithFinancialData = async (req, res) => {
    try {
      const { classId } = req.params;
        const populatedClass = await classmodel.findById(classId)
        .populate({
          path: 'subclasses',
          populate: {
            path: 'subsubclasses',
            populate: {
              path: 'accounts',
              populate: { path: 'subaccounts' }
            }
          }
        });
  
      if (!populatedClass) {
        console.log(`Class with ID ${classId} not found`);
        return res.status(404).json({ message: 'Class not found' });
      }
        const subaccountIds = populatedClass.subclasses.flatMap(subclass =>
        subclass.subsubclasses.flatMap(subsubclass =>
          subsubclass.accounts.flatMap(account =>
            account.subaccounts.map(subaccount => subaccount._id)
          )
        )
      );
      
      const financialData = await FinancialDatamodel.find({
        'finaldata.subaccount': { $in: subaccountIds }
      }).select('finaldata.subaccount finaldata.amount');
  
      const financialMap = new Map();
      financialData.forEach(fd => {
        fd.finaldata.forEach(data => {
          financialMap.set(data.subaccount.toString(), data.amount);
        });
      });
  
        const classWithFinancialData = {
        ...populatedClass.toObject(),
        subclasses: populatedClass.subclasses.map(subclass => ({
          ...subclass.toObject(),
          subsubclasses: subclass.subsubclasses.map(subsubclass => ({
            ...subsubclass.toObject(),
            accounts: subsubclass.accounts.map(account => ({
              ...account.toObject(),
              subaccounts: account.subaccounts.map(subaccount => {
                const amount = financialMap.get(subaccount._id.toString());
                return amount !== undefined ? { ...subaccount.toObject(), amount } : subaccount.toObject();
              })
            }))
          }))
        }))
      };
  
      res.json(classWithFinancialData);
  
    } catch (error) {
      console.error('Error fetching class with financial data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const getLatest2Report = async (req, res, next) => {
    const {companyId} = req.params;
    console.log(`Fetching latest report for companyId: ${companyId}`);
  
    try {
      const latestReport = await FinancialDatamodel.findOne({ companyid: companyId })
        .sort({ timestamp: -1, _id: -1 })
        .populate('companyid', 'name image')
        .populate('FinReport_id', 'reportYear period')
        .populate('createdby', 'name')
        .populate('updatedby', 'name')
        .populate('allclasses.classid', 'name')
        .populate('allclasses.subclassid', 'subclass')
        .populate('allclasses.subsubclassid', 'subsubclass')
        .populate('allclasses.accounts.accountid', 'account')
        .populate('allclasses.accounts.finaldata.subaccountid', 'subaccount')
        .populate({ path: 'reports', select: 'reportYear period' });
  
      if (!latestReport) {
        console.log(`No data found for company ${companyId}`);
        return res.status(404).json({ message: `No data found for company ${companyId}` });
      }
  
      console.log(`Latest report found:`, latestReport);
      console.log(`FinReport_id details:`, latestReport.FinReport_id);
      res.status(200).json({
        message: 'Financial Data retrieved successfully',
        data: latestReport,
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      return next(new Error('Internal Server Error', { cause: 500 }));
    }
  };

export const updateFinancialRepoData = async (req, res, next) => {
  const { FinReport_id}= req.params;
  const {allclasses, companyId } = req.body;

  // التحقق من الحقول المطلوبة
  if (!FinReport_id || !allclasses || !companyId) {
    return res.status(400).json({ error: 'Missing required fields (FinReport_id, allclasses, companyId)' });
  }

  try {
    // البحث عن التقرير الموجود بناءً على FinReport_id و companyId
    const existingReport = await FinancialDatamodel.findOne({ FinReport_id, companyid: companyId });

    if (!existingReport) {
      return res.status(404).json({ error: 'Financial report not found' });
    }

    // تحديث البيانات
    existingReport.allclasses = allclasses.map(cls => ({
      classid: cls.classid,
      subclassid: cls.subclassid || null,
      subsubclassid: cls.subsubclassid || null,
      accounts: cls.accounts.map(acc => ({
        accountid: acc.accountid,
        finaldata: acc.finaldata.map(fd => ({
          subaccountid: fd.subaccountid,
          amount: fd.amount
        }))
      }))
    }));
    existingReport.updatedby = req.user._id;
    existingReport.updatedAt = Date.now();

    // حفظ التعديلات
    const updatedReport = await existingReport.save();

    console.log(`Data updated for company ${companyId}:`, updatedReport);
    res.status(200).json({
      message: 'Financial data updated successfully',
      data: updatedReport,
      latest_report: updatedReport
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return next(new Error('Internal Server Error', { cause: 500 }));
  }
};
  
// export const getClassWithFinancialData = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     const { companyid } = req.body; 

//     if (!classId || !companyid) {
//       return res.status(400).json({ message: 'Class ID and Company ID are required' });
//     }
//     const company = await companymodel.findById(companyid).select('sectorid');
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     const populatedClass = await classmodel.findById(classId)
//       .populate({
//         path: 'subclasses',
//         populate: {
//           path: 'subsubclasses',
//           populate: {
//             path: 'accounts',
//             populate: { path: 'subaccounts' }
//           },
          
//         }
//       });

//     if (!populatedClass) {
//       console.log(`Class with ID ${classId} not found`);
//       return res.status(404).json({ message: 'Class not found' });
//     }
//     populatedClass.subclasses = populatedClass.subclasses.filter(subclass => 
//       subclass.sectorid === company.sectorid
//     );
//     console.log(populatedClass)
//     if (populatedClass.subclasses.length === 0) {
//       return res.status(404).json({ message: 'No Sub-Classes found for this sector' });
//     }

//     const subaccountIds = populatedClass.subclasses.flatMap(subclass =>
//       subclass.subsubclasses.flatMap(subsubclass =>
//         subsubclass.accounts.flatMap(account =>
//           account.subaccounts.map(subaccount => subaccount._id)
//         )
//       )
//     );

//     // جلب البيانات المالية
//     const financialData = await FinancialDatamodel.find({
//       'finaldata.subaccount': { $in: subaccountIds }
//     }).select('finaldata.subaccount finaldata.amount');

//     // تحويل البيانات المالية إلى Map
//     const financialMap = new Map();
//     financialData.forEach(fd => {
//       fd.finaldata.forEach(data => {
//         financialMap.set(data.subaccount.toString(), data.amount);
//       });
//     });

//     // بناء الكلاس مع البيانات المالية
//     const classWithFinancialData = {
//       ...populatedClass.toObject(),
//       subclasses: populatedClass.subclasses.map(subclass => ({
//         ...subclass.toObject(),
//         subsubclasses: subclass.subsubclasses.map(subsubclass => ({
//           ...subsubclass.toObject(),
//           accounts: subsubclass.accounts.map(account => ({
//             ...account.toObject(),
//             subaccounts: account.subaccounts.map(subaccount => {
//               const amount = financialMap.get(subaccount._id.toString());
//               return amount !== undefined ? { ...subaccount.toObject(), amount } : subaccount.toObject();
//             })
//           }))
//         }))
//       }))
//     };

//     res.json(classWithFinancialData);

//   } catch (error) {
//     console.error('Error fetching class with financial data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const getClassWithFinancialData = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     // const { companyid } = req.body;

//     if (!classId || !companyid) {
//       return res.status(400).json({ message: 'Class ID and Company ID are required' });
//     }

//     const company = await companymodel.findById(companyid).select('sectorid');
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     const populatedClass = await classmodel.findById(classId)
//       .populate({
//         path: 'subclasses',
//         populate: [
//           {
//             path: 'subsubclasses',
//             populate: [
//               {
//                 path: 'accounts',
//                 populate: { path: 'subaccounts' },
//               },
//               {
//                 path: 'sectorid', // Populate للـ sectorid في subsubclass
//                 select: 'Sector',
//               },
//             ],
//           },
//         ],
//       });

//     if (!populatedClass) {
//       console.log(`Class with ID ${classId} not found`);
//       return res.status(404).json({ message: 'Class not found' });
//     }

//     populatedClass.subclasses = populatedClass.subclasses
//       .map(subclass => {
//         subclass.subsubclasses = subclass.subsubclasses.filter(subsubclass => 
//           subsubclass.sectorid && subsubclass.sectorid._id.toString() === company.sectorid.toString()
//         );
//         return subclass;
//       })
//       .filter(subclass => subclass.subsubclasses.length > 0); // حذف الـ subclasses اللي مالهاش subsubclasses بعد الفلترة

//     if (populatedClass.subclasses.length === 0) {
//       return res.status(404).json({ message: 'No Sub-Classes found with SubSubClasses matching this sector' });
//     }

//     // جلب الـ subaccount IDs
//     const subaccountIds = populatedClass.subclasses.flatMap(subclass =>
//       subclass.subsubclasses.flatMap(subsubclass =>
//         subsubclass.accounts.flatMap(account =>
//           account.subaccounts.map(subaccount => subaccount._id)
//         )
//       )
//     );

//     // جلب البيانات المالية
//     const financialData = await FinancialDatamodel.find({
//       'finaldata.subaccount': { $in: subaccountIds },
//     }).select('finaldata.subaccount finaldata.amount');

//     const financialMap = new Map();
//     financialData.forEach(fd => {
//       fd.finaldata.forEach(data => {
//         financialMap.set(data.subaccount.toString(), data.amount);
//       });
//     });

//     // إضافة البيانات المالية للـ Response
//     const classWithFinancialData = {
//       ...populatedClass.toObject(),
//       subclasses: populatedClass.subclasses.map(subclass => ({
//         ...subclass.toObject(),
//         subsubclasses: subclass.subsubclasses.map(subsubclass => ({
//           ...subsubclass.toObject(),
//           sectorName: subsubclass.sectorid?.Sector || 'Unknown', // إضافة sectorName على مستوى subsubclass
//           accounts: subsubclass.accounts.map(account => ({
//             ...account.toObject(),
//             subaccounts: account.subaccounts.map(subaccount => {
//               const amount = financialMap.get(subaccount._id.toString());
//               return amount !== undefined ? { ...subaccount.toObject(), amount } : subaccount.toObject();
//             }),
//           })),
//         })),
//       })),
//     };

//     res.json(classWithFinancialData);
//   } catch (error) {
//     console.error('Error fetching class with financial data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };