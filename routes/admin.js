var express = require('express');
var router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Set the destination folder for uploaded files (create the 'uploads' folder)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set a unique file name for each uploaded file
    }
});

const upload = multer({ storage: storage }); 

const admincontroller=require('../controller/admincontroller')

 

router.get('/dashboard',admincontroller.dashboard)
router.get('/login',admincontroller.login)
router.post('/login',admincontroller.loginpost)
router.post('/create',admincontroller.createpost)
router.get('/create',admincontroller.displaycreate)
router.get('/delete/:id', admincontroller.deleteid);
router.get('/edit/:id', admincontroller.edit);
router.post('/update/:id', admincontroller.update);
router.get('/logout', admincontroller.logout);
router.get('/product_dashboard', admincontroller.product_dashboard);
router.get('/create_new_product', admincontroller.create_new_product);
router.post('/addproductpost', upload.fields([{
    name: 'image', maxCount: 1
    } ]), admincontroller.addproductpost);
router.get('/deleteproduct/:id', admincontroller.deleteproduct);
router.get('/editproduct/:id', admincontroller.editproduct);
router.post('/updateproduct/:id', admincontroller.updateproduct);



module.exports = router;
