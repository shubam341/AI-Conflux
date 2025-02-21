import {Router} from 'express';
import * as userController from '../controllers/user.controller.js';
import {body} from 'express-validator'
import * as authMiddleware from '../middleware/auth.middleware.js'

const router=Router();

//Registration route
router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({min:4}).withMessage('Password must be atleast 4 charcter long'),
    userController.createUserController);

    //Login route
  router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({min:4}).withMessage('Password must be atleast 4 charcter long'),
    userController.loginController);

    //User profile route
    router.get('/profile',authMiddleware.authUser,userController.ProfileController);

   
    //Logout route
    router.get('/logout', authMiddleware.authUser, userController.logoutController);


    router.get('/all', authMiddleware.authUser, userController.getAllUsersController);

export default router;