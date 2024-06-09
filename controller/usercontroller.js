const collection = require("../models/mongodb")
const Product = require("../models/product")
const CartItem = require("../models/cart");


// const bcrypt = require('bcrypt');

const login=(req,res)=>{
     if(req.session.user){
        res.redirect('/home')
     }else{
        res.render('user/login',{msg:''})
     }
}
 
 


const loginpost=async (req,res)=>{

    try{
        const check = await collection.findOne({email:req.body.email})

        if(check.password===req.body.password){
            req.session.user = req.body.email
            const msg1=req.body.email;

            
    const searchQuery = req.query.search || ''; 
 
    const productz = await Product.find({
     name: { $regex: searchQuery, $options: 'i' },
   });


            res.render("user/home",{msg1,productz})
        }
        else{
            res.send("Wrong Password!!!...")
        }

    }catch{

        res.send("wrong details!!!...")

    }

}

const signout=(req,res)=>{
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
}

const signup=(req,res)=>{
    res.render('user/signup',{msg:''})
}

//signup post 
const signuppost =async (req,res)=>{
     const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
        // password: await bcrypt.hash(req.body.password, 10),
    }
    await collection.create(data);
 res.render('user/login',{msg:''})
}


const home= async (req,res)=>{

    const searchQuery = req.query.search || ''; 
 
    const productz = await Product.find({
     name: { $regex: searchQuery, $options: 'i' },
   });

   
    if(req.session.user){
        res.render('user/home', {  productz });
    }
    else{
        res.redirect("/login")
    }
}

 
 
const cart = async (req, res) => {
    console.log('show cart');
    try {
        if (req.session.user) {
            const user = await collection.findOne({ email: req.session.user });
            const products = await Product.find();

            const cartItems = await CartItem.find({ userId: user._id }).populate('productId');

            // Initialize total price array
            const totalPrices = [];

            // Iterate through the cart items and calculate the total prices
            const cartItemsWithProductDetails = cartItems.map(cartItem => {
                const product = cartItem.productId;
                const item = {
                    productId: product._id,
                    quantity: cartItem.quantity,
                    price: product.price,
                    name: product.name,
                    description: product.description,
                    image: product.image
                };
                const totalPriceForItem = item.quantity * item.price;
                totalPrices.push(totalPriceForItem);
                return item;
            });

           

            // Sum the total prices to get the overall total price
            const overallTotalPrice = totalPrices.reduce((acc, price) => acc + price, 0);

            req.session.totalPrice = overallTotalPrice;

            res.render('user/cart', {
                cartItems: cartItemsWithProductDetails,
                totalPrices,
                overallTotalPrice,
                user,
                products
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.render('error');
    }
};

// const removeCartItem = async (req, res) => {
//     const itemId = req.params.itemId;
//     console.log("item id is",itemId );
  
//     try {
//       await CartItem.findByIdAndDelete(itemId);
//       res.redirect("/cart");
//     } catch (error) {
//       console.error(error);
//       res.render('error')
//     }
//   };

  const removeCartItem = async (req, res) => {
    const itemId = req.params.itemId;
    console.log("item id is",itemId );
  
    try { 
        await CartItem.findByIdAndRemove(itemId);
        res.redirect("/cart");
    } catch (error) { 
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to remove item from cart" });
    }
  }; 
  
 
const shop=(req,res)=>{
    if(req.session.user){
        res.render("user/shop",{msg1:''})
    }
    else{
        res.redirect("/login")
    }
}

const shop_detail=(req,res)=>{
    if(req.session.user){
        res.render("user/shop-detail",{msg1:''})
    }
    else{
        res.redirect("/login")
    }
}

const chackout=(req,res)=>{
    if(req.session.user){
        res.render("user/chackout",{msg1:''})
    }
    else{
        res.redirect("/login")
    }
}

const testimonial=(req,res)=>{
    if(req.session.user){
        res.render("user/testimonial",{msg1:''})
    }
    else{
        res.redirect("/login")
    }
}

const fnf=(req,res)=>{
    if(req.session.user){
        res.render("user/404",{msg1:''})
    }
    else{
        res.redirect("/login")
    }
}

const contact=(req,res)=>{
    if(req.session.user){
        res.render("user/contact",{msg1:''})
    }
    else{
        res.redirect("/login")
    }
}


 

const addtocart = async (req, res) => {
    
    if (req.session.user) {
      const { id } = req.query; // Retrieve product ID from query parameter
      const user = await collection.findOne({ email: req.session.user });
      
      try {
        const existingCartItem = await CartItem.findOne({
          userId: user._id,
          productId: id, // Use retrieved product ID
        });
  
        if (existingCartItem) {
          existingCartItem.quantity += 1;
          await existingCartItem.save();
        } else {
          const cartItem = await CartItem.create({ userId: user._id, productId: id }); // Use retrieved product ID
        }
  
        res.redirect("/cart");
      } catch (error) {
        console.error(error);
        res.render('error')
      }
    } else {
      res.redirect("/login");
    }
};


  



module.exports={
    login,
    loginpost,
    signout,
    signuppost,
    signup,
    home,
    cart,
    shop,
    shop_detail,
    chackout,
    testimonial,
    fnf,
    contact,
    addtocart,
    removeCartItem,

    
}