import express from 'express';
import { deleteMedia, updateMedia, uploadMedia } from '../controllers/mediaController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import multer from 'multer';



const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/upload-media", authenticateUser, upload.single('file'), uploadMedia);
router.put("/update-media/:mediaId", authenticateUser, upload.single('file'), updateMedia);
router.delete("/delete-media/:mediaId", authenticateUser, deleteMedia);



export default router;