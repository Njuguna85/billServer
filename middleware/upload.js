const multer = require('multer')

const excelFilter = (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
        cb(null, true);
    } else {
        cb('Please upload only excel file')
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-$${req.user.id}-${file.originalname}`);
    },

})

const uploadFiles = multer({ storage: storage, fileFilter: excelFilter });

module.exports = uploadFiles