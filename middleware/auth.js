const jwt = require('jsonwebtoken')

exports.auth = async (req,res,next)=>{
    try{

        const headerToken = req.headers.authorization

        if(!headerToken){
            return res.status(401).json({
                message:"No Token, Authorization Denied"
            })
        }

        const token = headerToken.split(" ")[1]

        const decode = jwt.verify(token,process.env.SECRET)

        req.user = decode

        next()

    }catch(err){
        console.log(err)
        res.status(401).json({
            message:"Token Invalid"
        })
    }
}

exports.admin = async(req,res,next)=>{
    try{

        if(req.user.role !== "admin"){
            return res.status(403).json({
                message:"Admin Access Denied"
            })
        }

        next()

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}