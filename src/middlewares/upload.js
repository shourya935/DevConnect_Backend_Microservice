const path = require("path")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {cloudinary} = require("../utils/cloudinary");


// const storage = multer.diskStorage({
//   destination:function(req,file,cb){
//      cb(null, path.join(__dirname, "../../public/images")); 
//   },
//   filename:function(req,file,cb){
//     const name = Date.now()+"-"+file.originalname
//     cb(null,name)
//   } 
// })




const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dffu7wfxc", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, or .png files are allowed"));
    }
  }
});

module.exports = {upload}