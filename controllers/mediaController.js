import Media from "../models/mediaModel.js";
import { uploadToS3, deleteFromS3 } from "../utils/aws.s3.bucket/s3Service.js";
import ApiError from "../utils/apiError.js";
import multer from 'multer';



const storage = multer.memoryStorage();
const upload = multer({ storage });


const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
];


export const uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ApiError("File is required", 400));
        }

        const { mimetype, buffer, originalname } = req.file;

        if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
            return next(
                new ApiError(
                    `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
                    400
                )
            );
        }

        const filename = `file_${Date.now()}_${originalname}`;
        const fileName = `media/${req.user._id}/${filename}`;

        const { url, key } = await uploadToS3(buffer, fileName, mimetype);
 
        const media = await Media.create({
            user: req.user._id,
            filename,
            url,
            key,
            fileType: mimetype.startsWith("image/") ? "image" : "video",
        });

        res.status(201).json({
            message: "Media uploaded successfully",
            media,
        });
    } catch (error) {
        next(error);
    }
};



export const updateMedia = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        const newFile = req.file;

        if (!mediaId) {
            return next(new ApiError("Media ID is required", 400));
        }

        const existingMedia = await Media.findOne({
            _id: mediaId,
            user: req.user._id,
        });

        if (!existingMedia) {
            return next(new ApiError("Media not found", 404));
        }

        if (newFile) {
            const { mimetype, buffer, originalname } = newFile;

            if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
                return next(
                    new ApiError(
                        `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
                        400
                    )
                );
            }

            const filename = `file_${Date.now()}_${originalname}`;
            const fileName = `media/${req.user._id}/${filename}`;

            await deleteFromS3(existingMedia.key);

            const { url, key } = await uploadToS3(buffer, fileName, mimetype);

            const updatedMedia = await Media.findOneAndUpdate(
                { _id: mediaId, user: req.user._id },
                {
                    filename,
                    url,
                    key,
                    fileType: mimetype.startsWith("image/") ? "image" : "video",
                },
                { new: true }
            );

            return res.status(200).json({
                message: "Media updated successfully",
                media: updatedMedia,
            });
        }
        return next(new ApiError("No file uploaded for update", 400));
    } catch (error) {
        next(error);
    }
};




export const deleteMedia = async (req, res, next) => {
    try {
        const { mediaId } = req.params;

        if (!mediaId) return next(new ApiError("Media ID is required", 400));

        const media = await Media.findOne({ _id: mediaId, user: req.user._id });
        if (!media) return next(new ApiError("Media not found", 404));

        await deleteFromS3(media.key);
        await Media.deleteOne({ _id: mediaId });

        res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
        next(error);
    }
};
