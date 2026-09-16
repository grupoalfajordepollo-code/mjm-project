import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)){
        cb(null, true);
    }else {
        cb(new Error ("Solo se permiten archivos JPEG, PNG o WEBP"), false)
    }
};

const upload = multer ({
    storage,
    fileFilter,
    limits: {fileSize: 10 * 1024 * 1024}
})


export default upload;