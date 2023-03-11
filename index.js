const express = require('express');
const { date } = require('joi');
const app = express();
const  cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
// router
const employee = require('./router/employee');
const employer = require('./router/employer');
const job = require('./router/job')


mongoose.connect(process.env.Database_Url)
.then(()=>console.log("successfully connect"))
.catch((err)=>console.log("failed to connect",err));

//middleware
app.use(cors())
app.use(express.json())
app.use("/api/employee",employee)
app.use("/api/employer",employer)
app.use("/api/job",job)

const port = process.env.PORT
app.listen(port,()=>console.log(`listen on port no ${port}`))