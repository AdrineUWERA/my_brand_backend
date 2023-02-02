import multer from "multer"

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        /* istanbul ignore next */
        cb(null, `${new Date().toISOString()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    /* istanbul ignore next */
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        /* istanbul ignore next */
        cb(null, true);
    } else {
        /* istanbul ignore next */
        cb({ message: 'unsupported file format' }, false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

export default upload
