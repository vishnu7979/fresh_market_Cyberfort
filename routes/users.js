var express = require('express');
var router = express.Router();

const usercontroller=require('../controller/usercontroller')
 
router.get('/',usercontroller.login)
router.post('/login',usercontroller.loginpost)
router.get('/signout',usercontroller.signout)
router.get('/signup',usercontroller.signup)
router.post('/signup',usercontroller.signuppost)
router.get('/login',usercontroller.login)
router.get('/home',usercontroller.home)
router.get('/shop',usercontroller.shop)
router.get('/shop-detail',usercontroller.shop_detail)
router.get('/chackout',usercontroller.chackout)
router.get('/testimonial',usercontroller.testimonial)
router.get('/404',usercontroller.fnf)
router.get('/contact',usercontroller.contact)
router.post('/addtocart', usercontroller.addtocart);
router.get('/cart',usercontroller.cart);
router.post('/cart/remove/:itemId',usercontroller.removeCartItem);

 






module.exports = router;
 