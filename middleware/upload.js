const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "car_img/")
    },

    filename: function(req, file, cb){

        const now = new Date()

        const thailandTime = now.toLocaleString("sv-SE", {
            timeZone: "Asia/Bangkok"
        }).replace(/[-: ]/g,"")

        const random = Math.floor(Math.random() * 10000)

        const ext = file.originalname.split(".").pop()

        const fileName = `${thailandTime}_${random}.${ext}`

        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

module.exports = upload