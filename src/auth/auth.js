const jwt = require('jsonwebtoken');

const tokenverification = function(req,res,next)
{
    try{
    let token = req.headers["x-api-key"];
    if(!token)return res.status(401).send({status:false, message:"Please enter token in header"});
    // optional function 
        jwt.verify(token,"Project3",(error,decodedToken)=>{
            if(error) return  res.status(401).send({status:false, message:error.message});
            req.userId = decodedToken.userId;
            next();
         });
    }
    catch(error){
        res.status(500).send({status:false, message:error.message});

    }
}

module.exports = {
    tokenverification
}