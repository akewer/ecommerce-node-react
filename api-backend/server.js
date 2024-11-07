const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
//---------------------------My controller-------------------
const UserController = require('./controllers/UserController')
const ProductController = require('./controllers/ProductController')
const SaleController = require('./controllers/SaleController')



//-----------------------------use modules------------------------------
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

//-------------------------------use controller-------------------------
app.use('/user', UserController);
app.use('/product', ProductController);
app.use('/api/sale', SaleController)


app.listen('3001', ()=>{
    console.log("server start on port 3001")
})