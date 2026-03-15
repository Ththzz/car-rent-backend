const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

exports.register = async(req,res)=> {
    //code
    try{
        //code
        const { email, password } = req.body

        //step 1 validate body
        if(!email) {
            return res.status(400).json({
                message: "Email is required"
            })
        }
        if(!password){
            return res.status(400).json({
                message: "Password is required"
            })
        }

        //step 2 Check email in db alerdy
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
        if(user){
            return res.status(400).json({
                message: "Emaili already exits!!"
            })
        }
        //step3 HashPassword
        const hashPassword = await bcrypt.hash(password,10)
        

        //step4 register
        const newUser = await prisma.user.create({
            data: {
                email : email,
                password : hashPassword
            },
            select:{
            user_id: true,
            email: true,
            role: true,
            create_at: true
            }
        })


        res.json({
            message: "Register Success!!",
            user: newUser
        })
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }   
}

exports.login = async(req,res)=> {
    //code
    try{
        //code
        const { email, password } = req.body
        if(!email){
            return res.status(400).json({
                message:"Email is required"
            })
        }

        if(!password){
            return res.status(400).json({
                message:"Password is required"
            })
        }
        //step 1 check email
        const user = await prisma.user.findUnique({
            where:{
                email:email
            } 
        })
        if(!user){
            return res.status(400).json({
                message: "User Not Found!"
            })
        }

        //step 2 check password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message: "Password Invalid"
            })
        }

        //step 3 Create Payload
        const payload = {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        }
        
        //step 4 Generate Token
        jwt.sign(payload,process.env.SECRET,{
            expiresIn:'1d'},(err,token)=>{
                if(err){
                    return res.status(500).json({
                        message: "Server Error"
                    })
                }
                res.json({token})
            })
    }catch(err){
        //err
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }   
}

exports.currentUser = async(req,res)=> {
    try{

        res.json({
            message:"Current User",
            user:req.user
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }   
}

exports.currentAdmin = async(req,res)=> {
    try{

        res.json({
            message:"Current Admin",
            user:req.user
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }   
}



