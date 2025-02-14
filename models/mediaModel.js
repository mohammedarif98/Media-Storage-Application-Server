import mongoose from 'mongoose';


const mediaSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    filename: {
        type: String,
    },
    url: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'video'],
    },   
    key: {
        type: String,
    },
},
{ timestamps: true }
);


const Media = mongoose.model("Media", mediaSchema);
export default Media;