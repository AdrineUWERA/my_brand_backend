// import cloudinaryUpload from "../utils/upload.helper.js";
import cloudinary from "../configs/cloudinary.config.js";
import fileUpload from "express-fileupload"

const imageUpload = async (req, res, next) => {
  try {
    console.log(req.files)
    const tmp = req.files.coverImage;
    const result = await cloudinary.uploader.upload(
      tmp,
      { folder: "my-brand" },
      (_, result) => result
    );
    req.body.coverImage = result.url;
    return next();
  } catch (error) {
    console.log(error);
  }
};

export default imageUpload;
