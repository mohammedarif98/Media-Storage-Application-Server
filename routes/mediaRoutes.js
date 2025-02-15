import express from 'express';
import { deleteMedia, getImageCollection, getVideoCollection, updateMedia, uploadMedia } from '../controllers/mediaController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import multer from 'multer';



const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/image-collection", authenticateUser, getImageCollection );
router.get("/vedio-collection", authenticateUser, getVideoCollection );

router.post("/upload-media", authenticateUser, upload.single('file'), uploadMedia);

router.put("/update-media/:mediaId", authenticateUser, upload.single('file'), updateMedia);

router.delete("/delete-media/:mediaId", authenticateUser, deleteMedia);



export default router;