const {checkToken}= require('../services/authentication')
function checkForAuthentication(cookiename)
{
    return (req,res,next)=>{
        const value = req.cookies[cookiename];
        console.log("token "+value);
        if(!value)
        {
            return next(); 
        }

        const payload = checkToken(value);
        console.log('payload: ',payload);
        req.user=payload;
        res.locals.user = req.user;
            // console.log('Cookies:', req.cookies);
        return next();
    }
}

module.exports=checkForAuthentication