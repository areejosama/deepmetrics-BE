import { Router } from "express";
import { asynchandler } from "../../../middleware/errorhandler.js";
import * as authRoutes from './auth.controller.js';
import {validation} from '../../../middleware/validation.js';
import {forgetpassword, signin, signup } from "./auth.validation.js";

const router= Router();
router.post('/signup', validation (signup),asynchandler(authRoutes.signup))
router.post('/signin',validation (signin) ,asynchandler(authRoutes.signin));
router.post('/resetpassword', validation(forgetpassword),asynchandler(authRoutes.forgetpassword))
export default router;