const collection = require("../models/mongodb")
const Product = require("../models/product")
// const bcrypt = require('bcrypt');



 

const dashboard = async (req, res) => {
  if(req.session.admin){
    //here
    try {
      const searchQuery = req.query.search || ''; // Get the search query from the URL or set it to an empty string if not provided
  
      // Use a regular expression to perform a case-insensitive search
      const users = await collection.find({
        name: { $regex: searchQuery, $options: 'i' },
      });
  
      res.render('admin/dashboard', { users, searchQuery });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
    //here
  }
  else{
    res.redirect('/login')
  }
  
};






const login=(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin/dashboard')
  }
    res.render('admin/login',{msg:''})
  
  }
   


const loginpost = (req,res)=>{
    
    const name = 'admin'
    const password = 1234

    if(name === req.body.username && password ==req.body.password){
 
        //adding session 
        req.session.admin = name;

        const msg1=req.body.name;
        res.redirect('/admin/dashboard')
    }else {
        console.log('here');
        res.render('admin/login',{msg:'invalid username or password :('})
    }
}


const displaycreate=(req,res)=>{
    res.render('admin/create',{msg:""})
}

 
const createpost = async (req,res)=>{
    console.log("i am creating data");
     const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
        // password: await bcrypt.hash(req.body.password, 10),

    }

    await collection.create(data);
res.redirect("/admin/dashboard")

 }

 

 const deleteid = async (req, res) => {
    console.log("hello i am here");
    try {
      const userId = req.params.id;
  
      await collection.findByIdAndDelete(userId);
  
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  const deleteproduct = async (req, res) => {
     
    try {
      const userId = req.params.id;
  
      await Product.findByIdAndDelete(userId);
  
      res.redirect('/admin/product_dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }



const edit = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Fetch the user's details by ID
      const user = await collection.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.render('admin/edit', { user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

  const editproduct = async (req, res) => {
    try {
      const productId = req.params.id;
      // Fetch the user's details by ID
      const product = await Product.findById(productId);
      
      
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      res.render('admin/editproduct', { product });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

const update = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await collection.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
       user.name = req.body.name;
      user.email = req.body.email;
   
       await user.save();
  
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  

  const updateproduct = async (req, res) => {
    try {
      const productId = req.params.id;
       const product = await Product.findById(productId);
      console.log("updating product name is :",product);
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
       product.name = req.body.name;
      product.category = req.body.category;
      product.price = req.body.price;
   
       await product.save();
  
      res.redirect('/admin/product_dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

  const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/admin/login');
    });
  };
  

const product_dashboard = async (req, res) => {
  if (req.session.admin) {
    try {
      const searchQuery = req.query.search || '';
        

      
      const products = await Product.find({
        name: { $regex: searchQuery, $options: 'i' },
      });

      res.render('admin/product_dashboard', { products, searchQuery });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
};



const create_new_product = async (req,res)=>{
  
  if(req.session.admin){
    //here
    try {
      res.render('admin/create_new_product',{msg:""})
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
    //here
  }
  else{
    res.redirect('/login')
  }
  }

const addproductpost = async (req, res) => {

  const searchQuery = req.query.search || ''; 
 
       const products = await Product.find({
        name: { $regex: searchQuery, $options: 'i' },
      });
  
    const { name,price, category,} = req.body;
    const image = req.files.image[0] ? req.files.image[0].filename : '';
    try {
        const product = new Product({
            name,
            image,
            category,
            price,
        });

        await product.save();
        res.render('admin/product_dashboard',{products, searchQuery })
} catch (error) {
        console.error(error);
        res.render('admin/404')
      }
};
  
module.exports={

     dashboard,
     login,
     loginpost,
     createpost,
     displaycreate,
     deleteid,
     edit,
     update,
     logout,
     product_dashboard,
     create_new_product,
     addproductpost,
     deleteproduct,
     editproduct,
     updateproduct,
    
}