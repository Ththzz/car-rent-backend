const prisma = require('../config/prisma')

exports.create = async(req,res)=> {
    try{
        const { type_name } = req.body
        const car_type = await prisma.car_type.create({
            data:{
                type_name: type_name
            }
        })
        res.send(car_type)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Server Error!!"
        })
    }
}

exports.list = async(req,res)=> {
    try{
        const car_type = await prisma.car_type.findMany()
        res.send(car_type)   
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.remove = async(req,res)=> {
    try{
        const { type_id } = req.params
        const car_type = await prisma.car_type.delete({
            where: {
                type_id: Number(type_id)
            }
        })
        res.send(car_type)   
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.update = async (req,res) => {
    try{
        const { type_id } = req.params
        const { type_name } = req.body

        const car_type = await prisma.car_type.update({
            where:{
                type_id: Number(type_id)
            },
            data:{
                type_name : type_name
            }
        })

        res.send(car_type)

    }catch(err){

        console.log(err)

        res.status(500).json({
            message:"Server Error"
        })

    }
}