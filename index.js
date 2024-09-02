// In AWS change the file name to app.js instead of index.js
// also change the same in package.json
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');

const Blog=require('./models/blog');

const mongoose = require('mongoose');


//  FOR DEPLOYMENT
// mongoose.connect(process.env.MONGO_URL).
//     then((e)=>console.log("MongoDB Connected Successfully"));

mongoose.connect('mongodb://localhost:27017/blogify').
    then((e)=>console.log("MongoDB Connected Successfully"));

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');

const checkForAuthentication = require('./middlewares/authentication');

const app=express();
// for deployment 
const PORT = process.env.PORT || 8000;

// form data ko database mein dalne ke liye
app.use(express.urlencoded({extended:false}));
app.use(cookieparser())
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve('./public')));

app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use("/user",userRoutes);
app.use('/blog',blogRoutes);

app.get('/', async(req,res)=>{
    const allblogs = await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allblogs
    });
})

app.listen(PORT,()=> console.log('Server started at PORT ',PORT));