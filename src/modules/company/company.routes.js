import { Router } from "express";
import { asynchandler } from "../../middleware/errorhandler.js";
import * as companyRouter from './company.controller.js';
import { filevalidation, HME, mymulter  } from '../../services/multer.js';
import { auth} from "../../middleware/auth.js";
import {endpoint} from './company.endpoints.js';

const router= Router({mergeParams:true});

router.post('/', auth(endpoint.Add),mymulter(filevalidation.image).single('image'),HME, asynchandler(companyRouter.createcompany))
router.get('/',  asynchandler(companyRouter.getAllCompanies))
router.delete('/:companyId', auth(endpoint.Delete) ,asynchandler(companyRouter.deleteCompany))
router.put('/:id', auth(endpoint.Update) , mymulter(filevalidation.image).single('image'), HME,asynchandler(companyRouter.updateCompany))

export default router;