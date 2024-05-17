const multer = require('multer');

let storageHab = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/habitaciones')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
let storageInc = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/incidencias')
    },
    filename: storageHab.filename
});

let uploadHab = multer({storage: storageHab});
let uploadInc = multer({storage: storageInc});

module.exports = {
    uploadHab: uploadHab,
    uploadInc: uploadInc
};

