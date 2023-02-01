import cloudinaryUpload from "../utils/upload.helper.js";

const imageUpload = async (req, res, next) => {
    console.log(req);
    if (req.files.length !== 0) {
        const files = req.files;
        const { path } = files[0];
        const fileUploaded = await cloudinaryUpload(path);
        const url = fileUploaded.url;

        req.body.coverImage = url;
        return next();
    }
  return next();
};

export default imageUpload;
