const {Router} = require('express');

const User = require('../models/user');

const router = Router();

router.get('/signin',(req,res)=>{
    return res.render('signin');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/');
})

router.post('/signup', async(req,res)=>{
    try {
        const { fullName, email, password } = req.body;
        await User.create({
            fullName,
            email,
            password
        });
        return res.redirect('/');
    } catch (error) {
        // Handle the error and pass it to the next middleware
        return next(error);
    }
});

router.post('/signin', async(req,res)=>{
    const {email,password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render("signin",{
            error:"Invalid email or password"
        });
    }
    // console.log("User",user);
})

module.exports = router