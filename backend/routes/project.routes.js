import {Router} from 'express'
import {body} from 'express-validator'
import * as projectController from '../controllers/project.controller.js'
//project creatd by only logged in user
import * as authMiddleWare from '../middlewares/auth.middleware.js';

const router =Router();
router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage("Name is required"),
    projectController.createProject
)

export default router