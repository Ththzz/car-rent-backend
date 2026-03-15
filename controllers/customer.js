const prisma = require('../config/prisma')

// CREATE CUSTOMER
exports.create = async (req,res)=>{
    try{

        const { cust_fname, cust_lname, cust_tel, license_num } = req.body

        if(!cust_fname || !cust_lname || !cust_tel || !license_num){
            return res.status(400).json({
                message:"Fields are required"
            })
        }

        const existingCustomer = await prisma.customer.findUnique({
            where:{
                user_id:req.user.user_id
            }
        })

        if(existingCustomer){
            return res.status(400).json({
                message:"Customer already exists"
            })
        }

        const customer = await prisma.customer.create({
            data:{
                cust_fname,
                cust_lname,
                cust_tel,
                license_num,
                user:{
                    connect:{
                        user_id:req.user.user_id
                    }
                }
            }
        })

        res.status(201).json(customer)

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}


// LIST CUSTOMER (ADMIN)
exports.list = async (req,res)=>{
    try{

        const customers = await prisma.customer.findMany({
            orderBy:{
                cust_id:"asc"
            },
            include:{
                user:{
                    select:{
                        email:true,
                        role:true
                    }
                }
            }
        })

        res.json(customers)

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}


// CUSTOMER PROFILE
exports.profile = async (req,res)=>{
    try{

        const customer = await prisma.customer.findUnique({
            where:{
                user_id:req.user.user_id
            },
            include:{
                rentals:true
            }
        })

        res.json({
            message:"Customer Profile",
            data:customer
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}

//UpdatProfile
exports.updateProfile = async (req,res)=>{
 try{

  const { cust_fname, cust_lname, cust_tel, license_num } = req.body

  const customer = await prisma.customer.update({
   where:{
    user_id:req.user.user_id
   },
   data:{
    cust_fname,
    cust_lname,
    cust_tel,
    license_num
   }
  })

  res.json(customer)

 }catch(err){
  console.log(err)
  res.status(500).json({
   message:"Server Error"
  })
 }
}

// UPDATE (Admin)
exports.update = async (req,res)=>{
    try{

        const { cust_id } = req.params
        const { cust_fname, cust_lname, cust_tel, license_num } = req.body

        const existingCustomer = await prisma.customer.findUnique({
            where:{
                cust_id:Number(cust_id)
            }
        })

        if(!existingCustomer){
            return res.status(404).json({
                message:"Customer not found"
            })
        }

        // owner หรือ admin เท่านั้น
        if(existingCustomer.user_id !== req.user.user_id && req.user.role !== "admin"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }

        const customer = await prisma.customer.update({
            where:{
                cust_id:Number(cust_id)
            },
            data:{
                cust_fname,
                cust_lname,
                cust_tel,
                license_num
            }
        })

        res.json(customer)

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}


// DELETE CUSTOMER
exports.remove = async (req,res)=>{
    try{

        const { cust_id } = req.params

        const rental = await prisma.rental.findFirst({
            where:{
                cust_id:Number(cust_id)
            }
        })

        if(rental){
            return res.status(400).json({
                message:"Customer has rental history"
            })
        }

        const customer = await prisma.customer.delete({
            where:{
                cust_id:Number(cust_id)
            }
        })

        res.json(customer)

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }
}