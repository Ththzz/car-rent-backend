//step import ...
const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
  origin: ["https://ththzz.github.io"]
}))

app.use('/car_img', express.static(path.join(__dirname, 'car_img')))

readdirSync('./routes')
.map((c)=> app.use('/api', require('./routes/'+c)))

//Start server
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
)