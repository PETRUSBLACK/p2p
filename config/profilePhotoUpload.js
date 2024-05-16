import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config();

//configure
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

//create instance
const storage  = new CloudinaryStorage({
    cloudinary,
    allowedFormats:["jpg","png","svg","jpeg"],
    params:{
        folder: "P2P Crypto Currency",
        transformation:[{width:400,height:400,crop:"limit"}]
    },
});

export default storage;