import { Router } from "express";
import * as sectorcontroller from './sector.controller.js';
import { asynchandler } from "../../middleware/errorhandler.js";
import {validation} from '../../middleware/validation.js';
import {createsector, deletesector, updatesector} from './sector.validation.js';
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./sector.endpoints.js";

const router= Router({mergeParams:true});
router.post('/' , auth (endpoint.Add), asynchandler(sectorcontroller.createsector));
router.delete('/:sectorid', auth (endpoint.Delete),validation(deletesector) ,asynchandler(sectorcontroller.deletesector));
router.put('/:sectorrid', auth (endpoint.Update), validation(updatesector) ,asynchandler(sectorcontroller.updatesector));
router.get('/', asynchandler(sectorcontroller.allsectors));
export default router;