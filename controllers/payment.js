const prisma = require('../config/prisma')


// CREATE Payment
exports.create = async (req, res) => {
    try {

        const { rent_id, pay_channel, pay_date } = req.body

        const rental = await prisma.rental.findUnique({
            where:{
                rent_id:Number(rent_id)
            }
        })

        if(!rental){
            return res.status(404).json({
                message:"Rental not found"
            })
        }

        if(rental.rent_status !== "pending"){
            return res.status(400).json({
                message:"Rental is not pending"
            })
        }

        const existingPayment = await prisma.payment.findFirst({
            where:{
                rent_id:Number(rent_id)
            }
        })

        if(existingPayment){
            return res.status(400).json({
                message:"Payment already exists"
            })
        }

        let payType
        let payAmount

        if(pay_channel === "cash"){
            payType = "deposit"
            payAmount = rental.deposit
        }
        else if(pay_channel === "transfer" || pay_channel === "credit_card"){
            payType = "rental_fee"
            payAmount = rental.total_price
        }
        else{
            return res.status(400).json({
                message:"Invalid pay_channel"
            })
        }

        const payment = await prisma.payment.create({
            data:{
                rental:{
                    connect:{
                        rent_id:Number(rent_id)
                    }
                },
                pay_channel,
                pay_type:payType,
                pay_date: pay_date ? new Date(pay_date) : new Date(),
                pay_amount:payAmount
            }
        })

        await prisma.rental.update({
            where:{
                rent_id:Number(rent_id)
            },
            data:{
                rent_status:"active"
            }
        })

        
        res.json({
            message:"Payment successful",
            data:payment
        })

    } catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



// GET ALL Payment
exports.list = async (req,res)=>{
    try{

        const payment = await prisma.payment.findMany({
            orderBy:{
                pay_id:"desc"
            },
            include:{
                rental:true
            }
        })

        res.send(payment)

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



// GET ONE Payment
exports.read = async (req,res)=>{
    try{

        const {id} = req.params

        const payment = await prisma.payment.findUnique({
            where:{
                pay_id:Number(id)
            },
            include:{
                rental:true
            }
        })

        if(!payment){
            return res.status(404).json({
                message:"Payment not found"
            })
        }

        res.send(payment)

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



// UPDATE Payment
exports.update = async (req,res)=>{
    try{

        const {id} = req.params
        const { pay_channel, pay_type, pay_date } = req.body

        const existing = await prisma.payment.findUnique({
            where:{
                pay_id:Number(id)
            }
        })

        if(!existing){
            return res.status(404).json({
                message:"Payment not found"
            })
        }

        const payment = await prisma.payment.update({
            where:{
                pay_id:Number(id)
            },
            data:{
                pay_channel,
                pay_type,
                pay_date: pay_date ? new Date(pay_date) : existing.pay_date
            }
        })

        res.json(payment)

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}



// DELETE Payment
exports.remove = async (req,res)=>{
    try{

        const {id} = req.params

        const existing = await prisma.payment.findUnique({
            where:{
                pay_id:Number(id)
            }
        })

        if(!existing){
            return res.status(404).json({
                message:"Payment not found"
            })
        }

        const payment = await prisma.payment.delete({
            where:{
                pay_id:Number(id)
            }
        })

        res.json({
            message:"Payment deleted",
            data:payment
        })

    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}