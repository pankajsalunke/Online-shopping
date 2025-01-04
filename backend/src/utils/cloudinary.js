import { v2 as cloudinary } from "cloudinary";
import fs from "fs";



// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        // upload File on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        fs.unlinkSync(localFilePath)
        
        return response;
      
    } catch (error) {
        fs.unlinkSync(localFilePath)  //It removes the locally saved files as the upload operation got failled
        return null;

    }
}


export { uploadOnCloudinary }