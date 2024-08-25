const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogify').
    then(console.log("MongoDB Connected Successfully"));

const userRoutes = require('./routes/user');
const checkForAuthentication = require('./middlewares/authentication');

const app=express();
const PORT = 8000;

// form data ko database mein dalne ke liye
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieparser())
app.use(checkForAuthentication("token"));

app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use("/user",userRoutes);

app.get('/',(req,res)=>{
    res.render('home',{
        user:req.user,
    });
})

app.listen(PORT,()=> console.log('Server started at PORT ',PORT));