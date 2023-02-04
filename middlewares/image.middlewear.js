// import cloudinaryUpload from "../utils/upload.helper.js";
import cloudinary from "../configs/cloudinary.config.js"; 

const imageUpload = async (path) => {
  try {  
    const result = await cloudinary.uploader.upload( path,
      { folder: "my_brand" } 
    );  
    return result.url;
    
  } catch (error) {
    console.log(error);
  }
};

export default imageUpload;
