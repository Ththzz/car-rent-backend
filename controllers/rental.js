const prisma = require('../config/prisma')

exports.create = async (req,res) => {
    try {

        const {
            car_id,
            cust_id,
            rent_date,
            return_due_date,
            actual_return_date,
            pickup_place
        } = req.body

        const car = await prisma.car.findUnique({
            where:{
                plate_id: car_id
            }
        })

        if(!car){
            return res.status(404).json({
                message:"Car not found"
            })
        }

        if(car.car_status !== "AVAILABLE"){
        return res.status(400).json({
            message:"Car is not available"
        })
        }

        const customer = await prisma.customer.findUnique({
        where:{
            user_id:req.user.user_id
        }
        })

        if(!customer){
        return res.status(404).json({
            message:"Customer not found"
        })
        }

        const start = new Date(rent_date)
        const end = new Date(return_due_date)
        if(end <= start){
            return res.status(400).json({
                message:"Return date must be after rent date"
            })
            }

        const diffTime = end - start
        const days = Math.ceil(diffTime / (1000*60*60*24))

        const deposit = Number(car.deposit)

        const rental_price = Number(car.price_per_day) * days

        const total_price = rental_price + deposit

        const rental = await prisma.rental.create({
            data:{
                car:{
                    connect:{
                        plate_id: car_id
                    }
                },

                customer:{
                    connect:{
                        cust_id: Number(cust_id)
                    }
                },

                rent_date: start,
                return_due_date: end,
                actual_return_date: actual_return_date ? new Date(actual_return_date) : null,
                pickup_place,
                deposit: deposit,
                total_price: total_price,
                rent_status: "pending"
            }
        })

        res.send({
            rental,
            days,
            rental_price,
            deposit,
            total_price
        })

    } catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}


exports.list = async (req,res) => {
    try{

        const rental = await prisma.rental.findMany({
            orderBy:{
                rent_id:"desc"
            },
            include:{
                car:true,
                customer:true,
                payment:true
            }
        })

        res.send(rental)

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



exports.read = async (req,res) => {
    try{

        const {id} = req.params

        const rental = await prisma.rental.findUnique({
            where:{
                rent_id:Number(id)
            },
            include:{
                car:true,
                customer:true,
                payment:true
            }
        })

        if(!rental){
            return res.status(404).json({
                message:"Rental not found"
            })
        }

        res.send(rental)

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



exports.update = async (req,res) => {
    try{

        const {id} = req.params

        const {
            car_id,
            cust_id,
            rent_date,
            return_due_date,
            actual_return_date,
            pickup_place,
            rent_status
        } = req.body
        
        let fine = 0

        const start = new Date(rent_date)
        const end = new Date(return_due_date)

        const days = Math.ceil((end - start) / (1000*60*60*24))

        // ดึงข้อมูลรถ
        const car = await prisma.car.findUnique({
            where:{
                plate_id: car_id
            }
        })

        const deposit = Number(car.deposit)
        const rental_price = Number(car.price_per_day) * days
        const total_price = rental_price + deposit

        if(actual_return_date){

            const late = new Date(actual_return_date) - new Date(return_due_date)

            if(late > 0){
                const lateDays = Math.ceil(late / (1000*60*60*24))
                fine = lateDays * 500
            }

        }

        const rental = await prisma.rental.update({
            where:{
                rent_id:Number(id)
            },
            data:{

                car:{
                    connect:{
                        plate_id: car_id
                    }
                },

                customer:{
                    connect:{
                        cust_id: Number(cust_id)
                    }
                },

                rent_date:start,
                return_due_date:end,
                actual_return_date: actual_return_date ? new Date(actual_return_date) : null,
                pickup_place,
                deposit: deposit,
                total_price: total_price,
                fine:fine,
                rent_status
            }
        })

        if(rent_status === "returned"){

            await prisma.car.update({
                where:{
                    plate_id: car_id
                },
                data:{
                    car_status:"AVAILABLE"
                }
            })

        }

        res.send(rental)

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



exports.remove = async (req,res) => {
    try{

        const {id} = req.params

        const existing = await prisma.rental.findUnique({
            where:{
                rent_id:Number(id)
            }
        })

        if(!existing){
            return res.status(404).json({
                message:"Rental not found"
            })
        }

        if(existing.rent_status === "renting"){
            return res.status(400).json({
                message:"Cannot delete rental that is currently renting"
            })
        }

        const rental = await prisma.rental.delete({
            where:{
                rent_id:Number(id)
            }
        })

        res.json({
            message:"Rental deleted successfully",
            data:rental
        })

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}