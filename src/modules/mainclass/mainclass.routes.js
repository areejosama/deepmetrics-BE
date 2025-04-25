import { Router } from "express";
import * as mainclasscontroller from './mainclass.controller.js';
import {validation} from '../../middleware/validation.js';
import {createclass, createsubclass, createsub2class, createaccount, createsubaccount} from './mainclass.validation.js'
import { asynchandler } from "../../middleware/errorhandler.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./mainclass.endpoints.js";

const router= Router({mergeParams:true});
//MAIN CLASS
router.post('/', auth(endpoint.Add) ,validation(createclass), asynchandler(mainclasscontroller.createclass));
router.get('/',asynchandler(mainclasscontroller.getmainclass));

// SUB CLASS
router.post('/subclass', auth(endpoint.Add) ,validation(createsubclass), asynchandler(mainclasscontroller.createsubclass));
router.get('/subclass',asynchandler(mainclasscontroller.getsubclass));
router.put('/subclass/:subclassId', auth(endpoint.Update) ,asynchandler(mainclasscontroller.updatesubclass))
router.delete('/subclass/:subclassId', auth(endpoint.Delete) ,asynchandler(mainclasscontroller.deletesubclass))

// SUB SUB CLASS
router.post('/subsubclass', auth(endpoint.Add) ,validation(createsub2class), asynchandler(mainclasscontroller.createsubsubclass))
router.get('/sub2class',asynchandler(mainclasscontroller.getsubsubclass))
router.put('/sub2class/:subSubClassId', auth(endpoint.Update) ,asynchandler(mainclasscontroller.updatesubsubclass))
router.delete('/sub2class/:subSubClassId', auth(endpoint.Delete) ,asynchandler(mainclasscontroller.deletesub2class))

// ACCOUNT
router.put('/account/:mainAccountId', auth(endpoint.Update) ,asynchandler(mainclasscontroller.updateAccount))
router.delete('/account/:mainAccountId', auth(endpoint.Delete) ,asynchandler(mainclasscontroller.deleteMainAccount))
router.get('/accounts',asynchandler(mainclasscontroller.getmainaccount))
router.post('/account/', auth(endpoint.Add) ,validation(createaccount), asynchandler(mainclasscontroller.createaccount))

//SUB ACCOUNT
router.post('/subaccount/', auth(endpoint.Add) ,validation(createsubaccount), asynchandler(mainclasscontroller.createSubAccount))
router.get('/subaccounts',asynchandler(mainclasscontroller.getSubAccounts))
router.put('/subaccount/:subAccountId', auth(endpoint.Update) ,asynchandler(mainclasscontroller.updateSubAccount))
router.delete('/subaccount/:subAccountId', auth(endpoint.Delete) ,asynchandler(mainclasscontroller.deleteSubAccount))

//data
router.post('/finData', auth(endpoint.Add) , asynchandler(mainclasscontroller.createFinancialData))
router.get('/finData',asynchandler(mainclasscontroller.getFinancialData));
router.delete('/finData/:repoid', auth(endpoint.Delete) ,asynchandler(mainclasscontroller.deleteFinancialData))
router.put('/finData/:id', auth(endpoint.Update) ,asynchandler(mainclasscontroller.updateFinancialData))

//repo
router.post('/finRepo', auth(endpoint.Add) , asynchandler(mainclasscontroller.addFinancialData))
router.put('/finRepo/:FinReport_id', auth(endpoint.Add) , asynchandler(mainclasscontroller.updateFinancialRepoData))
router.get('/finRepo',asynchandler(mainclasscontroller.getFinancialRepo));
router.delete('/finRepo/:id', auth(endpoint.Delete) ,asynchandler(mainclasscontroller.deleteFinancialRepo))

//all classes
router.get('/all/:classId',asynchandler(mainclasscontroller.getClassWithFinancialData));

//sort

//router.post('/finData/company/:companyId/latest', mainclasscontroller.addFinancialData)
router.get('/finData/company/:companyId/latest', mainclasscontroller.getLatest2Report)


export default router;
