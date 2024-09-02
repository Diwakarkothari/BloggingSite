const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const Blog= require('../models/blog');
const Comment = require('../models/comments');

const router = Router();

const storage = multer.diskStorage({
    destination:function (req,res,cb){
        cb(null,path.resolve(`./public/uploads`))
    },
    filename:function(req,file,cb){
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null,filename)
    }
});

const upload = multer({storage:storage});

router.get('/add-new',(req,res)=>{
    res.render('addBlog',{
        user:req.user
    });
})

router.get('/:id', async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog:blog
    })
})

router.post('/',upload.single('coverImage'),async(req,res)=>{
    // console.log(req.body);
    const {title,body} = req.body
    const blog = await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.post('/comment/:blogId', async(req,res)=>{
    const comment = await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports=router;