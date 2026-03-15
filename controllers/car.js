const prisma = require("../config/prisma")

exports.create = async(req,res)=> {
    try{
        const { 
            plate_id,
            brand,
            model,
            color,
            mileage,
            price_per_day,
            deposit,
            car_status,
            detail,
            type_id
        } = req.body

        const existingCar = await prisma.car.findUnique({
            where:{ plate_id }
        })

        if(existingCar){
            return res.status(400).json({
                message:"Plate already exists"
            })
        }


        const car = await prisma.car.create({
            data:{
                plate_id: plate_id,
                brand: brand,
                model: model,
                color: color,
                mileage: Number(mileage),
                price_per_day: Number(price_per_day),
                deposit: Number(deposit),
                car_status: car_status,
                car_image: req.file ? req.file.filename : null,
                detail: detail,

                type:{
                    connect:{
                        type_id: Number(type_id)
                    }
                }
            }
        })
        res.send(car)   
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.list = async(req,res)=> {
    try{
        const car = await prisma.car.findMany({
            orderBy:{
                create_at:"desc"
            },
            include:{
                type:true
            }
        })
        res.send(car)   
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.read = async(req,res)=>{
 try{

  const { plate_id } = req.params

  const car = await prisma.car.findUnique({
   where:{ plate_id },
   include:{
    type:true
   }
  })

  res.send(car)

 }catch(err){
  console.log(err)
  res.status(500).json({
   message:"Server Error"
  })
 }
}

exports.remove = async(req,res)=> {
    try{
        const { plate_id } = req.params
        const car = await prisma.car.delete({
            where: {
                plate_id: plate_id
            }
        })
        res.send(car)   
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.update = async (req,res) => {
    try{
        const { plate_id } = req.params
        const { 
            brand,
            model,
            color,
            mileage,
            price_per_day,
            car_status,
            detail,
            type_id
        } = req.body

        const oldCar = await prisma.car.findUnique({
            where:{
                plate_id: plate_id
            }
        })

        const car = await prisma.car.update({
            where:{
                plate_id: plate_id
            },
            data:{
                brand: brand,
                model: model,
                color: color,
                mileage: Number(mileage),
                price_per_day: Number(price_per_day),
                car_status: car_status,
                detail: detail,

                car_image: req.file ? req.file.filename : oldCar.car_image,

                type:{
                    connect:{
                        type_id: Number(type_id)
                    }
                }
            }
        })

        res.send(car)

    }catch(err){

        console.log(err)

        res.status(500).json({
            message:"Server Error"
        })

    }
}