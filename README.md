# Media Capture and Storage Web Application

This is the backend of the **Media Capture and Storage Web Application**, built using **Node.js** and **Express.js**. It provides RESTful APIs for user authentication, media upload, retrieval, and deletion. The backend integrates with **MongoDB** for database storage and **AWS S3** for media file storage.

---

## Features
- **User Authentication**: use JWT-based user authentication with bcrypt, hashing the user password.
- **Media Upload**: **AWS S3** is used for Secure file upload.
- **Media Management**: Fetch and delete media files (images, vedios).
- **Database Storage**: MongoDB for storing user data and media metadata.
- **Error Handling**: Input validation and error messages.
- **Authentication Middleware**: use authentication middleware for Protected routes accessing.

---

## Tech Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Storage**: AWS S3  (backend folder)
- **Authentication**: JWT (bcrypt for password hashing)
- - **Cloud Database**: MongoDB Atlas

---

## Deployment
- **Backend Deploy**: backend hosted in Render;

---

## Setup Instructions
- **github repository link**: git clone https://github.com/your-username/media-capture-storage-app.git
   
---

## Project installation
- **install dependencies** : npm install.
- **backend start** : npm run dev 
  
- **create .env file**: .env
   # -------- server configration ---------
   PORT=3000
   NODE_ENV=production
   MONGO_URI= use your mongodb atlas connection string
   CLIENT_URL=http://localhost:5173
   
   # -------- JWT Configuration ---------
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   COOKIE_EXPIRES_IN=3600000
   
   # ---------- AWS configration ----------
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   
   # ----------- Password Hashing -------------
   BCRYPT_SALT_ROUNDS=12
     
