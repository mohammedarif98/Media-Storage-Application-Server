import express from "express";
import { getUserProfile, userLogin, userLogout, userRegistration } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/user-register', userRegistration);
router.post('/user-login', userLogin);
router.post('/user-logout', userLogout);


router.get('/user-profile', authenticateUser,getUserProfile);


export default router;