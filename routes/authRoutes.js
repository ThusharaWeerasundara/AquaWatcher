const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkadmin, checkSuperadmin, verifiedAccount, checkcust } = require('../middleware/authMiddleware');
const rateLimit = require("express-rate-limit");

// small limits for demostration purposes
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
  });


const createAdminAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 10 requests
    message:
      "Too many requests from this IP, please try again after an hour"
  });


const createDataLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 20, // start blocking after 20 requests
    message:
      "Too many requests from this IP, please try again after an hour"
  });

const createLoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 20, // start blocking after 20 requests
    message:
      "Too many requests from this IP, please try again after an hour"
  });


const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup',createAccountLimiter, authController.signup_post);

router.get('/adminSignup', requireAuth, checkSuperadmin, verifiedAccount, authController.adminSignup_get);
router.post('/adminSignup', createAdminAccountLimiter, requireAuth, checkSuperadmin, verifiedAccount, authController.adminSignup_post);

router.get('/login', createLoginLimiter, authController.login_get);
router.post('/login', createLoginLimiter, authController.login_post);

router.get('/logout', authController.logout_get);
router.get('/restricted', authController.restricted_get);

router.get('/userReg', requireAuth, verifiedAccount, checkcust, authController.userReg_get);
router.post('/userReg', requireAuth, verifiedAccount, checkcust, authController.userReg_post);

router.get('/confirmation/:id', requireAuth, authController.confirmation_Post);
//router.post('/resend', authController.resendToken_Post);

router.get('/tanks', requireAuth, verifiedAccount, checkcust, authController.userData_get);
router.get('/report', requireAuth, verifiedAccount,checkadmin, authController.report_get);
router.get('/statistics', requireAuth, verifiedAccount, checkcust, authController.userStatistics_get);
router.get('/name/:id', requireAuth, verifiedAccount,checkadmin,  authController.name_get);
router.get('/area/:id', requireAuth, verifiedAccount,checkadmin,  authController.area_get);


router.post("/notice" , requireAuth, verifiedAccount, checkadmin, authController.notice_post);



router.delete('/remove/:id', requireAuth, verifiedAccount, checkadmin, authController.remove_delete);
router.delete('/removeAdmin/:id', requireAuth, verifiedAccount, checkSuperadmin, authController.removeAdmin_delete);

router.put('/update', requireAuth, verifiedAccount, checkadmin, authController.user_put);
router.put('/readings/:id', requireAuth, verifiedAccount, checkcust, authController.readings_put);
module.exports = router;
