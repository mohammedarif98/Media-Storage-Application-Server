import express from "express";
import { userLogin, userLogout, userRegistration } from "../controllers/authController.js";


const router = express.Router();

router.post('/user-register', userRegistration);
router.post('/user-login', userLogin);
router.post('/user-logout', userLogout);


export default router;