const checkToken= require('../services/authentication')
function checkForAuthentication(cookiename)
{
    return (req,res,next)=>{
        const value = req.cookies[cookiename];
        if(!value)
        {
            return next(); 
        }

        try {
            const payload = checkToken(value);
            req.user=payload;
            res.locals.user=payload;
        } catch (error) {   }
        return next();
    }
}

module.exports=checkForAuthentication