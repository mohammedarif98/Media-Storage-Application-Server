import express from "express";
import { getDashboard, getUserProfile, userLogin, userLogout, userRegistration } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/user-register', userRegistration);
router.post('/user-login', userLogin);
router.post('/user-logout', userLogout);


router.get('/user-dashboard', authenticateUser,getDashboard);  
router.get('/user-profile', authenticateUser,getUserProfile); 


export default router;