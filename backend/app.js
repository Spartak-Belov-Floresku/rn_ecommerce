const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv/config');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');

//to allow http requestes
app.use(cors());
app.options('*', cors());

//mideleware
app.use(express.json());
//shows logs
app.use(morgan('tiny'));
// use JWT helper to block access without valid token
app.use(authJwt());

// allows as a static path not as an api endpoint
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.use(errorHandler);


//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//DB
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => console.log('Database is connected!'))
.catch(err => console.log(`Getting the error: ${err}`));

//Server
app.listen(8000, () => {
    console.log('Server is running on localhost:8000')
})