import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Config.js';


const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
];


export const uploadToS3 = async (fileBuffer, fileName, contentType) => {
    try {
        if (!ALLOWED_FILE_TYPES.includes(contentType)) {
            throw new Error(`Unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        }

        if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
            throw new Error('AWS bucket name or region is not configured');
        }


        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType,
            // ACL: 'public-read', 
        };

        await s3Client.send(new PutObjectCommand(params));

        const encodedFileName = fileName.split('/').map(segment => encodeURIComponent(segment)).join('/');
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodedFileName}`;

        return { url: fileUrl, key: fileName };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error(`S3 upload failed: ${error.message}`);
    }
};


export const deleteFromS3 = async (key) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };

        await s3Client.send(new DeleteObjectCommand(params));
        return { success: true };
    } catch (error) {
        throw new Error(`S3 deletion failed: ${error.message}`);
    }
};